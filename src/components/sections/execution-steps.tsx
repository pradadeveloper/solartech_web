import { ClipboardCheck, FileCheck2, PackageCheck, PencilRuler, Wrench } from "lucide-react";
import { executionSteps } from "@/content/sales-deck";

const icons = [PencilRuler, PackageCheck, Wrench, ClipboardCheck, FileCheck2];

/** "Ejecutamos el 100 % del proyecto": diseño, suministro, instalación, RETIE y legalización. */
export function ExecutionSteps() {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-lg font-bold">Ejecutamos el 100 % del proyecto</p>
        <p className="text-sm text-fg-muted">Un solo responsable, de la ingeniería a la conexión.</p>
      </div>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {executionSteps.map((step, i) => {
          const Icon = icons[i];
          return (
            <li key={step.title} className="flex gap-3 lg:flex-col">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-copper-soft text-copper-text">
                <Icon aria-hidden className="size-5" />
              </span>
              <span>
                <span className="block font-semibold">{step.title}</span>
                <span className="mt-1 block text-sm text-fg-muted">{step.text}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
