"use client";

import { Leaf, TrendingUp, TriangleAlert, Wallet, Wrench } from "lucide-react";
import { whySolar } from "@/content/sales-deck";
import { revealStyle, useReveal } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

// Mismo orden que whySolar: costos, racionamiento, rentabilidad, mantenimiento, sostenibilidad.
const icons = [Wallet, TriangleAlert, TrendingUp, Wrench, Leaf];

/** ¿Por qué energía solar? Las 5 razones de la presentación comercial. Un foco de luz sigue
    al cursor dentro de cada tarjeta (variables CSS, sin re-renderizar) y entran escalonadas. */
export function Pillars() {
  const [ref, hidden] = useReveal<HTMLUListElement>();

  const track = (e: React.PointerEvent<HTMLUListElement>) => {
    const li = (e.target as HTMLElement).closest("li");
    if (!li) return;
    const r = li.getBoundingClientRect();
    li.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    li.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  };

  return (
    <ul ref={ref} onPointerMove={track} className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
      {whySolar.map((p, i) => {
        const Icon = icons[i];
        const reveal = revealStyle(hidden, i);
        return (
          <li key={p.title} className="group relative overflow-hidden bg-surface sm:last:col-span-2 lg:last:col-span-1">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: "radial-gradient(260px circle at var(--spot-x, 50%) var(--spot-y, 0%), var(--glow), transparent 70%)" }}
            />
            <div className={cn("relative p-6", reveal.className)} style={reveal.style}>
              <span className="grid size-10 place-items-center rounded-xl bg-copper-soft text-copper-text transition-[background-color,color,transform] duration-300 group-hover:-translate-y-1 group-hover:rotate-[-6deg] group-hover:bg-copper group-hover:text-white">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-fg-muted transition-colors duration-300 group-hover:text-fg">{p.text}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
