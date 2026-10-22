import { Leaf, TrendingUp, TriangleAlert, Wallet, Wrench } from "lucide-react";
import { whySolar } from "@/content/sales-deck";

// Mismo orden que whySolar: costos, racionamiento, rentabilidad, mantenimiento, sostenibilidad.
const icons = [Wallet, TriangleAlert, TrendingUp, Wrench, Leaf];

/** ¿Por qué energía solar? Las 5 razones de la presentación comercial. */
export function Pillars() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
      {whySolar.map((p, i) => {
        const Icon = icons[i];
        return (
          <li key={p.title} className="bg-surface p-6 sm:last:col-span-2 lg:last:col-span-1">
            <span className="grid size-10 place-items-center rounded-xl bg-copper-soft text-copper-text">
              <Icon aria-hidden className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
            <p className="mt-2 text-sm text-fg-muted">{p.text}</p>
          </li>
        );
      })}
    </ul>
  );
}
