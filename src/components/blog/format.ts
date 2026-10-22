// Las fechas del frontmatter ("2026-10-20") llegan como medianoche UTC: se formatean en UTC
// para no mostrar el día anterior.
const dateFormatter = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function formatPostDate(date: Date | string) {
  return dateFormatter.format(typeof date === "string" ? new Date(date) : date);
}
