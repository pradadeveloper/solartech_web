import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/sections/section";
import { BusinessModels } from "@/components/sections/business-models";
import { ProcessSteps } from "@/components/sections/process-steps";
import { CtaBand } from "@/components/sections/cta-band";
import { FinancingOptions } from "@/components/sections/financing-options";
import { ExecutionSteps } from "@/components/sections/execution-steps";
import { ButtonLink } from "@/components/ui/button";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Servicios de energía solar: PPA, EPC y O&M",
  description: "Compara los modelos de energía solar de Solartech: PPA sin inversión, EPC llave en mano y gestión de plantas. Encuentra el tuyo y calcula tu ahorro.",
  path: "/servicios/",
});

// Comparación de modelos. Columnas en el mismo orden que `services` (PPA, EPC, Gestión).
const comparison: { label: string; values: [string, string, string] }[] = [
  { label: "Inversión inicial", values: ["$0", "100 % del proyecto", "Según el plan"] },
  { label: "Propiedad del sistema", values: ["Solartech", "Tuya", "Tuya"] },
  { label: "Ahorro", values: ["Hasta 35 % por kWh", "100 % de la energía generada", "Protege tu producción"] },
  { label: "Mantenimiento", values: ["Incluido", "Opcional (O&M)", "Incluido"] },
  { label: "Beneficio tributario", values: ["No aplica", "Deducción 50 % en renta", "No aplica"] },
  { label: "Plazo", values: ["10 a 15 años", "Retorno en 2,7 a 4 años", "Contrato renovable"] },
];

export default function ServiciosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Modelos de negocio"
        title="Servicios de energía solar para cada forma de invertir"
        description={
          <p>
            Aprovechamos la energía del sol para que tu empresa dependa menos de la red y reduzca su huella de carbono. Tienes tres caminos: comprar tu planta llave
            en mano (EPC), pagar solo la energía sin invertir (PPA) o contratar la operación y el mantenimiento de una planta existente.
          </p>
        }
        crumbs={[{ name: "Servicios", path: "/servicios/" }]}
        actions={
          <ButtonLink href="/cotizador/" size="lg" data-event="cta_cotizar_servicios">
            Calcular mi ahorro
            <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        }
      />

      <Section id="modelos" eyebrow="Tres modelos" title="Elige el modelo que se ajusta a tu caja">
        <BusinessModels />
      </Section>

      <Section
        id="comparativo"
        tone="muted"
        eyebrow="Comparativo"
        title="PPA, EPC y gestión de plantas, lado a lado"
        description="Las condiciones finales dependen de tu consumo, tu tarifa y la visita técnica."
      >
        <div className="overflow-x-auto rounded-3xl border border-border bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Comparación de los modelos PPA, EPC y gestión de plantas</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="p-5 font-mono text-[11px] font-medium tracking-[0.12em] text-fg-subtle uppercase">
                  Condición
                </th>
                {services.map((s) => (
                  <th key={s.key} scope="col" className="p-5">
                    <Link href={s.path} className="text-base font-extrabold hover:text-copper-text">
                      {s.shortName}
                    </Link>
                    <span className="mt-0.5 block text-xs font-normal text-fg-muted">{s.tagline}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparison.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="p-5 font-medium text-fg-muted">
                    {row.label}
                  </th>
                  {row.values.map((v, i) => (
                    <td key={i} className="p-5 font-mono font-semibold tabular">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="financiacion"
        eyebrow="Financiación"
        title="Tres formas de pagar tu planta solar"
        description="Compra con recursos propios, paga solo la energía con un PPA o financia el sistema en cuotas con leasing."
      >
        <FinancingOptions />
      </Section>

      <Section id="ejecucion" tone="muted" eyebrow="Llave en mano" title="Nos encargamos de todo el proyecto">
        <ExecutionSteps />
      </Section>

      <Section id="proceso" eyebrow="Proceso" title="De tu factura a tu planta solar en 5 pasos">
        <ProcessSteps />
      </Section>

      <CtaBand title="¿No sabes qué modelo te conviene?" text="Con tu factura de energía calculamos el ahorro en EPC y en PPA para que compares con cifras reales." />
    </>
  );
}
