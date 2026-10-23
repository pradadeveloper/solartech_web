import { after, NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { contactLeadSchema, INVOICE_MAX_BYTES, INVOICE_TYPES, quoteLeadSchema } from "@/lib/lead-schema";
import { computeQuote, QuoteError, referenceTariff, scoreLead, type QuoteResult } from "@/lib/quote-engine";
import { clientIp, hashIp, leadsDryRun, rateLimited, verifyTurnstile } from "@/lib/server/security";
import { dispatchLeadNotifications, type LeadNotification } from "@/lib/server/notify";
import { renderQuotePdf } from "@/lib/server/quote-pdf";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendToSolartechApp, solartechAppConfigured, type OfficialQuote } from "@/lib/server/solartech-app";
import { ATTRIBUTION_COOKIE } from "@/lib/attribution";
import { POLICY_VERSION } from "@/content/legal";

// Recibe leads del cotizador y del formulario de contacto (multipart/form-data):
//   payload  → JSON con los campos (validado con Zod)
//   factura  → archivo opcional (PDF/JPG/PNG/WebP, máx. 10 MB)
//   website  → honeypot (debe llegar vacío)
//   cf-turnstile-response → token anti-spam

const MAX_PER_IP_PER_HOUR = 8;

// La llamada a solartech_app puede tardar hasta ~75 s (cold start de Render + PDF).
export const maxDuration = 90;

