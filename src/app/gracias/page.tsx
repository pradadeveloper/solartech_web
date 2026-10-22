import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { whatsappUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Gracias por escribirnos",
  robots: { index: false, follow: false },
};

// Página de confirmación del formulario de contacto (evento de conversión en GTM por URL).
export default function GraciasPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-24">
      <CheckCircle2 aria-hidden className="size-12 text-positive" />
      <h1 className="mt-6 text-4xl font-extrabold sm:text-5xl">¡Recibimos tu mensaje!</h1>
      <p className="mt-4 max-w-xl text-lg text-fg-muted">
        Un asesor de Solartech te contactará en las próximas horas hábiles. Si quieres adelantar, escríbenos por WhatsApp o calcula tu ahorro con el cotizador.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/cotizador/">Calcular mi ahorro</ButtonLink>
        <ButtonLink href={whatsappUrl("Hola Solartech, acabo de enviar el formulario de contacto de la web.")} external variant="secondary" data-event="whatsapp_click">
          Escribir por WhatsApp
        </ButtonLink>
      </div>
    </Container>
  );
}
