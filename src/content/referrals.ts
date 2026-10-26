// Programa de Referidos Comerciales: asesores externos y brókers que refieren proyectos solares.
// ⚠ Las condiciones (porcentaje por tipo de proyecto, momento del pago y contrato) se definen
// con cada aliado en la reunión: la página solo publica el rango.
// Este archivo lo usa también el navegador: nada de motor de cálculo aquí (ver referral-presets.ts).
import type { Faq } from "@/content/faq";

export const COMMISSION = { min: 0.01, max: 0.05 } as const;

export type ProjectPreset = { key: string; label: string; detail: string; kwp: number; valueCop: number };

export const referralSteps = [
  { title: "Agenda una reunión", text: "Te explicamos la modalidad, las condiciones y cómo registramos tus referidos." },
  { title: "Refiere a tu cliente", text: "Nos compartes el contacto de la empresa, el hogar o el proyecto que conoces." },
  { title: "Solartech hace el resto", text: "Visita técnica, diseño, propuesta financiera, construcción y trámites con el operador de red." },
  { title: "Recibes tu comisión", text: "Entre el 1 % y el 5 % del valor del proyecto cuando se hace efectivo." },
];

// `profile` es el valor del selector "Tu perfil" del agendamiento (PARTNER_PROFILES).
export const referralProfiles = [
  {
    title: "Brókers y asesores comerciales",
    text: "Que ya visitan empresas y buscan un producto de alto valor para su portafolio.",
    tip: "Busca empresas que paguen más de $5 millones al mes de energía: son las que más rápido recuperan la inversión.",
    profile: "Bróker o asesor comercial",
  },
  {
    title: "Asesores financieros y de seguros",
    text: "Que conocen las finanzas de sus clientes y pueden mostrarles un ahorro real.",
    tip: "Las empresas que declaran renta pueden deducir el 50 % de la inversión (Ley 1715): es tu mejor argumento.",
    profile: "Asesor financiero o de seguros",
  },
  {
    title: "Arquitectos, constructores e ingenieros",
    text: "Que diseñan o remodelan edificios, bodegas y viviendas.",
    tip: "Proponer la planta solar desde el diseño evita refuerzos y reprocesos: llévala a tus obras nuevas y remodelaciones.",
    profile: "Arquitecto, constructor o ingeniero",
  },
  {
    title: "Electricistas y contratistas",
    text: "Que entran a las instalaciones y ven el consumo de primera mano.",
    tip: "Cubiertas amplias, sin sombra y con consumo alto de día: ese es el prospecto ideal.",
    profile: "Electricista o contratista",
  },
  {
    title: "Administradores de propiedad horizontal",
    text: "Que buscan bajar el costo de las zonas comunes de su copropiedad.",
    tip: "Con PPA la copropiedad no invierte: paga la energía de las zonas comunes más barata que la de la red.",
    profile: "Administrador de propiedad horizontal",
  },
  {
    title: "Gremios, cámaras y asociaciones",
    text: "Que pueden acercar la energía solar a sus afiliados.",
    tip: "Una charla con casos reales para tus afiliados puede abrir varios proyectos a la vez.",
    profile: "Gremio o asociación",
  },
] as const;

export const referralBenefits = [
  { title: "Sin inversión ni riesgo", text: "No compras equipos ni asumes la obra: refieres y Solartech ejecuta." },
  { title: "Un producto fácil de vender", text: "Proyectos que se pagan solos en 2,7 a 4 años, o sin inversión con PPA." },
  { title: "Equipo técnico de respaldo", text: "Ingenieros que acompañan la visita, la propuesta y el cierre con tu cliente." },
  { title: "Seguimiento transparente", text: "Cada referido queda registrado en nuestro CRM a tu nombre desde el primer contacto." },
];

export const referralFaqs: Faq[] = [
  {
    q: "¿Cuánto puedo ganar por cada proyecto?",
    a: "Entre el 1 % y el 5 % del valor del proyecto. El porcentaje depende del tipo y del tamaño del proyecto, y de tu participación en la venta. Te lo explicamos en detalle en la reunión.",
  },
  {
    q: "¿Cuándo recibo la comisión?",
    a: "Cuando el proyecto que referiste se hace efectivo, es decir, cuando el cliente firma y el negocio se concreta. Las condiciones exactas de pago quedan en el acuerdo que firmamos contigo.",
  },
  {
    q: "¿Necesito saber de energía solar?",
    a: "No. Nuestro equipo técnico hace la visita, el diseño y la propuesta. Te damos el material y la capacitación para identificar buenos prospectos.",
  },
  {
    q: "¿Qué tipo de clientes puedo referir?",
    a: "Empresas, industrias, comercios, fincas, copropiedades y hogares en Colombia. Los proyectos con mayor consumo de energía generan las mayores comisiones.",
  },
  {
    q: "¿Cómo sé que mi referido queda a mi nombre?",
    a: "Registramos cada referido en nuestro CRM con tu nombre y la fecha desde el primer contacto, y te mantenemos al tanto de su avance.",
  },
  {
    q: "¿Tiene algún costo participar?",
    a: "No. Participar en el programa no tiene ningún costo para ti.",
  },
];

// ---------- Agendamiento ----------
// Horario de oficina (site.contact.hours): lunes a viernes, 8:00 a 17:30, hora de Colombia.
export const MEETING_SLOTS = ["08:30", "09:30", "10:30", "11:30", "14:00", "15:00", "16:00"] as const;
export const MEETING_DAYS_AHEAD = 12;
export const MEETING_MINUTES = 30;

export const MEETING_MODES = [
  { value: "virtual", label: "Videollamada", detail: "Google Meet o Teams" },
  { value: "presencial", label: "Presencial", detail: "Oficina en Itagüí" },
] as const;

export const PARTNER_PROFILES = [
  "Bróker o asesor comercial",
  "Asesor financiero o de seguros",
  "Arquitecto, constructor o ingeniero",
  "Electricista o contratista",
  "Administrador de propiedad horizontal",
  "Gremio o asociación",
  "Otro",
] as const;

export const EXPECTED_REFERRALS = ["1 a 2 al año", "3 a 5 al año", "6 a 12 al año", "Más de 12 al año"] as const;

/** Próximos días hábiles (lunes a viernes) desde mañana, en hora de Colombia, como "AAAA-MM-DD".
    No descuenta festivos: el equipo confirma la cita. */
export function upcomingBusinessDays(from = new Date(), count = MEETING_DAYS_AHEAD) {
  const days: string[] = [];
  const bogota = new Date(from.getTime() - 5 * 3_600_000);
  const cursor = new Date(Date.UTC(bogota.getUTCFullYear(), bogota.getUTCMonth(), bogota.getUTCDate()));
  while (days.length < count) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const dow = cursor.getUTCDay();
    if (dow !== 0 && dow !== 6) days.push(cursor.toISOString().slice(0, 10));
  }
  return days;
}
