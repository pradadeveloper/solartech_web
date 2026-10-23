import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { CtaEstimator, type EstimatorRow } from "@/components/sections/cta-estimator";
import { whatsappUrl } from "@/content/site";
import { computeQuote, referenceTariff } from "@/lib/quote-engine";
import { formatCOP } from "@/lib/utils";

type Props = {
  title?: string;
  text?: string;
  whatsappMessage?: string;
};

// Supuestos del estimador rápido: empresa en Medellín con la tarifa de referencia de Antioquia.
// El cotizador completo ajusta ciudad, tarifa, techo y modelo.
const DEP = "Antioquia";
const MUN = "Medellín";
const BILL_STOPS = [1, 2, 3, 5, 8, 12, 18, 25, 35, 50].map((m) => m * 1_000_000);

function estimatorRows(): EstimatorRow[] {
  const tariff = referenceTariff(DEP);
  return BILL_STOPS.map((billCop) => {
    const q = computeQuote({ clientType: "empresa", departamento: DEP, municipio: MUN, billCop, tariffCopKwh: tariff, batteries: false, modelInterest: "no_se" });
    return { billCop, monthlyCop: q.savings.monthlyCop, yearlyCop: q.savings.yearlyCop, kwp: q.system.kwp };
  });
}

/** Banda de conversión al final de las páginas: foto de una planta real y un estimador
    instantáneo que lleva al cotizador con la factura ya cargada. */
export function CtaBand({
  title = "Descubre cuánto puede ahorrar tu empresa",
  text = "Mueve el control y mira tu ahorro estimado al instante. Con tu factura real, el cotizador te da inversión, ahorro y retorno en menos de un minuto.",
  whatsappMessage,
}: Props) {
  const assumptions = `Estimado para una empresa en ${MUN} con tarifa de ${formatCOP(referenceTariff(DEP))}/kWh. El cotizador ajusta tu ciudad, tarifa y techo.`;

  return (
    <section className="py-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[32px] bg-[#0f0c0a] px-6 py-12 text-white ring-1 ring-copper/40 sm:px-12 lg:py-16">
          {/* Foto de una planta real con velo oscuro (más denso donde va el texto). */}
          <Image src="/images/proyectos/dron-planta-solar-dji-0528.webp" alt="" fill sizes="(min-width: 1280px) 1200px, 100vw" className="-z-20 object-cover opacity-60 motion-safe:animate-[cta-drift_24s_ease-in-out_infinite_alternate]" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/70 to-black/35" />
          <div aria-hidden className="absolute -right-32 -bottom-40 -z-10 size-[520px] rounded-full bg-copper/35 blur-3xl motion-safe:animate-[pulse-dot_6s_ease-in-out_infinite]" />

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <h2 className="text-3xl leading-tight font-extrabold text-white sm:text-4xl lg:text-5xl">{title}</h2>
              <p className="mt-4 max-w-xl text-lg text-white/75">{text}</p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
                {["Gratis y sin compromiso", "Resultado en 60 segundos", "Asesor experto incluido"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5">
                    <Check aria-hidden className="size-4 text-[#7bd88f]" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/cotizador/" size="lg" data-event="cta_cotizar_band">
                  Calcular mi ahorro
                  <ArrowRight aria-hidden className="size-4" />
                </ButtonLink>
                <ButtonLink
                  href={whatsappUrl(whatsappMessage)}
                  external
                  variant="secondary"
                  size="lg"
                  data-event="whatsapp_click"
                  className="border-white/30 bg-white/10 text-white hover:border-white hover:text-white"
                >
                  Hablar por WhatsApp
                </ButtonLink>
              </div>
            </div>

            <CtaEstimator rows={estimatorRows()} assumptions={assumptions} />
          </div>
        </div>
      </Container>
    </section>
  );
}
