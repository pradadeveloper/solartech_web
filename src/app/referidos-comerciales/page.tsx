import { ArrowDown, CalendarCheck, Handshake, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/sections/section";
import { FaqList } from "@/components/sections/faq-list";
import { ReferralEarnings } from "@/components/sections/referral-earnings";
import { ReferralBooking } from "@/components/sections/referral-booking";
import { ReferralHeroCard } from "@/components/sections/referral-hero-card";
import { ReferralProfiles } from "@/components/sections/referral-profiles";
import { ReferralStickyCta } from "@/components/sections/referral-sticky-cta";
import { ProcessSteps } from "@/components/sections/process-steps";
import { ButtonLink } from "@/components/ui/button";
import { referralBenefits, referralFaqs, referralSteps } from "@/content/referrals";
import { projectPresets } from "@/content/referral-presets";
import { portfolioStats } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";
import { formatNumber } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Referidos Comerciales: gana con proyectos solares",
  description: "Programa para asesores, brókers y aliados: refiere proyectos de energía solar a Solartech y gana entre el 1 % y el 5 % de cada proyecto efectivo.",
  path: "/referidos-comerciales/",
});

const benefitIcons = [ShieldCheck, TrendingUp, Users, Handshake];

export default function ReferidosComercialesPage() {
  const stats = portfolioStats();

  return (
    <>
      <PageHeader
        eyebrow="Programa de Referidos Comerciales"
        title={<>Gana entre 1 % y 5 % por cada proyecto solar que refieras</>}
        description="Para asesores, brókers y aliados que conocen empresas, comercios y hogares que pagan mucho de energía. Tú nos presentas al cliente; Solartech diseña, vende y construye el proyecto."
        crumbs={[{ name: "Referidos Comerciales", path: "/referidos-comerciales/" }]}
        actions={
          <>
            <ButtonLink href="#agendar" size="lg" data-event="referral_hero_agendar">
              <CalendarCheck aria-hidden className="size-4" />
              Agenda una reunión
            </ButtonLink>
            <ButtonLink href="#simulador" variant="secondary" size="lg">
              Calcula tus ganancias
              <ArrowDown aria-hidden className="size-4" />
            </ButtonLink>
          </>
        }
        aside={<ReferralHeroCard presets={projectPresets} />}
      />

      <Section id="como-funciona" eyebrow="Cómo funciona" title="Tú refieres, nosotros hacemos el proyecto">
        <ProcessSteps steps={referralSteps} />
      </Section>

      <Section
        id="simulador"
        tone="muted"
        eyebrow="Simulador de ganancias"
        title="¿Cuánto podrías ganar como aliado?"
        description="Elige el tipo de proyectos que conoces, cuántos podrían hacerse efectivos al año y tu comisión. El cálculo usa los precios reales de nuestro cotizador."
      >
        <ReferralEarnings presets={projectPresets} />
      </Section>

      <Section id="aliados" eyebrow="Aliados" title="¿Quién puede ser aliado de Solartech?">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <ReferralProfiles />
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
            <h3 className="text-lg font-bold">Por qué vender con Solartech</h3>
            <dl className="mt-5 grid grid-cols-3 gap-3">
              <div>
                <dt className="text-[11px] text-fg-muted">Potencia instalada</dt>
                <dd className="mt-1 font-mono text-lg font-semibold tabular">{formatNumber(stats.kwp, 0)} kWp</dd>
              </div>
              <div>
                <dt className="text-[11px] text-fg-muted">Proyectos</dt>
                <dd className="mt-1 font-mono text-lg font-semibold tabular">{stats.projects}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-fg-muted">Retorno</dt>
                <dd className="mt-1 font-mono text-lg font-semibold tabular">
                  {formatNumber(stats.paybackMin)}–{formatNumber(stats.paybackMax, 0)} años
                </dd>
              </div>
            </dl>
            <ul className="mt-6 space-y-4">
              {referralBenefits.map((b, i) => {
                const Icon = benefitIcons[i];
                return (
                  <li key={b.title} className="flex gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-copper-soft text-copper-text">
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{b.title}</span>
                      <span className="block text-sm text-fg-muted">{b.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="agendar"
        tone="muted"
        eyebrow="Agenda"
        title="Agenda una reunión y conoce la modalidad"
        description="En 30 minutos te explicamos cómo funciona el programa, los porcentajes por tipo de proyecto y cómo registrar tus referidos. Sin costo ni compromiso."
      >
        <ReferralBooking />
      </Section>

      <Section eyebrow="Preguntas" title="Lo que preguntan los aliados">
        <FaqList items={referralFaqs} />
      </Section>

      <ReferralStickyCta />
    </>
  );
}
