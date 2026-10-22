import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/badge";
import { QuoteWizard } from "@/components/quote/quote-wizard";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cotizador de paneles solares: calcula tu ahorro",
  description: "Calcula gratis en 1 minuto el sistema solar que necesitas, tu ahorro mensual, la inversión y el retorno. Pre-cotización con datos reales de Colombia.",
  path: "/cotizador/",
});

export default function CotizadorPage() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(80%_60%_at_50%_0%,#000_30%,transparent)]" />
      <div aria-hidden className="glow-copper absolute inset-x-0 -top-32 -z-10 h-96" />
      <Container className="pt-8 pb-24">
        <Breadcrumbs items={[{ name: "Cotizador", path: "/cotizador/" }]} />
        <div className="mt-8 max-w-3xl">
          <Eyebrow live>Pre-cotización en 60 segundos</Eyebrow>
          <h1 className="mt-5 text-4xl leading-[1.08] font-extrabold sm:text-5xl">Cotizador de paneles solares</h1>
          <p className="mt-4 text-lg text-fg-muted">
            Descubre el tamaño de tu sistema, cuánto ahorrarías cada mes y en cuánto tiempo recuperas la inversión. Con la radiación de tu municipio y los costos de nuestros
            proyectos reales.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-fg-subtle">
            <ShieldCheck aria-hidden className="size-3.5" />
            Tus datos están protegidos por la Ley 1581 de 2012.
          </p>
        </div>
        <div className="mt-10">
          <Suspense fallback={<div className="h-[560px] animate-pulse rounded-3xl bg-surface" />}>
            <QuoteWizard />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
