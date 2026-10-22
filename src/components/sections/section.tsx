import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  /** Se renderiza como H2. */
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Acción alineada a la derecha del título (p. ej. "Ver todos"). */
  action?: React.ReactNode;
  align?: "left" | "center";
  /** Fondo alterno para separar secciones consecutivas. */
  tone?: "default" | "muted";
  className?: string;
  children?: React.ReactNode;
};

export function Section({ id, eyebrow, title, description, action, align = "left", tone = "default", className, children }: SectionProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={cn("py-20 lg:py-28", tone === "muted" && "border-y border-border bg-surface/60", className)}>
      <Container>
        {(title || eyebrow) && (
          <div className={cn("mb-12 flex flex-col gap-6", align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between")}>
            <div className={cn(align === "center" && "flex flex-col items-center")}>
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              {title && (
                <h2 id={headingId} className="mt-4 max-w-3xl text-3xl leading-tight font-extrabold sm:text-4xl">
                  {title}
                </h2>
              )}
              {description && <div className="mt-4 max-w-2xl text-fg-muted sm:text-lg">{description}</div>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

/** Tarjeta base del sistema (superficie con borde sutil). */
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-3xl border border-border bg-surface p-6 sm:p-8", className)} {...props} />;
}
