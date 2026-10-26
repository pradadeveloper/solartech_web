import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import type { Crumb } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Migas sin "Inicio" (se agrega solo). La última es la página actual. */
  crumbs: Crumb[];
  /** Botones bajo la descripción. */
  actions?: React.ReactNode;
  /** Columna derecha opcional (tarjeta de cifras, imagen…). */
  aside?: React.ReactNode;
  className?: string;
};

/** Encabezado de página interior: migas, eyebrow, H1 único y descripción. */
export function PageHeader({ eyebrow, title, description, crumbs, actions, aside, className }: Props) {
  return (
    <section className={cn("relative isolate overflow-hidden border-b border-border", className)}>
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(80%_80%_at_30%_0%,#000_30%,transparent)]" />
      <div aria-hidden className="glow-copper absolute inset-x-0 -top-32 -z-10 h-96 opacity-80" />
      {/* minmax(0,…): en móvil la columna se encoge al ancho de la pantalla aunque el aside traiga tablas anchas. */}
      <Container className={cn("pt-8 pb-14 lg:pb-20", aside && "grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16")}>
        <div>
          <Breadcrumbs items={crumbs} />
          {eyebrow && <Eyebrow className="mt-8">{eyebrow}</Eyebrow>}
          <h1 className={cn("max-w-3xl text-4xl leading-[1.08] font-extrabold sm:text-5xl", eyebrow ? "mt-5" : "mt-8")}>{title}</h1>
          {description && <div className="mt-5 max-w-2xl text-lg text-fg-muted">{description}</div>}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {aside && <div className="lg:pt-10">{aside}</div>}
      </Container>
    </section>
  );
}
