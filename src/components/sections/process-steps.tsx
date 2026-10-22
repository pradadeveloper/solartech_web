import { processSteps } from "@/content/services";

/** Proceso de 5 pasos: de la factura al monitoreo. */
export function ProcessSteps() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
      {processSteps.map((step, i) => (
        <li key={step.title} className="relative bg-surface p-6">
          <span className="font-mono text-xs text-copper-text">Paso {String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
          <p className="mt-2 text-sm text-fg-muted">{step.text}</p>
          {i < processSteps.length - 1 && (
            <span aria-hidden className="absolute top-7 right-6 hidden h-px w-10 bg-gradient-to-r from-copper to-transparent lg:block" />
          )}
        </li>
      ))}
    </ol>
  );
}
