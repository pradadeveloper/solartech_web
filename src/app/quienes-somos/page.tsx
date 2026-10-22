import Image from "next/image";
import { ArrowUpRight, Leaf, LineChart, ShieldCheck, Wrench } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Card, Section } from "@/components/sections/section";
import { ProcessSteps } from "@/components/sections/process-steps";
import { CtaBand } from "@/components/sections/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ExecutionSteps } from "@/components/sections/execution-steps";
import { ClientLogos } from "@/components/sections/client-logos";
import { partners } from "@/content/partners";
import { clients } from "@/content/clients";
import { company } from "@/content/sales-deck";
import { pillars } from "@/content/services";
import { portfolioStats } from "@/content/projects";
import { site, whatsappUrl } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Quiénes somos: empresa de energía solar",
  description: "Solartech, del grupo Ferragro (35+ años): más de 10 años diseñando y construyendo proyectos de energía solar en Colombia. Conócenos y cotiza.",
  path: "/quienes-somos/",
});

const pillarIcons = [LineChart, ShieldCheck, Wrench, Leaf];

const values = [
  {
    title: "Rentabilidad primero",
    text: "Diseñamos cada proyecto como una inversión: con cifras claras de ahorro, retorno y beneficio tributario desde la propuesta.",
  },
  {
    title: "Acompañamiento de principio a fin",
    text: "Un asesor te acompaña desde el análisis de la factura hasta el monitoreo de la planta en operación.",
  },
  {
    title: "Impacto ambiental real",
    text: "Cada kWh solar que generas reduce emisiones y tu dependencia de generadores diésel y de una red inestable.",
  },
];

