import { Check, ArrowRight, ArrowDown, Building2, Cable, PanelTop, Repeat, Zap } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Section, Card } from "@/components/sections/section";
import { ProjectCard } from "@/components/sections/project-card";
import { TaxBenefits } from "@/components/sections/tax-benefits";
import { ProcessSteps } from "@/components/sections/process-steps";
import { FaqList } from "@/components/sections/faq-list";
import { BusinessModels } from "@/components/sections/business-models";
import { CtaBand } from "@/components/sections/cta-band";
import { ExecutionSteps } from "@/components/sections/execution-steps";
import { FinancingOptions } from "@/components/sections/financing-options";
import { PpaVsPurchase } from "@/components/sections/ppa-vs-purchase";
import { PpaPortfolio } from "@/components/sections/ppa-portfolio";
import { ProjectStructuring } from "@/components/sections/project-structuring";
import { SurplusTable } from "@/components/sections/surplus-table";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { getService, type ServiceKey } from "@/content/services";
import { getProject } from "@/content/projects";
import { whatsappUrl } from "@/content/site";
import { serviceJsonLd } from "@/lib/seo";
import { formatCOP } from "@/lib/utils";

const whatsappMessages: Record<ServiceKey, string> = {
  ppa: "Hola Solartech. Quiero información sobre el modelo PPA (energía solar sin inversión).",
  epc: "Hola Solartech. Quiero cotizar un proyecto solar llave en mano (EPC).",
  "gestion-de-plantas": "Hola Solartech. Quiero información sobre mantenimiento y gestión de mi planta solar.",
};

