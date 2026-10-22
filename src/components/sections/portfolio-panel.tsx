import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Delta } from "@/components/ui/badge";
import { portfolioStats, projects } from "@/content/projects";
import { formatCOPCompact, formatNumber } from "@/lib/utils";

/** Tarjeta tipo "dashboard" con el portafolio real de proyectos. */
export function PortfolioPanel() {
  const stats = portfolioStats();
  const ranked = projects
    .flatMap((p) => (p.monthlySavingsCop !== null ? [{ ...p, savings: p.monthlySavingsCop }] : []))
    .sort((a, b) => b.savings - a.savings);
  const max = ranked[0]?.savings ?? 1;

  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-px -z-10 rounded-[28px] bg-gradient-to-b from-copper/50 via-border to-transparent" />
      <div className="rounded-[27px] bg-surface/95 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-7">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Portafolio Solartech</p>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-positive">
            <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-positive" />
            Generando
          </span>
        </div>

        <div className="mt-5">
          <p className="text-sm text-fg-muted">Ahorro mensual documentado de {stats.projectsWithSavings} clientes</p>
          <div className="mt-1 flex items-end gap-3">
            <p className="font-mono text-4xl font-semibold tracking-tight tabular sm:text-5xl">
              <AnimatedNumber value={stats.monthlySavingsCop} format="copCompact" />
            </p>
            <Delta className="mb-2">COP / mes</Delta>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border [&_dd]:text-[15px] [&_dd]:whitespace-nowrap sm:[&_dd]:text-xl">
          <div className="bg-surface-2 p-3 sm:p-4">
            <dt className="text-[11px] text-fg-muted">Potencia instalada</dt>
            <dd className="mt-1 font-mono text-lg font-semibold tabular sm:text-xl">
              <AnimatedNumber value={stats.kwp} suffix=" kWp" />
            </dd>
          </div>
          <div className="bg-surface-2 p-3 sm:p-4">
            <dt className="text-[11px] text-fg-muted">Proyectos</dt>
            <dd className="mt-1 font-mono text-lg font-semibold tabular sm:text-xl">
              <AnimatedNumber value={stats.projects} />
            </dd>
          </div>
          <div className="bg-surface-2 p-3 sm:p-4">
            <dt className="text-[11px] text-fg-muted">Ahorro anual</dt>
            <dd className="mt-1 font-mono text-lg font-semibold tabular sm:text-xl">
              <AnimatedNumber value={stats.monthlySavingsCop * 12} format="copCompact" />
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <div className="flex items-center justify-between text-[11px] text-fg-subtle">
            <span className="font-mono tracking-[0.12em] uppercase">Ahorro / mes por proyecto</span>
            <span className="font-mono">Retorno</span>
          </div>
          <ul className="mt-3 space-y-2.5">
            {ranked.slice(0, 5).map((p) => (
              <li key={p.slug} className="grid grid-cols-[minmax(0,7.5rem)_1fr_auto] items-center gap-3 text-sm sm:grid-cols-[11.5rem_1fr_auto]">
                <span className="truncate text-fg-muted">{p.name}</span>
                <span className="relative h-2 overflow-hidden rounded-full bg-surface-3">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-copper to-copper-text"
                    style={{ width: `${Math.max(6, (p.savings / max) * 100)}%` }}
                  />
                </span>
                <span className="w-24 text-right font-mono text-xs tabular">
                  {formatCOPCompact(p.savings)}
                  <span className="ml-1.5 text-positive">{p.paybackYears ? `${formatNumber(p.paybackYears)}a` : "PPA"}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Link href="/proyectos/" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-copper-text hover:underline">
          Ver todos los casos de éxito
          <ArrowUpRight aria-hidden className="size-4" />
        </Link>
      </div>
    </div>
  );
}
