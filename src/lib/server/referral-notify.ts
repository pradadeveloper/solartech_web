import "server-only";
import { Resend } from "resend";
import { site } from "@/content/site";
import { MEETING_MINUTES } from "@/content/referrals";
import type { ReferralMeeting } from "@/lib/referral-schema";
import { formatMeetingDay, formatMeetingTime, googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function meetingEvent(m: ReferralMeeting): CalendarEvent {
  const { street, city } = site.contact.address;
  return {
    title: "Solartech · Programa de Referidos Comerciales",
    details: `Reunión para conocer la modalidad de referidos de Solartech. Contacto: ${site.contact.phoneDisplay} · ${site.url}/referidos-comerciales/`,
    location: m.modalidad === "presencial" ? `${street}, ${city}` : "Videollamada (te enviaremos el enlace)",
    date: m.fecha,
    time: m.hora,
    minutes: MEETING_MINUTES,
  };
}

/** Correo al equipo comercial y confirmación al aliado. Un fallo en uno no bloquea el otro. */
export async function notifyReferralMeeting(m: ReferralMeeting, id: string) {
  const tasks: Promise<unknown>[] = [];
  const when = `${formatMeetingDay(m.fecha)} · ${formatMeetingTime(m.hora)}`;
  const mode = m.modalidad === "presencial" ? "Presencial (Itagüí)" : "Videollamada";

  if (process.env.RESEND_API_KEY && process.env.LEADS_FROM_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.LEADS_NOTIFY_TO?.split(",").map((s) => s.trim()).filter(Boolean);
    if (to?.length) {
      const rows: [string, string | undefined][] = [
        ["Cita solicitada", `${when} (${mode})`],
        ["Nombre", m.nombre],
        ["Empresa", m.empresa],
        ["Perfil", m.perfil],
        ["Referidos esperados", m.referidosEsperados],
        ["Ciudad", m.ciudad],
        ["Email", m.email],
        ["Celular", m.celular],
        ["Mensaje", m.mensaje],
      ];
      tasks.push(
        resend.emails.send({
          from: process.env.LEADS_FROM_EMAIL,
          to,
          replyTo: m.email,
          subject: `[Referidos] Cita ${when}: ${m.nombre}`,
          html: `<h2 style="font-family:sans-serif">Nueva solicitud de aliado referido</h2><table style="font-family:sans-serif;font-size:14px">${rows
            .filter(([, v]) => v)
            .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td><b>${escape(String(v))}</b></td></tr>`)
            .join("")}</table><p style="font-family:sans-serif;font-size:13px">Confirma la cita respondiendo este correo o por WhatsApp. ID ${id}</p>`,
        }),
      );
    }
    tasks.push(
      resend.emails.send({
        from: process.env.LEADS_FROM_EMAIL,
        to: m.email,
        subject: "Recibimos tu solicitud · Programa de Referidos Solartech",
        html: `<div style="font-family:sans-serif;font-size:15px;color:#1d1512">
          <p>Hola ${escape(m.nombre.split(" ")[0])}, gracias por tu interés en el Programa de Referidos Comerciales de Solartech.</p>
          <p>Solicitaste una reunión el <b>${escape(when)}</b> (${mode}). Un asesor te confirmará la cita${m.modalidad === "virtual" ? " y te enviará el enlace de la videollamada" : ""}.</p>
          <p><a href="${googleCalendarUrl(meetingEvent(m))}">Agregar a Google Calendar</a></p>
          <p>¿Necesitas cambiarla? Escríbenos al ${site.contact.phoneDisplay}.</p></div>`,
      }),
    );
  }

  if (process.env.N8N_LEADS_WEBHOOK_URL) {
    tasks.push(
      fetch(process.env.N8N_LEADS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "referidos_cita", id, ...m }),
        signal: AbortSignal.timeout(8000),
      }),
    );
  }

  const results = await Promise.allSettled(tasks);
  for (const r of results) if (r.status === "rejected") console.error("[referidos] notificación fallida:", r.reason);
}
