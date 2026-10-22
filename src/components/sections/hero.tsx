import { ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/badge";
import { QuoteStarter } from "@/components/quote/quote-starter";
import { HeroVideo } from "@/components/sections/hero-video";
import { portfolioStats } from "@/content/projects";
import { formatNumber } from "@/lib/utils";

export function Hero() {
  const stats = portfolioStats();
  return (
    <section className="relative isolate overflow-hidden">
      <HeroVideo />
      {/* Velo con el color de fondo del tema: más denso a la izquierda (texto) y al pie (transición a la siguiente sección). */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, transparent 55%, var(--bg) 100%), linear-gradient(90deg, color-mix(in srgb, var(--bg) 92%, transparent) 0%, color-mix(in srgb, var(--bg) 80%, transparent) 45%, color-mix(in srgb, var(--bg) 55%, transparent) 100%)",
        }}
      />
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(80%_70%_at_50%_0%,#000_40%,transparent)]" />
      <div aria-hidden className="glow-copper absolute inset-x-0 -top-24 -z-10 h-[520px]" />

      <Container className="grid items-center gap-12 pt-12 pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20 lg:pb-28">
        <div>
          <Eyebrow live>Energía solar como inversión</Eyebrow>
          <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl">
            Paneles solares para empresas en Colombia que <span className="text-gradient-copper">se pagan solos</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-fg-muted">
            Convierte tu factura de energía en un activo rentable. Diseñamos, financiamos y operamos tu planta solar: compra el sistema llave en mano (EPC) o paga
            solo la energía, sin invertir (PPA).
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/cotizador/" size="lg" data-event="cta_cotizar_hero">
              Calcula tu ahorro en 1 minuto
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
            <ButtonLink href="/proyectos/" variant="secondary" size="lg">
              Ver proyectos
            </ButtonLink>
          </div>

          <ul className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-border pt-6 sm:gap-6 [&_p:first-child]:whitespace-nowrap">
            <li>
              <p className="font-mono text-xl font-semibold tabular sm:text-3xl">
                {formatNumber(stats.paybackMin)}–{formatNumber(stats.paybackMax)}
                <span className="ml-1 text-xs text-fg-muted sm:text-base">años</span>
              </p>
              <p className="mt-1 text-xs text-fg-muted">Retorno de la inversión</p>
            </li>
            <li>
              <p className="font-mono text-xl font-semibold tabular sm:text-3xl">50%</p>
              <p className="mt-1 text-xs text-fg-muted">De la inversión deducible de renta*</p>
            </li>
            <li>
              <p className="font-mono text-xl font-semibold tabular sm:text-3xl">25+</p>
              <p className="mt-1 text-xs text-fg-muted">Años de vida útil</p>
            </li>
          </ul>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-fg-subtle">
            <ShieldCheck aria-hidden className="size-3.5" />
            *Ley 1715 de 2014 y Ley 2099 de 2021, para declarantes de renta.
          </p>
        </div>

        <QuoteStarter />
      </Container>
    </section>
  );
}
