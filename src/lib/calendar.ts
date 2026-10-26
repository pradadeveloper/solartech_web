// Enlaces y archivos de calendario para las citas del programa de referidos.
// Las horas se manejan en hora de Colombia (UTC-5, sin horario de verano).

export type CalendarEvent = { title: string; details: string; location: string; date: string; time: string; minutes: number };

/** "AAAA-MM-DD" + "HH:mm" en hora de Colombia → Date (instante UTC). */
export function bogotaToDate(date: string, time: string) {
  return new Date(`${date}T${time}:00-05:00`);
}

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function googleCalendarUrl(e: CalendarEvent) {
  const start = bogotaToDate(e.date, e.time);
  const end = new Date(start.getTime() + e.minutes * 60_000);
  const params = new URLSearchParams({ action: "TEMPLATE", text: e.title, dates: `${stamp(start)}/${stamp(end)}`, details: e.details, location: e.location, ctz: "America/Bogota" });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Archivo .ics (Outlook, Apple Calendar y cualquier calendario). */
export function icsFile(e: CalendarEvent, uid: string) {
  const start = bogotaToDate(e.date, e.time);
  const end = new Date(start.getTime() + e.minutes * 60_000);
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Solartech//Referidos//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}@solartechenergy.co`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(e.details)}`,
    `LOCATION:${esc(e.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

const dayFormat = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Bogota" });

/** "martes 28 de octubre" para "2026-10-28". */
export function formatMeetingDay(date: string) {
  return dayFormat.format(bogotaToDate(date, "12:00"));
}

/** "2:00 p. m." para "14:00". */
export function formatMeetingTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h < 12 ? "a. m." : "p. m.";
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${suffix}`;
}
