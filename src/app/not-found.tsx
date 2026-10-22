import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="font-mono text-sm text-copper-text">Error 404</p>
      <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Esta página no existe</h1>
      <p className="mt-4 max-w-lg text-fg-muted">Puede que la dirección haya cambiado con el nuevo sitio. Estos enlaces te pueden servir:</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Ir al inicio</ButtonLink>
        <ButtonLink href="/cotizador/" variant="secondary">
          Calcular mi ahorro
        </ButtonLink>
      </div>
    </Container>
  );
}
