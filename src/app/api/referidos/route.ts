import { after, NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { referralMeetingSchema } from "@/lib/referral-schema";
import { upcomingBusinessDays } from "@/content/referrals";
import { bogotaToDate } from "@/lib/calendar";
import { clientIp, hashIp, leadsDryRun, rateLimited, verifyTurnstile } from "@/lib/server/security";
import { notifyReferralMeeting } from "@/lib/server/referral-notify";
import { createAdminClient } from "@/lib/supabase/admin";
import { ATTRIBUTION_COOKIE } from "@/lib/attribution";
import { POLICY_VERSION } from "@/content/legal";

// Programa de Referidos Comerciales.
//   GET  → franjas ya reservadas en los próximos días hábiles (sin datos personales).
//   POST → solicitud de cita (JSON): valida, guarda en aliados_referidos y avisa al equipo.

export const dynamic = "force-dynamic";

const supabaseReady = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

function fail(status: number, error: string, issues?: unknown) {
  return NextResponse.json({ ok: false, error, issues }, { status });
}

export async function GET() {
  if (!supabaseReady()) return NextResponse.json({ taken: [] });
  const days = upcomingBusinessDays();
  const { data, error } = await createAdminClient()
    .from("aliados_referidos")
    .select("cita_at")
    .in("estado", ["pendiente", "confirmada"])
    .gte("cita_at", bogotaToDate(days[0], "00:00").toISOString())
    .lte("cita_at", bogotaToDate(days[days.length - 1], "23:59").toISOString());
  if (error) {
    console.error("[referidos] error leyendo disponibilidad:", error.message);
    return NextResponse.json({ taken: [] });
  }
  return NextResponse.json({ taken: data.map((r) => new Date(r.cita_at).toISOString()) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request.headers);
  const ipHash = hashIp(ip);
  if (rateLimited(`ref:${ipHash}`, leadsDryRun ? 1000 : 4, 10 * 60_000)) return fail(429, "Demasiados intentos. Intenta de nuevo en unos minutos.");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail(400, "Solicitud inválida.");
  }

  // Bot: responde como si todo estuviera bien, sin guardar nada.
  if (String(body.website ?? "").length > 0) return NextResponse.json({ ok: true, id: randomUUID() });
  if (!(await verifyTurnstile((body["cf-turnstile-response"] as string) ?? null, ip))) {
    return fail(400, "No pudimos verificar que no eres un robot. Recarga la página e intenta de nuevo.");
  }

  const parsed = referralMeetingSchema.safeParse(body);
  if (!parsed.success) return fail(422, "Revisa los datos del formulario.", parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })));
  const m = parsed.data;

  // Solo días hábiles de la ventana publicada (no se agenda en el pasado ni muy adelante).
  if (!upcomingBusinessDays().includes(m.fecha)) return fail(422, "Ese día ya no está disponible. Elige otro.", [{ path: "fecha", message: "Elige otro día" }]);
  const citaAt = bogotaToDate(m.fecha, m.hora).toISOString();

  let attribution: Record<string, string> = {};
  try {
    attribution = JSON.parse(request.cookies.get(ATTRIBUTION_COOKIE)?.value ?? "{}");
  } catch {}

  let id: string = randomUUID();
  if (supabaseReady()) {
    const { data: row, error } = await createAdminClient()
      .from("aliados_referidos")
      .insert({
        id,
        nombre: m.nombre,
        email: m.email,
        celular: m.celular,
        empresa: m.empresa || null,
        ciudad: m.ciudad,
        perfil: m.perfil,
        referidos_esperados: m.referidosEsperados,
        mensaje: m.mensaje || null,
        modalidad: m.modalidad,
        fecha_cita: m.fecha,
        hora_cita: m.hora,
        cita_at: citaAt,
        consentimiento_datos: true,
        politica_version: POLICY_VERSION,
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
        landing_page: "/referidos-comerciales/",
        ip_hash: ipHash,
      })
      .select("id")
      .single();
    if (error) {
      // 23505: otra persona reservó esa franja un instante antes (índice único por cita_at).
      if (error.code === "23505") return fail(409, "Esa hora acaba de ser reservada. Elige otra.", [{ path: "hora", message: "Elige otra hora" }]);
      console.error("[referidos] error guardando solicitud:", error.message);
      return fail(500, "No pudimos agendar tu cita. Intenta de nuevo o escríbenos por WhatsApp.");
    }
    id = row.id;
  } else if (process.env.NODE_ENV === "production" && !leadsDryRun) {
    console.error("[referidos] Supabase no está configurado");
    return fail(503, "No pudimos agendar tu cita. Escríbenos por WhatsApp.");
  } else {
    console.info("[referidos] (dev, sin Supabase) solicitud:", { id, nombre: m.nombre, fecha: m.fecha, hora: m.hora });
  }

  after(() => notifyReferralMeeting(m, id));
  return NextResponse.json({ ok: true, id });
}
