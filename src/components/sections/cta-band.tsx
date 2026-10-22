import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { whatsappUrl } from "@/content/site";

type Props = {
  title?: string;
  text?: string;
  whatsappMessage?: string;
};

/** Banda de conversión al final de las páginas. */
export function CtaBand({
  title = "Descubre cuánto puede ahorrar tu empresa",
  text = "Sube tu factura y recibe una pre-cotización con inversión, ahorro y retorno en menos de un minuto.",
  whatsappMessage,
}: Props) {
  return (
    <section className="py-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[32px] border border-copper/40 bg-surface px-6 py-14 sm:px-12 lg:py-20">
          <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-60" />
          <div aria-hidden className="absolute -top-40 -right-40 -z-10 size-[480px] rounded-full bg-copper/30 blur-3xl" />
          <div className="max-w-2xl">
            <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">{title}</h2>
            <p className="mt-4 text-lg text-fg-muted">{text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/cotizador/" size="lg" data-event="cta_cotizar_band">
                Calcular mi ahorro
                <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
              <ButtonLink href={whatsappUrl(whatsappMessage)} external variant="secondary" size="lg" data-event="whatsapp_click">
                Hablar por WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
