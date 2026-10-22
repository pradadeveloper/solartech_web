import { Check, Minus } from "lucide-react";
import { ppaVsPurchase } from "@/content/sales-deck";

/** PPA frente a compra (presentación PPA, diapositiva "Alternativas"). */
export function PpaVsPurchase() {
  const columns = [
    { title: "PPA", subtitle: "Pagas solo la energía", items: ppaVsPurchase.ppa, highlight: true },
    { title: "Compra", subtitle: "La planta es tuya", items: ppaVsPurchase.purchase, highlight: false },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {columns.map((col) => (
        <div key={col.title} className={col.highlight ? "rounded-3xl border border-copper/60 bg-surface p-6 sm:p-8" : "rounded-3xl border border-border bg-surface p-6 sm:p-8"}>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-2xl font-extrabold">{col.title}</h3>
            <span className="text-sm text-fg-muted">{col.subtitle}</span>
          </div>
          <ul className="mt-6 divide-y divide-border">
            {col.items.map((item) => (
              <li key={item} className="flex items-center gap-3 py-3 text-sm">
                {col.highlight ? (
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-positive-soft">
                    <Check aria-hidden className="size-4 text-positive" />
                  </span>
                ) : (
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-2">
                    <Minus aria-hidden className="size-4 text-fg-subtle" />
                  </span>
                )}
                <span className={col.highlight ? "font-medium" : "text-fg-muted"}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
