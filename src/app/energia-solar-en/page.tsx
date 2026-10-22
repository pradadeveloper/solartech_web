import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { cities } from "@/content/cities";
import { resolveHsp } from "@/lib/quote-engine";
import { pageMetadata } from "@/lib/seo";
import { formatNumber } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Energía solar por ciudad en Colombia",
  description: "Radiación, producción por kWp, operador de red y proyectos de energía solar en Medellín, Itagüí, Rionegro, Cartagena y Pereira. Calcula tu ahorro.",
  path: "/energia-solar-en/",
});

export default function CitiesHubPage() {
  const rows = cities
    .map((c) => {
      const hsp = resolveHsp(c.departamento, c.municipio);
      return { ...c, hsp, yieldYear: hsp * 365 };
    })
    .sort((a, b) => b.hsp - a.hsp);
  const maxYield = Math.max(...rows.map((r) => r.yieldYear));

  return (
    <>
      <PageHeader
        eyebrow="Cobertura"
        title="Energía solar por ciudad"
        description="El sol no rinde igual en todo el país. Compara cuánta energía produce cada kWp en las ciudades donde trabajamos y mira los proyectos cercanos."
        crumbs={[{ name: "Energía solar por ciudad", path: "/energia-solar-en/" }]}
      />

      <Section className="pt-12 lg:pt-14">
        <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
          {rows.map((c) => (
            <li key={c.slug}>
              <Link href={`/energia-solar-en/${c.slug}/`} className="group grid items-center gap-4 p-5 transition-colors hover:bg-surface-2 sm:grid-cols-[minmax(0,12rem)_1fr_auto] sm:p-6">
                <span>
                  <span className="block text-lg font-bold group-hover:text-copper-text">{c.name}</span>
                  <span className="block text-xs text-fg-muted">
                    {c.departamento} · {c.operator.name}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-surface-3">
                    <span className="absolute inset-y-0 left-0 rounded-full bg-copper" style={{ width: `${(c.yieldYear / maxYield) * 100}%` }} />
                  </span>
                  <span className="w-36 text-right font-mono text-sm tabular">{formatNumber(c.yieldYear, 0)} kWh/kWp·año</span>
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-copper-text">
                  {formatNumber(c.hsp)} h sol pico
                  <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-fg-subtle">Radiación según la tabla de horas de sol pico que usa nuestro cotizador. ¿Tu municipio no aparece? El cotizador incluye más de 170 municipios.</p>
      </Section>

      <CtaBand />
    </>
  );
}
