import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/sections/section";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FaqList } from "@/components/sections/faq-list";
import { CtaBand } from "@/components/sections/cta-band";
import { SavingsCalculator } from "@/components/quote/savings-calculator";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Calculadora de ahorro con paneles solares",
  description: "Escribe el valor de tu factura de energía y mira al instante cuánto ahorrarías con paneles solares en tu ciudad. Gratis y sin dejar tus datos.",
  path: "/calculadora-ahorro/",
});

const faqs = [
  {
    q: "¿Cómo calcula la calculadora mi ahorro?",
    a: "Con el valor de tu factura y una tarifa de referencia de tu departamento estima tu consumo en kWh. Con la radiación solar de tu municipio dimensiona el sistema y calcula cuánta energía produciría y cuánto descontaría de tu factura.",
  },
  {
    q: "¿Por qué no muestra la inversión?",
    a: "La inversión y el retorno dependen del tamaño exacto del sistema y del tipo de cubierta. Los ves en el cotizador completo, que usa los mismos cálculos y te entrega una pre-cotización en pantalla.",
  },
  {
    q: "¿Qué tan exacto es el resultado?",
    a: "Es una estimación referencial, con un rango de ±10 %. La propuesta final requiere la visita técnica y el análisis de tu factura real.",
  },
];

export default function CalculadoraPage() {
  return (
    <>
      <PageHeader
        eyebrow="Calculadora"
        title="¿Cuánto ahorrarías con paneles solares?"
        description="Escribe lo que pagas de energía al mes y mira tu ahorro estimado al instante, con la radiación solar de tu municipio. Sin formularios."
        crumbs={[{ name: "Calculadora de ahorro", path: "/calculadora-ahorro/" }]}
      />
      <Section className="pt-12 lg:pt-14">
        <SavingsCalculator />
      </Section>
      <Section
        id="como-funciona"
        tone="muted"
        eyebrow="Cómo funciona"
        title="¿De dónde sale el ahorro?"
        description="La energía que generas se consume primero en tu instalación; lo que sobra se entrega a la red y te la reconocen en la factura."
      >
        <HowItWorks />
      </Section>
      <Section eyebrow="Preguntas" title="Sobre la calculadora">
        <FaqList items={faqs} />
      </Section>
      <CtaBand />
    </>
  );
}
