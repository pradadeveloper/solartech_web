import Image from "next/image";
import { ArrowDown, CalendarCheck, Handshake, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/sections/section";
import { FaqList } from "@/components/sections/faq-list";
import { ReferralEarnings } from "@/components/sections/referral-earnings";
import { ReferralBooking } from "@/components/sections/referral-booking";
import { RevealList } from "@/components/ui/reveal-list";
import { ButtonLink } from "@/components/ui/button";
import { COMMISSION, referralBenefits, referralFaqs, referralProfiles, referralSteps } from "@/content/referrals";
import { projectPresets } from "@/content/referral-presets";
import { portfolioStats } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";
import { formatCOPCompact, formatNumber } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Referidos Comerciales: gana con proyectos solares",
  description: "Programa para asesores, brókers y aliados: refiere proyectos de energía solar a Solartech y gana entre el 1 % y el 5 % de cada proyecto efectivo.",
  path: "/referidos-comerciales/",
});

const benefitIcons = [ShieldCheck, TrendingUp, Users, Handshake];

export default function ReferidosComercialesPage() {
  const stats = portfolioStats();
  const pct = (r: number) => `${formatNumber(r * 100, 0)} %`;

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
        aside={
          <div className="relative overflow-hidden rounded-3xl border border-copper/40 bg-surface shadow-2xl shadow-black/10">
            <div className="relative aspect-[16/7]">
              <Image src="/images/proyectos/dron-planta-solar-dji-0587.webp" alt="Planta solar sobre la cubierta de un edificio comercial, vista desde dron" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <p className="absolute bottom-3 left-4 text-xs font-semibold text-white">Comisión por proyecto, según su tamaño</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-fg-muted">
                  <th className="px-5 pt-4 pb-2 font-medium">Proyecto típico</th>
                  <th className="hidden px-5 pt-4 pb-2 text-right font-medium sm:table-cell">Valor</th>
                  <th className="px-5 pt-4 pb-2 text-right font-medium">
                    Tu comisión ({pct(COMMISSION.min)}–{pct(COMMISSION.max)})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projectPresets.map((p) => (
                  <tr key={p.key}>
                    <td className="px-5 py-2.5">
                      <span className="font-semibold">{p.label}</span>
                      <span className="ml-1.5 font-mono text-xs text-fg-subtle tabular">~{formatNumber(p.kwp, 0)} kWp</span>
                    </td>
                    <td className="hidden px-5 py-2.5 text-right font-mono tabular sm:table-cell">{formatCOPCompact(p.valueCop)}</td>
                    <td className="px-5 py-2.5 text-right font-mono font-semibold whitespace-nowrap text-positive tabular">
                      {formatCOPCompact(p.valueCop * COMMISSION.min)} – {formatCOPCompact(p.valueCop * COMMISSION.max)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-5 pt-2 pb-4 text-[11px] text-fg-subtle">Valores de referencia con los precios del cotizador de Solartech, IVA incluido.</p>
          </div>
        }
      />

      <Section id="como-funciona" eyebrow="Cómo funciona" title="Tú refieres, nosotros hacemos el proyecto">
        <RevealList
          as="ol"
          className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
          itemClassName="bg-surface p-6"
          keys={referralSteps.map((s) => s.title)}
          items={referralSteps.map((s, i) => (
            <>
              <span className="grid size-9 place-items-center rounded-full bg-copper font-mono text-sm font-semibold text-white">{i + 1}</span>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{s.text}</p>
            </>
          ))}
        />
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
          <RevealList
            className="grid gap-3 sm:grid-cols-2"
            itemClassName="rounded-2xl border border-border bg-surface p-5"
            keys={referralProfiles.map((p) => p.title)}
            items={referralProfiles.map((p) => (
              <>
                <h3 className="font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-fg-muted">{p.text}</p>
              </>
            ))}
          />
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
    </>
  );
}
