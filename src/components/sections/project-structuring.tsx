import { ArrowRight, Check, Gauge } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { projectStructuring } from "@/content/sales-deck";

/** ¿Cómo estructurar un proyecto solar? Necesidad y restricciones (presentación industria). */
export function ProjectStructuring() {
  const { need, constraints } = projectStructuring;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
      <div className="flex flex-col rounded-3xl border border-copper/40 bg-surface p-6 sm:p-8">
        <span className="grid size-11 place-items-center rounded-2xl bg-copper-soft text-copper-text">
          <Gauge aria-hidden className="size-5" />
        </span>
        <h3 className="mt-5 text-xl font-bold">{need.title}</h3>
        {need.items.map((item) => (
          <p key={item} className="mt-2 text-fg-muted">
            {item}
          </p>
        ))}
        <div className="mt-auto pt-6">
          <ButtonLink href="/cotizador/" data-event="cta_cotizar_estructurar">
            Sube tu factura
            <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <h3 className="text-xl font-bold">{constraints.title}</h3>
        <p className="mt-2 text-sm text-fg-muted">Lo que define cuánto sistema cabe y cómo se paga. Lo revisamos en la visita técnica.</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {constraints.items.map((item) => (
            <li key={item} className="flex items-center gap-3 rounded-2xl bg-surface-2 px-4 py-3 text-sm">
              <Check aria-hidden className="size-4 shrink-0 text-positive" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
