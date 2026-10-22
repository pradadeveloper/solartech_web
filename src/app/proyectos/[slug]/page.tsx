import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Card, Section } from "@/components/sections/section";
import { ProjectCard } from "@/components/sections/project-card";
import { CtaBand } from "@/components/sections/cta-band";
import { BusinessModels } from "@/components/sections/business-models";
import { ButtonLink } from "@/components/ui/button";
import { Delta } from "@/components/ui/badge";
import { getProject, hasProjectPage, projectPlace, projects, sectorLabels, type Project } from "@/content/projects";
import { quoteConfig } from "@/config/quote-config";
import { resolveHsp, monthlyGeneration } from "@/lib/quote-engine";
import { pageMetadata } from "@/lib/seo";
import { formatCOP, formatCOPCompact, formatNumber } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.filter(hasProjectPage).map((p) => ({ slug: p.slug }));
}

const modelPaths: Record<Project["model"], string> = {
  EPC: "/servicios/epc/",
  PPA: "/servicios/ppa/",
  "Gestión de plantas": "/servicios/gestion-de-plantas/",
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) return {};
  const kwp = formatNumber(p.kwp, 0);
  const result = p.paybackYears ? `retorno de ${formatNumber(p.paybackYears)} años` : "sin inversión (PPA)";
  const savings = p.monthlySavingsCop !== null ? `ahorro de ${formatCOPCompact(p.monthlySavingsCop)} al mes y ` : "";
  return pageMetadata({
    title: `${p.name}: planta solar de ${kwp} kWp`,
    description: `Caso de éxito Solartech en ${p.city}: ${kwp} kWp, ${savings}${result}. Calcula tu ahorro.`,
    path: `/proyectos/${p.slug}/`,
    image: `/og/proyectos/${p.slug}.png`,
  });
}

/** Párrafo neutral construido solo con los datos del proyecto (sin hechos inventados). */
function dataSummary(p: Project) {
  const base = `${p.name} opera una planta solar de ${formatNumber(p.kwp)} kWp en ${projectPlace(p)}, construida por Solartech bajo el modelo ${p.model}.`;
  const savings = p.monthlySavingsCop !== null ? ` Hoy ahorra ${formatCOP(p.monthlySavingsCop)} al mes en su factura de energía` : "";
  if (p.paybackYears) return `${base}${savings ? `${savings} y recupera` : " Recupera"} la inversión en ${formatNumber(p.paybackYears)} años.`;
  return savings ? `${base}${savings}.` : base;
}

