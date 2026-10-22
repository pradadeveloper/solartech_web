import Link from "next/link";
import { ArrowRight, Building2, Check, Info, Minus, User } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Card, Section } from "@/components/sections/section";
import { TaxBenefits } from "@/components/sections/tax-benefits";
import { SurplusTable } from "@/components/sections/surplus-table";
import { FaqList } from "@/components/sections/faq-list";
import { CtaBand } from "@/components/sections/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { taxDisclaimer } from "@/content/tax-benefits";
import type { Faq } from "@/content/faq";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";

const path = "/beneficios-tributarios/";

export const metadata = pageMetadata({
  title: "Ley 1715: beneficios tributarios energía solar",
  description: "Deducción del 50 % en renta, exclusión de IVA, cero aranceles y depreciación acelerada para proyectos solares en Colombia. Calcula tu beneficio.",
  path,
});

const eligible = [
  {
    icon: Building2,
    title: "Personas jurídicas",
    text: "Empresas declarantes del impuesto de renta que inviertan directamente en un proyecto de energía solar.",
  },
  {
    icon: User,
    title: "Personas naturales declarantes",
    text: "Personas que declaran renta y realizan la inversión, según su situación tributaria particular.",
  },
];

const steps = [
  { title: "Diseño del proyecto", text: "Dimensionamos el sistema y definimos los equipos y servicios que harán parte de la inversión." },
  {
    title: "Certificación ante la UPME",
    text: "Se solicita el certificado de la UPME con la información técnica y económica del proyecto. Conviene hacerlo antes de comprar los equipos.",
  },
  { title: "Compra e instalación", text: "Los equipos y servicios certificados se adquieren con exclusión de IVA y, si son importados, sin arancel." },
  { title: "Entrada en operación", text: "La planta empieza a generar y a reducir tu factura de energía." },
  {
    title: "Declaración de renta",
    text: "Desde el año gravable siguiente a la entrada en operación aplicas la deducción y la depreciación acelerada, con tu contador.",
  },
];

const timeline = [
  { when: "Año 0", title: "Inversión", text: "Compras la planta sin IVA en los equipos certificados." },
  { when: "Año 1", title: "Empieza la deducción", text: "Deduces parte del 50 % de la inversión, hasta el 50 % de tu renta líquida del año." },
  { when: "Años 1–3", title: "Depreciación acelerada", text: "Deprecias los activos a una tasa de hasta 33,33 % anual." },
  { when: "Hasta el año 15", title: "Saldo de la deducción", text: "Lo que no alcances a deducir un año lo aplicas en los siguientes, dentro del plazo." },
];

const comparison = [
  { label: "Quién invierte", epc: "Tú", ppa: "Solartech" },
  { label: "Quién toma los beneficios tributarios", epc: "Tú", ppa: "El inversionista del proyecto" },
  { label: "Cómo lo recibes", epc: "Menor impuesto de renta", ppa: "Precio del kWh más bajo que la red" },
  { label: "Requiere declarar renta", epc: true, ppa: false },
];

const faqs: Faq[] = [
  {
    q: "¿Qué ley da beneficios tributarios a la energía solar en Colombia?",
    a: "La Ley 1715 de 2014, modificada por la Ley 2099 de 2021. Establece la deducción especial en renta, la exclusión de IVA, la exención de aranceles y la depreciación acelerada para proyectos de fuentes no convencionales de energía, como la solar.",
  },
  {
    q: "¿Cuánto puedo deducir de renta por un proyecto solar?",
    a: "Hasta el 50 % del valor de la inversión, en un plazo de hasta 15 años contados desde el año gravable siguiente a la entrada en operación. Cada año la deducción no puede superar el 50 % de la renta líquida del contribuyente.",
  },
  {
    q: "¿Qué necesito para acceder a los incentivos?",
    a: "El proyecto debe contar con la certificación de la UPME, que valida que los equipos y servicios hacen parte de un proyecto de fuentes no convencionales de energía. En Solartech te acompañamos en la preparación de la información técnica.",
  },
  {
    q: "¿Los beneficios aplican si elijo el modelo PPA?",
    a: "En un PPA no inviertes en la planta, así que los incentivos los toma el inversionista del proyecto. Tú te beneficias de un precio de energía más bajo que el de la red, sin inversión.",
  },
  {
    q: "¿Puedo combinar la deducción con la depreciación acelerada?",
    a: "Son incentivos distintos establecidos en artículos diferentes de la Ley 1715. Cómo se aplican en conjunto depende de tu situación contable y tributaria, por lo que debes validarlo con tu contador o asesor tributario.",
  },
];