export default function QuienesSomosPage() {
  const stats = portfolioStats();
  const kpis = [
    { value: site.claims.yearsExperience, prefix: "+", suffix: " años", label: "De experiencia en proyectos solares" },
    { value: site.claims.installedKwpTotal, prefix: "+", suffix: " kWp", label: "Instalados en Colombia" },
    { value: stats.monthlySavingsCop, format: "copCompact" as const, label: "Ahorro mensual de nuestros casos de éxito" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Quiénes somos"
        title={
          <>
            Empresa de energía solar en Colombia, <span className="text-gradient-copper">parte del grupo Ferragro</span>
          </>
        }
        description="Somos una compañía especializada en asesorar y ejecutar proyectos de energía solar. Te ayudamos a aprovechar al máximo la energía del sol para cubrir tus necesidades energéticas de forma eficiente, sostenible y rentable."
        crumbs={[{ name: "Quiénes somos", path: "/quienes-somos/" }]}
        actions={
          <>
            <ButtonLink href="/cotizador/" size="lg">
              Calcular mi ahorro
            </ButtonLink>
            <ButtonLink href={whatsappUrl("Hola Solartech, ingresé por la página web y quiero una asesoría para un proyecto de energía solar.")} external variant="secondary" size="lg" data-event="whatsapp_click">
              Requiero una asesoría
            </ButtonLink>
          </>
        }
        aside={
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
            <Image
              src="/images/proyectos/dron-planta-solar-dji-0529.webp"
              alt="Vista aérea de una planta solar construida por Solartech sobre una cubierta industrial"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        }
      />

      <Section>
        <dl className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
          {kpis.map((k) => (
            <div key={k.label} className="flex flex-col-reverse bg-surface p-6 sm:p-8">
              <dt className="mt-2 text-sm text-fg-muted">{k.label}</dt>
              <dd className="font-mono text-3xl font-semibold whitespace-nowrap tabular sm:text-4xl">
                <AnimatedNumber value={k.value} format={k.format} prefix={k.prefix} suffix={k.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="por-que-solartech"
        eyebrow="¿Por qué Solartech?"
        title="Lideramos la transición energética de empresas y hogares en Colombia"
        className="pt-0 lg:pt-0"
      >
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5 text-fg-muted sm:text-lg">
            <p>
              Con más de {site.claims.yearsExperience} años de experiencia y más de {site.claims.installedKwpTotal.toLocaleString("es-CO")} kWp instalados, somos expertos en
              asesorar y ejecutar proyectos fotovoltaicos para industria, agro, comercio, copropiedades y hogares, con el respaldo de los más de 35 años del grupo{" "}
              {site.parent.name}.
            </p>
            <p>
              Creemos en la energía solar como motor de un cambio real en el medio ambiente, y en la rentabilidad y la eficiencia como condiciones para que las empresas
              se sostengan en el largo plazo.
            </p>
            <p>
              Nuestro compromiso es hacer la energía solar asequible y viable para todas las empresas y hogares del país: que nuestros clientes ahorren dinero mientras
              reducen su impacto ambiental. Te acompañamos durante todo el camino para encontrar el proyecto que mejor se adapta a tus necesidades.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border sm:aspect-[4/3] lg:aspect-[4/5]">
            <Image
              src="/images/secciones/quienes-somos-asesoria-persona.webp"
              alt="Asesora de Solartech acompañando a un cliente en su proyecto de energía solar"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section id="ferragro" tone="muted">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Respaldo corporativo</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Respaldo del grupo Ferragro</h2>
            <p className="mt-4 max-w-2xl text-fg-muted sm:text-lg">
              Solartech hace parte del grupo {site.parent.name}, con sede en Itagüí, Antioquia: más de 35 años de trayectoria, más de 200 empleados, presencia en todo
              el país y distribución directa de equipos. Esa solidez respalda proyectos que operan por más de 25 años.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={site.parent.url} external variant="secondary">
              Conocer Ferragro
              <ArrowUpRight aria-hidden className="size-4" />
            </ButtonLink>
            <ButtonLink href={site.equipmentStore} external variant="ghost">
              Venta de equipos
              <ArrowUpRight aria-hidden className="size-4" />
            </ButtonLink>
          </div>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-6">
          {[...company.group, ...company.technology].map((s) => (
            <div key={s.label} className="flex flex-col-reverse bg-surface p-5 sm:p-6">
              <dt className="mt-2 text-sm text-fg-muted">{s.label}</dt>
              <dd className="font-mono text-2xl font-semibold whitespace-nowrap tabular sm:text-3xl">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <ExecutionSteps />
        </div>
      </Section>

      <Section id="pilares" eyebrow="Nuestra propuesta" title="Proyectos solares rentables, confiables y sostenibles">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => {
            const Icon = pillarIcons[i];
            return (
              <li key={p.title}>
                <Card className="h-full p-6 sm:p-6">
                  <span className="grid size-11 place-items-center rounded-2xl bg-copper-soft text-copper-text">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm text-fg-muted">{p.text}</p>
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section id="valores" eyebrow="Misión" title="Hacer que la energía solar sea accesible" tone="muted">
        <ul className="grid gap-4 lg:grid-cols-3">
          {values.map((v, i) => (
            <li key={v.title}>
              <Card className="h-full">
                <span className="font-mono text-xs text-copper-text">0{i + 1}</span>
                <h3 className="mt-3 text-xl font-bold">{v.title}</h3>
                <p className="mt-2 text-fg-muted">{v.text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="clientes" eyebrow="Clientes" title="Empresas que ya generan su energía con Solartech" description="Industria, comercio, colegios, hoteles, agro y copropiedades que confiaron en nosotros.">
        <ClientLogos initial={clients.length} />
      </Section>

      <Section id="aliados" tone="muted" eyebrow="Aliados y marcas" title="Trabajamos con banca y fabricantes líderes" description="Financiación con la banca aliada y equipos de fabricantes reconocidos en paneles, inversores y estructuras.">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {partners.map((p) => (
            <li key={p.name} className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-surface px-6 py-8">
              {/* Logo a color sobre ficha blanca (se lee igual en tema oscuro y claro). */}
              <div className="flex h-24 w-full items-center justify-center rounded-2xl bg-white px-6 py-4 ring-1 ring-black/5">
                <div className="relative h-full w-full max-w-[180px]">
                  <Image src={p.logo} alt={`Logo de ${p.name}`} fill sizes="180px" className="object-contain" />
                </div>
              </div>
              <span className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">{p.kind}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="proceso" eyebrow="Cómo trabajamos" title="De tu factura a una planta solar en operación">
        <ProcessSteps />
      </Section>

      <CtaBand title="Potenciemos juntos la rentabilidad de tu negocio" text="Nuestros asesores te ayudan a encontrar la solución solar ideal para tus necesidades. El cambio comienza hoy." />
    </>
  );
}