/** "Term sheet": condiciones del modelo presentadas como ficha de producto financiero. */
function TermSheet({ serviceKey }: { serviceKey: ServiceKey }) {
  const s = getService(serviceKey);
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-px -z-10 rounded-[28px] bg-gradient-to-b from-copper/50 via-border to-transparent" />
      <div className="rounded-[27px] bg-surface/95 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-7">
        <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Condiciones · {s.shortName}</p>
        <p className="mt-4 text-sm text-fg-muted">{s.highlight.label}</p>
        <p className="mt-1 font-mono text-4xl font-semibold tracking-tight tabular">{s.highlight.value}</p>
        <dl className="mt-6 divide-y divide-border border-t border-border">
          {s.terms.map((t) => (
            <div key={t.label} className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-sm text-fg-muted">{t.label}</dt>
              <dd className="text-right font-mono text-sm font-semibold tabular">{t.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/** Explicación ilustrativa del precio del kWh en PPA. */
function PpaPricing() {
  const tariff = 800;
  const discount = 0.35;
  const ppaPrice = tariff * (1 - discount);
  const bars = [
    { label: "Tarifa del operador de red", value: tariff, tone: "bg-surface-3" },
    { label: "Precio PPA Solartech", value: ppaPrice, tone: "bg-gradient-to-r from-copper to-copper-text" },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <Card>
        <h3 className="text-xl font-bold">Pagas menos por cada kWh, desde el primer mes</h3>
        <p className="mt-3 text-fg-muted">
          En un PPA no compras la planta: compras la energía que produce. El precio del kWh solar se fija en el contrato con un descuento sobre la tarifa que hoy te
          cobra el operador de red, así que ahorras sin invertir y sin asumir el mantenimiento.
        </p>
        <ul className="mt-6 space-y-3 text-sm">
          {[
            "La energía solar consumida se factura al precio PPA.",
            "La energía que la planta no cubre la sigues comprando a la red.",
            "Solartech opera y mantiene la planta durante todo el contrato.",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-positive" />
              <span className="text-fg-muted">{t}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="border-copper/40">
        <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Ejemplo ilustrativo · precio por kWh</p>
        <ul className="mt-6 space-y-5">
          {bars.map((b) => (
            <li key={b.label}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-fg-muted">{b.label}</span>
                <span className="font-mono font-semibold tabular">{formatCOP(b.value)}/kWh</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-surface-2">
                <div className={`h-full rounded-full ${b.tone}`} style={{ width: `${(b.value / tariff) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-positive-soft p-4">
          <span className="text-sm">Ahorro por cada kWh solar</span>
          <span className="font-mono text-lg font-semibold text-positive tabular">
            {formatCOP(tariff - ppaPrice)} · {discount * 100} %
          </span>
        </div>
        <p className="mt-4 text-xs text-fg-subtle">Valores ilustrativos. El descuento y el plazo se definen según tu consumo, tu tarifa y tu operador de red.</p>
      </Card>
    </div>
  );
}

/** Recorrido de la energía en un edificio con PPA (presentación PPA, "¿Cómo funciona?"). */
function BuildingFlow() {
  const steps = [
    { icon: PanelTop, title: "Paneles en la cubierta", text: "Generan energía en corriente continua (DC)." },
    { icon: Zap, title: "Inversor", text: "Convierte la energía a corriente alterna (AC)." },
    { icon: Building2, title: "Cuarto eléctrico", text: "La energía alimenta las zonas comunes y las unidades del edificio." },
    { icon: Repeat, title: "Medidor bidireccional", text: "Intercambia con la red: entrega excedentes y toma lo que falte." },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
      <Card>
        <h3 className="text-xl font-bold">Del techo a tu medidor</h3>
        <p className="mt-3 text-fg-muted">
          Instalamos la planta en la cubierta del edificio y la conectamos en el cuarto eléctrico. El edificio usa primero la energía solar; cuando no alcanza, toma
          la de la red como siempre, y el medidor bidireccional registra los dos sentidos.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 text-sm text-fg-subtle">
          <Cable aria-hidden className="size-4" />
          Nosotros tramitamos la conexión y el medidor con el operador de red.
        </p>
      </Card>
      <ol className="grid gap-3">
        {steps.map((step, i) => (
          <li key={step.title}>
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-copper-soft text-copper-text">
                <step.icon aria-hidden className="size-5" />
              </span>
              <span>
                <span className="block font-semibold">{step.title}</span>
                <span className="block text-sm text-fg-muted">{step.text}</span>
              </span>
            </div>
            {i < steps.length - 1 && <ArrowDown aria-hidden className="mx-auto mt-3 size-4 text-fg-subtle" />}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ServicePage({ serviceKey }: { serviceKey: ServiceKey }) {
  const s = getService(serviceKey);
  // En PPA el caso único se reemplaza por el portafolio completo de copropiedades.
  const project = s.caseSlug && serviceKey !== "ppa" ? getProject(s.caseSlug) : undefined;
  const message = whatsappMessages[serviceKey];

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: s.name, description: s.description, path: s.path })} />
      <PageHeader
        eyebrow={s.name}
        title={s.tagline}
        description={<p>{s.summary}</p>}
        crumbs={[
          { name: "Servicios", path: "/servicios/" },
          { name: s.shortName, path: s.path },
        ]}
        actions={
          <>
            <ButtonLink href="/cotizador/" size="lg" data-event="cta_cotizar_servicio">
              Calcular mi ahorro
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
            <ButtonLink href={whatsappUrl(message)} external variant="secondary" size="lg" data-event="whatsapp_click">
              Hablar con un asesor
            </ButtonLink>
          </>
        }
        aside={<TermSheet serviceKey={serviceKey} />}
      />

      <Section id="como-funciona" eyebrow="Cómo funciona" title={`¿Qué es el modelo ${s.shortName}?`}>
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <p className="text-lg text-fg-muted">{s.description}</p>
            <h3 className="mt-8 text-lg font-bold">Ideal para</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {s.idealFor.map((item) => (
                <li key={item} className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg font-bold">Qué incluye</h3>
            <ul className="mt-5 space-y-3">
              {s.includes.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-positive-soft">
                    <Check aria-hidden className="size-3.5 text-positive" />
                  </span>
                  <span className="text-fg-muted">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {serviceKey === "ppa" && (
        <>
          <Section id="precio" eyebrow="Precio de la energía" title="Así funciona el precio en un PPA" tone="muted">
            <PpaPricing />
          </Section>
          <Section id="ppa-vs-compra" eyebrow="Alternativas" title="PPA o compra: compara antes de decidir">
            <PpaVsPurchase />
          </Section>
          <Section
            id="copropiedades"
            eyebrow="Casos de éxito"
            title="Copropiedades que ya ahorran sin invertir"
            description="Edificios y conjuntos residenciales del valle de Aburrá que compran su energía solar a Solartech."
            tone="muted"
          >
            <PpaPortfolio />
          </Section>
          <Section id="en-un-edificio" eyebrow="Cómo funciona" title="¿Cómo funciona en un edificio?">
            <BuildingFlow />
          </Section>
        </>
      )}

      {serviceKey === "epc" && (
        <>
          <Section id="estructurar" eyebrow="Antes de cotizar" title="¿Cómo se estructura un proyecto solar?" tone="muted">
            <ProjectStructuring />
          </Section>
          <Section
            id="beneficios"
            eyebrow="Beneficios tributarios"
            title="Al ser dueño de la planta, accedes a los incentivos de la Ley 1715"
            action={
              <ButtonLink href="/beneficios-tributarios/" variant="secondary">
                Ver guía completa
              </ButtonLink>
            }
          >
            <TaxBenefits />
          </Section>
          <Section
            id="excedentes"
            eyebrow="Regulación"
            title="Lo que no consumes, se lo vendes a la red"
            description="La energía que tu planta produce y no alcanzas a usar se entrega a la red y se te paga según el tamaño del sistema (Resolución CREG 174 de 2021)."
            tone="muted"
          >
            <SurplusTable />
          </Section>
          <Section id="financiacion" eyebrow="Financiación" title="Tres formas de pagar tu planta solar">
            <FinancingOptions highlight="epc" />
          </Section>
        </>
      )}

      {project && (
        <Section id="caso" eyebrow="Caso de éxito" title={`${project.name}: ${s.shortName} en ${project.city}`} tone="muted">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <ProjectCard project={project} />
            <div>
              {project.summary && <p className="text-lg text-fg-muted">{project.summary}</p>}
              <ButtonLink href="/proyectos/" variant="secondary" className="mt-8">
                Ver todos los proyectos
              </ButtonLink>
            </div>
          </div>
        </Section>
      )}

      {serviceKey !== "gestion-de-plantas" && (
        <Section id="ejecucion" eyebrow="Llave en mano" title="Nos encargamos de todo el proyecto" tone={serviceKey === "ppa" ? "muted" : "default"}>
          <ExecutionSteps />
        </Section>
      )}

      <Section id="proceso" eyebrow="Proceso" title="De tu factura a tu planta solar en 5 pasos" tone={serviceKey === "ppa" ? "default" : "muted"}>
        <ProcessSteps />
      </Section>

      {/* Fondos alternos: en PPA el orden de secciones cambia, por eso se invierten aquí. */}
      <Section id="preguntas" eyebrow="Preguntas frecuentes" title={`Preguntas sobre ${s.shortName}`} tone={serviceKey === "ppa" ? "muted" : "default"}>
        <FaqList items={s.faqs} />
      </Section>

      <Section id="otros-modelos" eyebrow="Otros modelos" title="Compara con nuestros otros modelos" tone={serviceKey === "ppa" ? "default" : "muted"}>
        <BusinessModels exclude={serviceKey} />
      </Section>

      <CtaBand whatsappMessage={message} />
    </>
  );
}
