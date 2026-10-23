import "server-only";
import type { ContactLead, QuoteLead } from "@/lib/lead-schema";
import type { QuoteResult } from "@/lib/quote-engine";

// Cliente de la API de solartech_app (CRM de asesores). POST /api/calcular-proyecto
// calcula la cotización oficial, genera el PDF y completa el lead en Supabase (base
// compartida; estado "Nuevo", sin asesor). Los nombres de campo son los del backend: no cambiarlos.

/** Cifras oficiales que devuelve solartech_app y que ve el visitante. */
export type OfficialQuote = {
  numeroCotizacion: number;
  codigoPublico: string;
  pdfUrl: string;
  kwp: number;
  npaneles: number;
  ninversores: number;
  costoProyectoMasIva: number;
  ahorroMensual: number;
  ahorroAnual: number;
  /** Años. */
  tiempoRetorno: number;
  generacionMes?: number;
};

export type SolartechAppOutcome = { status: "ok"; official: OfficialQuote } | { status: "duplicate" } | { status: "error"; reason: string };

/** Lead de cualquiera de los dos formularios del sitio (cotizador o contacto). */
export type SiteLead = QuoteLead | ContactLead;

// Render duerme el servicio: el primer request puede tardar 30–60 s, más la generación del PDF.
const TIMEOUT_MS = 75_000;

// Valores exactos del selector "Tipo de proyecto" del CRM.
const CLIENT_TYPE: Record<SiteLead["clientType"], string> = { hogar: "Hogar", comercial: "Comercial", empresa: "Empresa", gran_escala: "Gran Escala" };
const ROOF: Record<NonNullable<QuoteLead["roofType"]>, string> = { lamina: "Termoacústica", teja_barro: "Teja de barro", losa: "Losa", suelo: "Suelo" };
const MODEL: Record<QuoteLead["modelInterest"], string> = { epc: "Compra (EPC)", ppa: "PPA (sin inversión)", no_se: "Por definir" };
const SOURCE: Record<SiteLead["source"], string> = { cotizador: "Cotizador web", contacto: "Formulario de contacto web" };

export function solartechAppConfigured() {
  return Boolean(process.env.SOLARTECH_APP_API_URL);
}

/** Campos del formulario que entiende /api/calcular-proyecto. */
export function toSolartechAppFields(lead: SiteLead, result: QuoteResult): Record<string, string> {
  const tariff = lead.source === "cotizador" ? lead.tariffCopKwh : result.consumptionKwh > 0 && lead.billCop ? lead.billCop / result.consumptionKwh : 0;
  const fields: Record<string, string> = {
    // Obligatorios
    nombre: lead.nombre,
    correo: lead.email,
    telefono: lead.celular,
    ubicacion: `${lead.municipio}, ${lead.departamento}`,
    consumoKwh: String(Math.round(result.consumptionKwh)),
    costoKwh: String(Math.round(tariff)),
    valorMensual: String(Math.round(lead.billCop ?? result.consumptionKwh * tariff)),
    // "0" = sin límite de área en el backend; el asesor la confirma en la visita.
    areaDisponible: String(Math.round((lead.source === "cotizador" ? lead.areaM2 : undefined) ?? 0)),
    tipoSolicitud: CLIENT_TYPE[lead.clientType],
    // Opcionales que el CRM guarda
    ciudadSolar: lead.municipio,
    // HSP del municipio según la tabla de la web, para que ambos cálculos usen la misma radiación.
    radiacionSolar: String(result.hsp),
    sistemaInteres: lead.source === "cotizador" && lead.batteries ? "Híbrido" : "Interconectado",
    conociste: "Página web",
    // Datos del sitio que el backend aún no guarda: se envían para que no se pierdan
    // cuando solartech_app agregue esas columnas.
    origenWeb: SOURCE[lead.source],
  };
  if (lead.nit) fields.identificacion = lead.nit;
  if (lead.preferenciaContacto) fields.preferenciaContacto = lead.preferenciaContacto;
  if (lead.empresa) fields.empresa = lead.empresa;
  if (lead.source === "cotizador") {
    if (lead.roofType) fields.tipoTecho = ROOF[lead.roofType];
    fields.modeloInteres = MODEL[lead.modelInterest];
  } else if (lead.mensaje) {
    fields.mensaje = lead.mensaje;
  }
  return fields;
}

/**
 * `leadId`: el lead que la web ya guardó en Supabase. solartech_app comparte la misma base
 * y completa ese registro (número, dimensionamiento, PDF) en vez de crear otro. Requiere
 * SOLARTECH_APP_SYNC_KEY igual a WEB_SYNC_KEY del backend; sin ella crea un lead aparte.
 */
export async function sendToSolartechApp(lead: SiteLead, result: QuoteResult, invoice: File | null, leadId: string | null): Promise<SolartechAppOutcome> {
  const base = process.env.SOLARTECH_APP_API_URL!.replace(/\/$/, "");
  const syncKey = process.env.SOLARTECH_APP_SYNC_KEY;
  const body = new FormData();
  for (const [k, v] of Object.entries(toSolartechAppFields(lead, result))) body.set(k, v);
  if (leadId && syncKey) body.set("leadIdWeb", leadId);
  else if (invoice) body.set("facturaAdjunta", invoice); // con leadId la factura ya está en el bucket

  let res: Response;
  try {
    res = await fetch(`${base}/api/calcular-proyecto`, {
      method: "POST",
      body,
      headers: syncKey ? { "x-solartech-web-key": syncKey } : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    return { status: "error", reason: err instanceof Error ? err.message : String(err) };
  }

  if (res.status === 409) return { status: "duplicate" };
  if (!res.ok) return { status: "error", reason: `HTTP ${res.status}: ${(await res.text()).slice(0, 300)}` };

  const json = (await res.json()) as Partial<OfficialQuote>;
  if (!json.numeroCotizacion || !json.kwp) return { status: "error", reason: "Respuesta sin numeroCotizacion o kwp" };
  return {
    status: "ok",
    official: {
      numeroCotizacion: Number(json.numeroCotizacion),
      codigoPublico: String(json.codigoPublico ?? ""),
      pdfUrl: String(json.pdfUrl ?? ""),
      kwp: Number(json.kwp),
      npaneles: Number(json.npaneles ?? 0),
      ninversores: Number(json.ninversores ?? 0),
      costoProyectoMasIva: Number(json.costoProyectoMasIva ?? 0),
      ahorroMensual: Number(json.ahorroMensual ?? 0),
      ahorroAnual: Number(json.ahorroAnual ?? 0),
      tiempoRetorno: Number(json.tiempoRetorno ?? 0),
      generacionMes: json.generacionMes ? Number(json.generacionMes) : undefined,
    },
  };
}
