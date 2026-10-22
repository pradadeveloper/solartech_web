import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { hasProjectPage, ppaStats, projectPlace, projects } from "@/content/projects";
import { formatCOP, formatCOPCompact, formatNumber } from "@/lib/utils";

/** Copropiedades que ya ahorran con PPA: totales del portafolio y una fila por edificio. */
export function PpaPortfolio() {
  const stats = ppaStats();
  const rows = projects.filter((p) => p.model === "PPA").sort((a, b) => (b.monthlySavingsCop ?? -1) - (a.monthlySavingsCop ?? -1));
  const kpis = [
    { label: "Edificios y conjuntos", value: formatNumber(stats.projects, 0) },
    { label: "Potencia instalada", value: `${formatNumber(stats.kwp, 0)} kWp` },
    { label: "Ahorro mensual combinado", value: formatCOPCompact(stats.monthlySavingsCop), positive: true },
  ];

  return (
    <div className="space-y-4">
      <dl className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-surface p-5 sm:p-6">
            <dt className="text-xs text-fg-muted">{k.label}</dt>
            <dd className={`mt-2 font-mono text-2xl font-semibold tabular sm:text-3xl ${k.positive ? "text-positive" : ""}`}>{k.value}</dd>
          </div>
        ))}
      </dl>

      <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
        {rows.map((p) => {
          const content = (
            <>
              <span className="relative size-16 shrink-0 overflow-hidden rounded-xl sm:size-20">
                <Image src={p.image} alt={p.imageAlt} fill sizes="80px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{p.name}</span>
                <span className="block text-xs text-fg-muted">{projectPlace(p)}</span>
              </span>
              <span className="hidden w-24 text-right font-mono text-sm tabular sm:block">{formatNumber(p.kwp)} kWp</span>
              <span className="w-32 text-right">
                <span className="block font-mono text-sm font-semibold text-positive tabular">{p.monthlySavingsCop !== null ? formatCOP(p.monthlySavingsCop) : "—"}</span>
                <span className="block text-[11px] text-fg-subtle">
                  <span className="sm:hidden">{formatNumber(p.kwp)} kWp · </span>ahorro/mes
                </span>
              </span>
            </>
          );
          return (
            <li key={p.slug}>
              {hasProjectPage(p) ? (
                <Link href={`/proyectos/${p.slug}/`} className="group flex items-center gap-4 p-4 transition-colors hover:bg-surface-2 sm:px-6">
                  {content}
                  <ArrowUpRight aria-hidden className="size-4 shrink-0 text-fg-subtle group-hover:text-copper-text" />
                </Link>
              ) : (
                <div className="flex items-center gap-4 p-4 sm:px-6">
                  {content}
                  <span aria-hidden className="size-4 shrink-0" />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-fg-subtle">Ahorro mensual reportado por Solartech para cada copropiedad (Presentación PPA 2026).</p>
    </div>
  );
}