function fail(status: number, error: string, issues?: unknown) {
  return NextResponse.json({ ok: false, error, issues }, { status });
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request.headers);
  const ipHash = hashIp(ip);
  if (rateLimited(ipHash, leadsDryRun ? 1000 : 5, 10 * 60_000)) return fail(429, "Demasiados intentos. Intenta de nuevo en unos minutos.");

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "Solicitud inválida.");
  }

  // Bot: responde como si todo estuviera bien, sin guardar nada.
  if (String(form.get("website") ?? "").length > 0) return NextResponse.json({ ok: true, id: randomUUID() });

  if (!(await verifyTurnstile(form.get("cf-turnstile-response") as string | null, ip))) {
    return fail(400, "No pudimos verificar que no eres un robot. Recarga la página e intenta de nuevo.");
  }

  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("payload") ?? ""));
  } catch {
    return fail(400, "Solicitud inválida.");
  }

  const source = (raw as { source?: string })?.source;
  const parsed = source === "contacto" ? contactLeadSchema.safeParse(raw) : quoteLeadSchema.safeParse(raw);
  if (!parsed.success) return fail(422, "Revisa los datos del formulario.", parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })));
  const data = parsed.data;

  const invoice = form.get("factura");
  const file = invoice instanceof File && invoice.size > 0 ? invoice : null;
  if (file && (file.size > INVOICE_MAX_BYTES || !INVOICE_TYPES.includes(file.type))) {
    return fail(422, "La factura debe ser PDF, JPG o PNG de máximo 10 MB.");
  }

  // El servidor recalcula: nunca se confía en cifras enviadas por el navegador. El formulario
  // de contacto también pasa por el motor (tarifa de referencia del departamento) porque el
  // CRM exige consumo y tarifa para registrar el lead.
  const quoteInput =
    data.source === "cotizador" ? data : { ...data, tariffCopKwh: referenceTariff(data.departamento), batteries: false, modelInterest: "no_se" as const };
  let result: QuoteResult;
  let score: { score: number; priority: string };
  try {
    result = computeQuote(quoteInput);
    score = scoreLead(quoteInput, result);
  } catch (err) {
    if (err instanceof QuoteError) return fail(422, err.message);
    throw err;
  }

  let attribution: Record<string, string> = {};
  try {
    attribution = JSON.parse(request.cookies.get(ATTRIBUTION_COOKIE)?.value ?? "{}");
  } catch {}

  const supabaseReady = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!supabaseReady && process.env.NODE_ENV === "production" && !leadsDryRun) {
    console.error("[leads] Supabase no está configurado");
    return fail(503, "No pudimos guardar tu solicitud. Escríbenos por WhatsApp.");
  }

  let id: string = randomUUID();
  let invoicePath: string | null = null;

  if (supabaseReady) {
    const supabase = createAdminClient();

    const since = new Date(Date.now() - 60 * 60_000).toISOString();
    const { count } = await supabase.from("leads").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
    if ((count ?? 0) >= MAX_PER_IP_PER_HOUR) return fail(429, "Recibimos varias solicitudes desde tu conexión. Escríbenos por WhatsApp.");

    if (file) {
      const ext = file.type === "application/pdf" ? "pdf" : file.type.split("/")[1];
      const now = new Date();
      invoicePath = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${id}.${ext}`;
      const { error } = await supabase.storage.from("facturas").upload(invoicePath, file, { contentType: file.type });
      if (error) {
        console.error("[leads] error subiendo factura:", error.message);
        invoicePath = null;
      }
    }

    const quote = data.source === "cotizador" ? data : undefined;
    const { data: row, error } = await supabase
      .from("leads")
      .insert({
        id,
        source: data.source,
        tipo_cliente: data.clientType,
        departamento: data.departamento,
        ciudad: data.municipio,
        factura_cop: data.billCop,
        consumo_kwh: quote?.consumptionKwh ?? result.consumptionKwh,
        tarifa_kwh: quoteInput.tariffCopKwh,
        factura_path: invoicePath,
        techo: quote?.roofType,
        area_m2: quote?.areaM2,
        baterias: quote?.batteries,
        modelo_interes: quote?.modelInterest,
        resultado_json: { ...result, cashFlow: result.cashFlow.filter((p) => p.year % 5 === 0 || p.year <= 5) },
        quote_engine_version: result.version,
        // Copia plana de las cifras clave para filtrar y sumar en consultas.
        kwp: result.system.kwp,
        valor_proyecto_cop: result.investment.totalCop,
        ahorro_mensual_cop: result.savings.monthlyCop,
        payback_meses: result.payback.years != null ? Math.round(result.payback.years * 12) : null,
        preferencia_contacto: data.preferenciaContacto ?? null,
        nombre: data.nombre,
        empresa: data.empresa || null,
        nit: data.nit || null,
        email: data.email,
        celular: data.celular,
        mensaje: data.source === "contacto" ? data.mensaje : null,
        consentimiento_datos: true,
        politica_version: POLICY_VERSION,
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
        utm_term: attribution.utm_term,
        utm_content: attribution.utm_content,
        gclid: attribution.gclid,
        fbclid: attribution.fbclid,
        landing_page: attribution.landing_page ?? (String(form.get("landing_page") ?? "").slice(0, 300) || null),
        referrer: attribution.referrer ?? (String(form.get("referrer") ?? "").slice(0, 300) || null),
        ip_hash: ipHash,
        user_agent: request.headers.get("user-agent")?.slice(0, 300),
        score: score.score,
        prioridad: score.priority,
      })
      .select("id")
      .single();
    if (error) {
      console.error("[leads] error guardando lead:", error.message);
      return fail(500, "No pudimos guardar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.");
    }
    id = row.id;
  } else {
    console.info("[leads] (dev, sin Supabase) lead recibido:", { id, source: data.source, nombre: data.nombre, priority: score.priority });
  }

  // CRM de asesores (solartech_app): cotización oficial + PDF. Se espera la respuesta para
  // mostrarle al visitante las mismas cifras que verá su asesor. Si falla, el lead ya quedó
  // en Supabase y el visitante ve la estimación de la web.
  let official: OfficialQuote | null = null;
  let duplicate = false;
  if (solartechAppConfigured() && !leadsDryRun) {
    // Con Supabase listo, solartech_app completa este mismo lead (misma base) en vez de crear otro.
    const outcome = await sendToSolartechApp(data, result, file, supabaseReady ? id : null);
    if (outcome.status === "ok") official = outcome.official;
    else if (outcome.status === "duplicate") duplicate = true;
    else console.error("[leads] solartech_app no recibió el lead", id, outcome.reason);

    if (supabaseReady && outcome.status !== "error") {
      await createAdminClient()
        .from("leads")
        .update({
          synced_solartech_app_at: new Date().toISOString(),
          numero_cotizacion: official?.numeroCotizacion ?? null,
          propuesta_url: official?.pdfUrl || null,
          notas: duplicate ? "La cédula/NIT ya existía en solartech_app: no se creó un lead nuevo." : null,
        })
        .eq("id", id);
    }
  }

  const notification: LeadNotification = {
    id,
    source: data.source,
    priority: score.priority,
    score: score.score,
    nombre: data.nombre,
    empresa: data.empresa,
    email: data.email,
    celular: data.celular,
    nit: data.nit || undefined,
    preferenciaContacto: data.preferenciaContacto,
    ciudad: `${data.municipio}, ${data.departamento}`,
    mensaje: data.source === "contacto" ? data.mensaje : undefined,
    clientType: data.clientType,
    billCop: data.billCop,
    modelInterest: data.source === "cotizador" ? data.modelInterest : undefined,
    hasInvoice: Boolean(invoicePath),
    result,
    official,
    duplicate,
    attribution,
  };

  // Emails y webhooks después de responder: el usuario no espera por ellos. En el cotizador,
  // con propuesta oficial el correo lleva su enlace; sin ella, el PDF de pre-cotización de la web.
  after(async () => {
    const pdf = data.source === "cotizador" && !official ? await renderQuotePdf({ result, name: data.nombre, city: notification.ciudad ?? "", date: new Date() }) : undefined;
    await dispatchLeadNotifications(notification, pdf);
  });

  return NextResponse.json({ ok: true, id, result, official, duplicate, priority: score.priority });
}
