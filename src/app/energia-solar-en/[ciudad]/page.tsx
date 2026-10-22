import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/sections/section";
import { ProjectCard } from "@/components/sections/project-card";
import { ProcessSteps } from "@/components/sections/process-steps";
import { BusinessModels } from "@/components/sections/business-models";
import { FaqList } from "@/components/sections/faq-list";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { cities, getCity } from "@/content/cities";
import { getProject } from "@/content/projects";
import { site } from "@/content/site";
import { quoteConfig } from "@/config/quote-config";
import { computeQuote, referenceTariff, resolveHsp } from "@/lib/quote-engine";
import { pageMetadata } from "@/lib/seo";
import { formatCOP, formatCOPCompact, formatNumber } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ ciudad: c.slug }));
}

type Params = { params: Promise<{ ciudad: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const city = getCity((await params).ciudad);
  if (!city) return {};
  return pageMetadata({ title: city.metaTitle, description: city.metaDescription, path: `/energia-solar-en/${city.slug}/` });
}

// Escenarios típicos de factura empresarial para mostrar el cálculo en cada ciudad.
const SCENARIO_BILLS = [3_000_000, 10_000_000, 30_000_000];
const BASELINE_HSP = 3.5; // Medellín, referencia para comparar ciudades.

export default async function CityPage({ params }: Params) {
  const city = getCity((await params).ciudad);
  if (!city) notFound();

  const hsp = resolveHsp(city.departamento, city.municipio);
  const tariff = referenceTariff(city.departamento);
  const yieldPerKwpYear = hsp * 365 * quoteConfig.solar.performanceRatio;
  const panelKwhMonth = (quoteConfig.solar.panelWp / 1000) * yieldPerKwpYear / 12;
  const vsBaseline = hsp / BASELINE_HSP - 1;
  const scenarios = SCENARIO_BILLS.map((billCop) => ({
    billCop,
    q: computeQuote({ clientType: "empresa", departamento: city.departamento, municipio: city.municipio, billCop, tariffCopKwh: tariff, batteries: false, modelInterest: "no_se" }),
  }));
  const nearby = city.projectSlugs.map(getProject).filter((p) => p !== undefined);
  const quoteHref = `/cotizador/?${new URLSearchParams({ tipo: "empresa", dep: city.departamento, mun: city.municipio })}`;
  const path = `/energia-solar-en/${city.slug}/`;

  const kpis = [
    { label: "Horas de sol pico al día", value: formatNumber(hsp) },
    { label: "Producción por kWp al año", value: `${formatNumber(yieldPerKwpYear, 0)} kWh` },
    { label: "Un panel de 620 W al mes", value: `${formatNumber(panelKwhMonth, 0)} kWh` },
    { label: "Operador de red", value: city.operator.name },
  ];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Instalación de paneles solares en ${city.name}`,
    serviceType: "Energía solar fotovoltaica",
    url: `${site.url}${path}`,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: { "@type": "City", name: city.name, containedInPlace: { "@type": "AdministrativeArea", name: city.departamento } },
  };

  return (
    <>
      <PageHeader
        eyebrow={`Energía solar en ${city.name}`}
        title={`Paneles solares en ${city.name} para empresas`}
        description={city.intro}
        crumbs={[
          { name: "Energía solar por ciudad", path: "/energia-solar-en/" },
          { name: city.name, path },
        ]}
        actions={
          <>
            <ButtonLink href={quoteHref} size="lg" data-event="cta_cotizar_ciudad">
              Calcular mi ahorro en {city.name}
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </>
        }
        aside={
          <div className="overflow-hidden rounded-3xl border border-border bg-border">
            <dl className="grid grid-cols-2 gap-px">
              {kpis.map((k) => (
                <div key={k.label} className="bg-surface p-5 sm:p-6">
                  <dt className="text-xs text-fg-muted">{k.label}</dt>
                  <dd className="mt-2 font-mono text-xl font-semibold tabular sm:text-2xl">{k.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-px bg-surface px-5 py-4 text-xs text-fg-subtle sm:px-6">
              {vsBaseline > 0.01
                ? `Cada panel produce cerca de ${Math.round(vsBaseline * 100)} % más energía que en Medellín.`
                : "Radiación del valle de Aburrá, referencia de nuestros proyectos en Antioquia."}
            </p>
          </div>
        }
      />

      <Section
        id="escenarios"
        eyebrow="Escenarios de ahorro"
        title={`¿Cuánto ahorra una empresa en ${city.name}?`}
        description={`Calculado con nuestro cotizador para ${city.name}: ${formatNumber(hsp)} horas de sol pico y una tarifa de referencia de ${formatCOP(tariff)}/kWh. Tu caso cambia con tu tarifa y tu techo.`}
      >
        <div className="overflow-x-auto rounded-3xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Escenarios de ahorro con energía solar en {city.name}</caption>
            <thead className="bg-surface-2 text-xs text-fg-muted">
              <tr>
                <th scope="col" className="px-5 py-4 font-semibold">Factura mensual</th>
                <th scope="col" className="px-5 py-4 font-semibold">Sistema</th>
                <th scope="col" className="px-5 py-4 font-semibold">Ahorro al mes</th>
                <th scope="col" className="px-5 py-4 font-semibold">Inversión estimada*</th>
                <th scope="col" className="px-5 py-4 font-semibold">Sin invertir (PPA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface font-mono tabular">
              {scenarios.map(({ billCop, q }) => (
                <tr key={billCop}>
                  <th scope="row" className="px-5 py-4 text-left font-semibold">{formatCOPCompact(billCop)}</th>
                  <td className="px-5 py-4">{formatNumber(q.system.kwp, 0)} kWp</td>
                  <td className="px-5 py-4 text-positive">{formatCOPCompact(q.savings.monthlyCop)}</td>
                  <td className="px-5 py-4">
                    {formatCOPCompact(q.investment.lowCop)} – {formatCOPCompact(q.investment.highCop)}
                  </td>
                  <td className="px-5 py-4">{q.ppa.available ? `${formatCOPCompact(q.ppa.monthlySavingsCop)}/mes` : "Desde 30 kWp"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-fg-subtle">
          {/* El retorno no se muestra aquí mientras los precios por kWp sean provisionales: en zonas de alta
              radiación daría cifras más cortas que las de nuestros proyectos reales (3 a 3,8 años). */}
          *Rango ±15 %, IVA incluido. Pre-cotización referencial con parámetros {quoteConfig.version}; la propuesta final requiere visita técnica y análisis de factura.
        </p>
        <div className="mt-8">
          <ButtonLink href={quoteHref} variant="secondary" data-event="cta_cotizar_ciudad_tabla">
            Calcular con mi factura
            <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
      </Section>

      <Section id="contexto" tone="muted" eyebrow={city.name} title={`Lo que hay que saber en ${city.name}`}>
        <ul className="grid gap-4 lg:grid-cols-3">
          {city.context.map((c) => (
            <li key={c.title} className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
              <h3 className="text-lg font-bold">{c.title}</h3>
              <p className="mt-3 text-fg-muted">{c.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-fg-muted">
          Operador de red:{" "}
          <a href={city.operator.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-copper-text hover:underline">
            {city.operator.name}
            <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
        </p>
      </Section>

      {nearby.length > 0 && (
        <Section id="proyectos" eyebrow="Casos de éxito" title={city.projectsLabel}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="modelos" tone="muted" eyebrow="Modelos" title={`Cómo instalar paneles solares en ${city.name}`}>
        <BusinessModels />
      </Section>

      <Section id="proceso" eyebrow="Proceso" title="De tu factura a tu planta en 5 pasos">
        <ProcessSteps />
      </Section>

      <Section id="preguntas" tone="muted" eyebrow="Preguntas frecuentes" title={`Energía solar en ${city.name}: preguntas`}>
        <FaqList items={city.faqs} />
        <p className="mt-6 text-sm text-fg-muted">
          ¿Tu ciudad no está aquí?{" "}
          <Link href="/energia-solar-en/" className="font-semibold text-copper-text hover:underline">
            Mira todas las ciudades
          </Link>{" "}
          o calcula tu ahorro eligiendo tu municipio.
        </p>
      </Section>

      <CtaBand
        title={`Calcula el ahorro de tu empresa en ${city.name}`}
        whatsappMessage={`Hola Solartech. Quiero información sobre energía solar para mi empresa en ${city.name}.`}
      />
      <JsonLd data={serviceJsonLd} />
    </>
  );
}