export default async function ProyectoPage({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) notFound();

  const hsp = resolveHsp(p.department, p.city);
  const generation = monthlyGeneration(p.kwp, hsp);
  const panels = Math.floor((p.kwp * 1000) / quoteConfig.solar.panelWp);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.city}, ${p.department}, Colombia`)}`;

  const terms: { label: string; value: string; note?: string; positive?: boolean }[] = [
    { label: "Potencia instalada", value: `${formatNumber(p.kwp)} kWp` },
    { label: "Paneles", value: `${panels}`, note: `aprox., de ${quoteConfig.solar.panelWp} W` },
    { label: "Generación mensual", value: `${formatNumber(generation, 0)} kWh`, note: "estimada" },
    ...(p.monthlySavingsCop !== null
      ? [
          { label: "Ahorro mensual", value: formatCOP(p.monthlySavingsCop), positive: true },
          { label: "Ahorro anual", value: formatCOP(p.monthlySavingsCop * 12), positive: true },
        ]
      : []),
    p.paybackYears ? { label: "Retorno de la inversión", value: `${formatNumber(p.paybackYears)} años` } : { label: "Inversión del cliente", value: "$0" },
    { label: "Modelo", value: p.model },
    { label: "Sector", value: sectorLabels[p.sector] },
    { label: "Ubicación", value: projectPlace(p) },
  ];

  const others = [...projects.filter((o) => o.slug !== p.slug)]
    .sort((a, b) => Number(b.sector === p.sector) - Number(a.sector === p.sector) || Math.abs(a.kwp - p.kwp) - Math.abs(b.kwp - p.kwp))
    .slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={`Caso de éxito · ${p.model}`}
        title={`${p.name}: planta solar de ${formatNumber(p.kwp)} kWp en ${p.city}`}
        description={
          <p>
            {p.monthlySavingsCop !== null && (
              <>
                Ahorro de <span className="font-mono font-semibold text-positive tabular">{formatCOP(p.monthlySavingsCop)}</span> al mes
              </>
            )}
            {p.paybackYears
              ? `${p.monthlySavingsCop !== null ? " y r" : "R"}etorno de la inversión en ${formatNumber(p.paybackYears)} años.`
              : " sin invertir un peso, con modelo PPA."}
          </p>
        }
        crumbs={[
          { name: "Proyectos", path: "/proyectos/" },
          { name: p.name, path: `/proyectos/${p.slug}/` },
        ]}
        actions={
          <>
            <ButtonLink href="/cotizador/" size="lg" data-event="cta_cotizar_proyecto">
              Calcular mi ahorro
            </ButtonLink>
            <ButtonLink href={mapsUrl} external variant="secondary" size="lg">
              <MapPin aria-hidden className="size-4" />
              Ver ubicación en Google Maps
            </ButtonLink>
          </>
        }
        aside={
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
            <Image src={p.image} alt={p.imageAlt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        }
      />

      <Section eyebrow="Ficha técnica" title="Los números del proyecto">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <dl className="divide-y divide-border rounded-3xl border border-border bg-surface px-6 sm:px-8">
            {terms.map((t) => (
              <div key={t.label} className="flex items-baseline justify-between gap-4 py-4">
                <dt className="text-sm text-fg-muted">
                  {t.label}
                  {t.note && <span className="ml-1.5 text-xs text-fg-subtle">({t.note})</span>}
                </dt>
                <dd className={`text-right font-mono font-semibold tabular ${t.positive ? "text-positive" : ""}`}>{t.value}</dd>
              </div>
            ))}
          </dl>

          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-bold">Sobre el proyecto</h3>
              <p className="mt-3 text-fg-muted">{p.summary ?? dataSummary(p)}</p>
              {p.clientUrl && (
                <a href={p.clientUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-copper-text hover:underline">
                  Conoce a {p.name}
                  <ArrowUpRight aria-hidden className="size-4" />
                </a>
              )}
            </Card>
            {p.paybackYears && p.monthlySavingsCop !== null ? (
              <InvestmentChart project={p} monthlySavingsCop={p.monthlySavingsCop} />
            ) : p.model === "PPA" ? (
              <PpaSummary project={p} />
            ) : null}
          </div>
        </div>
        {/* Testimonio del cliente y video del proyecto: agregar aquí cuando Solartech los tenga. */}
      </Section>

      <Section tone="muted" eyebrow={`Modelo ${p.model}`} title="¿Cómo funciona este modelo?">
        <BusinessModels />
        <p className="mt-6 text-sm text-fg-muted">
          Este proyecto se desarrolló con el modelo{" "}
          <a href={modelPaths[p.model]} className="font-semibold text-copper-text hover:underline">
            {p.model}
          </a>
          .
        </p>
      </Section>

      <Section eyebrow="Más casos de éxito" title="Otros proyectos" action={<ButtonLink href="/proyectos/" variant="secondary">Ver todos</ButtonLink>}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((o) => (
            <li key={o.slug}>
              <ProjectCard project={o} />
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title={`¿Quieres un proyecto como el de ${p.name}?`} whatsappMessage={`Hola Solartech. Vi el proyecto de ${p.name} en su web y quiero uno similar.`} />
    </>
  );
}

/** Ahorro acumulado (sin escalamiento) vs. inversión implícita derivada del retorno real. */
function InvestmentChart({ project: p, monthlySavingsCop }: { project: Project; monthlySavingsCop: number }) {
  const years = Math.ceil((p.paybackYears ?? 0) * 2);
  const annual = monthlySavingsCop * 12;
  const investment = annual * (p.paybackYears ?? 0);
  const maxValue = annual * years;
  const W = 560;
  const H = 220;
  const pad = { l: 8, r: 8, t: 16, b: 28 };
  const x = (year: number) => pad.l + (year / years) * (W - pad.l - pad.r);
  const y = (value: number) => H - pad.b - (value / maxValue) * (H - pad.t - pad.b);
  const breakEvenX = x(p.paybackYears ?? 0);

  return (
    <Card>
      <h3 className="text-lg font-bold">Inversión vs. ahorro acumulado</h3>
      <p className="mt-1 text-xs text-fg-subtle">Inversión implícita, estimada a partir del retorno real. Ahorro sin incluir el alza de la tarifa.</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-5 h-auto w-full" role="img" aria-label={`El ahorro acumulado iguala la inversión en ${formatNumber(p.paybackYears ?? 0)} años`}>
        <line x1={pad.l} x2={W - pad.r} y1={y(investment)} y2={y(investment)} stroke="var(--copper-text)" strokeDasharray="6 6" strokeWidth={2} />
        <line x1={x(0)} y1={y(0)} x2={x(years)} y2={y(maxValue)} stroke="var(--positive)" strokeWidth={3} strokeLinecap="round" />
        <line x1={breakEvenX} x2={breakEvenX} y1={pad.t} y2={H - pad.b} stroke="var(--border-strong)" />
        <circle cx={breakEvenX} cy={y(investment)} r={6} fill="var(--positive)" />
        <text x={breakEvenX + 10} y={y(investment) - 10} fill="var(--fg)" fontSize={13} fontWeight={600}>
          Punto de equilibrio · {formatNumber(p.paybackYears ?? 0)} años
        </text>
        {Array.from({ length: years + 1 }, (_, i) => i)
          .filter((i) => i % Math.max(1, Math.ceil(years / 6)) === 0)
          .map((i) => (
            <text key={i} x={x(i)} y={H - 8} fill="var(--fg-subtle)" fontSize={11} textAnchor="middle">
              Año {i}
            </text>
          ))}
      </svg>
      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="flex items-center gap-2 text-fg-muted">
            <span aria-hidden className="h-0.5 w-4 bg-copper-text" />
            Inversión implícita
          </dt>
          <dd className="mt-1 font-mono font-semibold tabular">≈ {formatCOPCompact(investment)}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-2 text-fg-muted">
            <span aria-hidden className="h-0.5 w-4 bg-positive" />
            Ahorro en {years} años
          </dt>
          <dd className="mt-1 font-mono font-semibold text-positive tabular">{formatCOPCompact(maxValue)}</dd>
        </div>
      </dl>
    </Card>
  );
}

function PpaSummary({ project: p }: { project: Project }) {
  return (
    <Card>
      <h3 className="text-lg font-bold">Energía solar sin inversión</h3>
      <dl className="mt-5 divide-y divide-border text-sm">
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-fg-muted">Inversión del cliente</dt>
          <dd className="font-mono text-2xl font-semibold tabular">$0</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-fg-muted">Precio del kWh vs. operador de red</dt>
          <dd>
            <Delta>{Math.round(quoteConfig.ppa.discountVsTariff * 100)} % menos</Delta>
          </dd>
        </div>
        {p.monthlySavingsCop !== null && (
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-fg-muted">Ahorro mensual</dt>
            <dd className="font-mono font-semibold text-positive tabular">{formatCOP(p.monthlySavingsCop)}</dd>
          </div>
        )}
      </dl>
      <p className="mt-4 text-sm text-fg-muted">Solartech financió, instaló y opera la planta. El cliente paga solo la energía que consume, más barata que la de la red.</p>
    </Card>
  );
}
