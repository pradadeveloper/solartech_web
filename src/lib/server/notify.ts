import "server-only";
import { Resend } from "resend";
import { site, whatsappUrl } from "@/content/site";
import type { QuoteResult } from "@/lib/quote-engine";
import { formatCOP, formatNumber } from "@/lib/utils";

export type LeadNotification = {
  id: string;
  source: "cotizador" | "contacto";
  priority: string;
  score: number;
  nombre: string;
  empresa?: string;
  email: string;
  celular: string;
  ciudad?: string;
  mensaje?: string;
  clientType?: string;
  billCop?: number;
  modelInterest?: string;
  hasInvoice: boolean;
  result?: QuoteResult;
  attribution: Record<string, string>;
};

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Correo interno para el equipo comercial. */
async function notifyTeam(resend: Resend, lead: LeadNotification) {
  const to = process.env.LEADS_NOTIFY_TO?.split(",").map((s) => s.trim()).filter(Boolean);
  if (!to?.length) return;
  const r = lead.result;
  const rows: [string, string | undefined][] = [
    ["Prioridad", `${lead.priority.toUpperCase()} (score ${lead.score})`],
    ["Origen", lead.source],
    ["Nombre", lead.nombre],
    ["Empresa", lead.empresa],
    ["Email", lead.email],
    ["Celular", lead.celular],
    ["Ciudad", lead.ciudad],
    ["Tipo de cliente", lead.clientType],
    ["Factura mensual", lead.billCop ? formatCOP(lead.billCop) : undefined],
    ["Modelo de interés", lead.modelInterest],
    ["Sistema", r ? `${formatNumber(r.system.kwp)} kWp · ${r.system.panels} paneles` : undefined],
    ["Ahorro mensual", r ? formatCOP(r.savings.monthlyCop) : undefined],
    ["Inversión", r ? `${formatCOP(r.investment.lowCop)} – ${formatCOP(r.investment.highCop)}` : undefined],
    ["Factura adjunta", lead.hasInvoice ? "Sí (bucket facturas)" : "No"],
    ["Mensaje", lead.mensaje],
    ["Campaña", Object.entries(lead.attribution).filter(([k]) => k.startsWith("utm_") || k === "gclid").map(([k, v]) => `${k}=${v}`).join(" · ") || undefined],
  ];
  const html = `<h2 style="font-family:sans-serif">Nuevo lead web · ${escape(lead.priority)}</h2><table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><b>${escape(String(v))}</b></td></tr>`)
    .join("")}</table><p style="font-family:sans-serif;font-size:12px;color:#888">ID ${lead.id}</p>`;

  await resend.emails.send({
    from: process.env.LEADS_FROM_EMAIL!,
    to,
    replyTo: lead.email,
    subject: `[${lead.priority.toUpperCase()}] Lead ${lead.source}: ${lead.nombre}${lead.empresa ? ` · ${lead.empresa}` : ""}`,
    html,
  });
}

/** Correo al cliente con su pre-cotización en PDF. */
async function notifyClient(resend: Resend, lead: LeadNotification, pdf?: Buffer) {
  const r = lead.result;
  const first = escape(lead.nombre.split(" ")[0]);
  const body = r
    ? `<p>Hola ${first}, gracias por usar nuestro cotizador. Adjuntamos tu pre-cotización:</p>
       <ul><li>Sistema de <b>${formatNumber(r.system.kwp)} kWp</b> (${r.system.panels} paneles)</li>
       <li>Ahorro estimado de <b>${formatCOP(r.savings.monthlyCop)} al mes</b></li>
       <li>Retorno aproximado de <b>${r.payback.years ? formatNumber(r.payback.years) : "—"} años</b></li></ul>
       <p>Un asesor te contactará para revisar tu factura y agendar la visita técnica.</p>`
    : `<p>Hola ${first}, recibimos tu mensaje. Un asesor de Solartech te contactará pronto.</p>`;
  await resend.emails.send({
    from: process.env.LEADS_FROM_EMAIL!,
    to: lead.email,
    subject: r ? "Tu pre-cotización solar · Solartech" : "Recibimos tu mensaje · Solartech",
    html: `<div style="font-family:sans-serif;font-size:15px;color:#1d1512">${body}
      <p><a href="${whatsappUrl("Hola Solartech, recibí mi pre-cotización y quiero hablar con un asesor.")}">Escríbenos por WhatsApp</a> · ${site.contact.phoneDisplay}</p>
      <p style="font-size:12px;color:#78706b">Pre-cotización referencial. La propuesta final requiere visita técnica y análisis de factura.</p></div>`,
    attachments: pdf ? [{ filename: "pre-cotizacion-solartech.pdf", content: pdf }] : undefined,
  });
}

/** Webhook genérico (n8n → Sheets/CRM/WhatsApp del asesor). */
async function postWebhook(url: string, payload: unknown, key?: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(key ? { "X-Web-Key": key } : {}) },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook ${url} respondió ${res.status}`);
}

/** Ejecuta todas las notificaciones; un fallo en una no bloquea las demás. */
export async function dispatchLeadNotifications(lead: LeadNotification, pdf?: Buffer) {
  const tasks: Promise<unknown>[] = [];
  if (process.env.RESEND_API_KEY && process.env.LEADS_FROM_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    tasks.push(notifyTeam(resend, lead), notifyClient(resend, lead, pdf));
  }
  const payload = { ...lead, result: lead.result ? { ...lead.result, cashFlow: undefined } : undefined };
  if (process.env.N8N_LEADS_WEBHOOK_URL) tasks.push(postWebhook(process.env.N8N_LEADS_WEBHOOK_URL, payload));
  if (process.env.SOLARTECH_APP_LEADS_URL) tasks.push(postWebhook(process.env.SOLARTECH_APP_LEADS_URL, payload, process.env.SOLARTECH_APP_LEADS_KEY));

  const results = await Promise.allSettled(tasks);
  for (const r of results) if (r.status === "rejected") console.error("[leads] notificación fallida:", r.reason);
  return results.every((r) => r.status === "fulfilled");
}