export default function BeneficiosTributariosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ley 1715 · Ley 2099"
        title={
          <>
            Beneficios tributarios de la <span className="text-gradient-copper">energía solar en Colombia</span>
          </>
        }
        description="Invertir en paneles solares no solo reduce tu factura: la ley te permite deducir de renta la mitad de la inversión, comprar los equipos sin IVA y depreciarlos más rápido."
        crumbs={[{ name: "Beneficios tributarios", path }]}
        actions={
          <>
            <ButtonLink href="/cotizador/" size="lg" data-event="cta_cotizar_beneficios">
              Calcular mi beneficio
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
            <ButtonLink href="/servicios/epc/" variant="secondary" size="lg">
              Ver proyectos EPC
            </ButtonLink>
          </>
        }
      />

      <Section
        id="incentivos"
        eyebrow="Los 4 incentivos"
        title="Qué beneficios tiene un proyecto solar"
        description="La Ley 1715 de 2014, modificada por la Ley 2099 de 2021, promueve las fuentes no convencionales de energía con cuatro incentivos."
      >
        <TaxBenefits />
      </Section>

      <Section id="quien-accede" tone="muted" eyebrow="Requisitos" title="Quién puede acceder">
        <div className="grid gap-4 lg:grid-cols-3">
          {eligible.map((e) => (
            <Card key={e.title}>
              <e.icon aria-hidden className="size-6 text-copper-text" />
              <h3 className="mt-4 text-xl font-bold">{e.title}</h3>
              <p className="mt-2 text-fg-muted">{e.text}</p>
            </Card>
          ))}
          <Card className="border-copper/40">
            <Info aria-hidden className="size-6 text-copper-text" />
            <h3 className="mt-4 text-xl font-bold">Condición clave</h3>
            <p className="mt-2 text-fg-muted">
              La deducción reduce el impuesto solo si tienes renta líquida. Si no declaras renta, el modelo{" "}
              <Link href="/servicios/ppa/" className="font-semibold text-copper-text hover:underline">
                PPA
              </Link>{" "}
              puede ser una mejor opción.
            </p>
          </Card>
        </div>
      </Section>

      <Section id="proceso" eyebrow="Paso a paso" title="Cómo se accede a los beneficios">
        <ol className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className="bg-surface p-6">
              <span className="font-mono text-xs text-copper-text">Paso {String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="linea-de-tiempo" tone="muted" eyebrow="En el tiempo" title="Así se aplican los beneficios año a año">
        <ol className="relative grid gap-6 border-l border-border pl-6 md:grid-cols-4 md:border-t md:border-l-0 md:pt-8 md:pl-0">
          {timeline.map((t) => (
            <li key={t.when} className="relative">
              <span aria-hidden className="absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-copper md:-top-[37px] md:left-0" />
              <p className="font-mono text-sm font-semibold text-copper-text tabular">{t.when}</p>
              <h3 className="mt-2 text-lg font-bold">{t.title}</h3>
              <p className="mt-1 text-sm text-fg-muted">{t.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="epc-vs-ppa"
        eyebrow="Según tu modelo"
        title="Beneficios tributarios en EPC y en PPA"
        description="En un proyecto EPC la planta es tuya y los incentivos también. En un PPA no inviertes y recibes el beneficio como un precio de energía más bajo."
      >
        <div className="overflow-x-auto rounded-3xl border border-border bg-surface">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="p-4 font-mono text-[11px] font-medium tracking-[0.12em] text-fg-subtle uppercase sm:p-6">
                  <span className="sr-only">Concepto</span>
                </th>
                <th scope="col" className="p-4 text-base font-extrabold sm:p-6">
                  <Link href="/servicios/epc/" className="hover:text-copper-text">
                    EPC
                  </Link>
                </th>
                <th scope="col" className="p-4 text-base font-extrabold sm:p-6">
                  <Link href="/servicios/ppa/" className="hover:text-copper-text">
                    PPA
                  </Link>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparison.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="p-4 font-medium text-fg-muted sm:p-6">
                    {row.label}
                  </th>
                  {[row.epc, row.ppa].map((v, i) => (
                    <td key={i} className="p-4 sm:p-6">
                      {typeof v === "boolean" ? (
                        v ? (
                          <Check aria-label="Sí" className="size-5 text-positive" />
                        ) : (
                          <Minus aria-label="No" className="size-5 text-fg-subtle" />
                        )
                      ) : (
                        <span className="font-semibold">{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="excedentes"
        tone="muted"
        eyebrow="Venta de excedentes"
        title="La energía que no consumes también te paga"
        description="Además de los incentivos tributarios, la regulación te permite entregar a la red la energía que tu planta produce y no usas. El pago depende del tamaño del sistema (Resolución CREG 174 de 2021)."
      >
        <SurplusTable />
      </Section>

      <Section id="preguntas" eyebrow="Preguntas frecuentes" title="Dudas sobre los incentivos de la Ley 1715">
        <FaqList items={faqs} />
        <p className="mt-6 flex items-start gap-2 text-xs text-fg-subtle">
          <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          {taxDisclaimer}
        </p>
      </Section>

      <JsonLd
        data={serviceJsonLd({
          name: "Asesoría en beneficios tributarios para proyectos de energía solar",
          description: "Acompañamiento para acceder a los incentivos de la Ley 1715 de 2014 y la Ley 2099 de 2021 en proyectos solares.",
          path,
        })}
      />
      <CtaBand
        title="Calcula el ahorro y el beneficio tributario de tu proyecto"
        text="El cotizador estima la inversión, el ahorro mensual, el retorno y el valor de la deducción en renta para tu empresa."
        whatsappMessage="Hola Solartech. Quiero saber cómo aplicar los beneficios tributarios de la energía solar."
      />
    </>
  );
}
