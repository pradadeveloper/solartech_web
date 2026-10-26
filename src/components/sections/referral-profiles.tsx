"use client";

import { useState } from "react";
import { ArrowRight, Check, Lightbulb } from "lucide-react";
import { referralProfiles } from "@/content/referrals";
import { emitReferral } from "@/lib/referral-events";
import { revealStyle, useReveal } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

/** "¿Quién puede ser aliado?": cada perfil se elige, muestra un consejo para encontrar clientes
    y lleva al agendamiento con el perfil ya llenado. Foco de luz que sigue al cursor. */
export function ReferralProfiles() {
  const [selected, setSelected] = useState<number | null>(null);
  const [ref, hidden] = useReveal<HTMLUListElement>();

  const track = (e: React.PointerEvent<HTMLUListElement>) => {
    const li = (e.target as HTMLElement).closest("li");
    if (!li) return;
    const r = li.getBoundingClientRect();
    li.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    li.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  };

  return (
    <div>
      <p className="mb-3 text-sm text-fg-muted">¿Cuál es tu perfil? Tócalo y te damos un consejo para encontrar clientes.</p>
      <ul ref={ref} onPointerMove={track} className="grid gap-3 sm:grid-cols-2">
        {referralProfiles.map((p, i) => {
          const on = selected === i;
          const reveal = revealStyle(hidden, i);
          return (
            <li key={p.title} className={cn("group relative overflow-hidden rounded-2xl border bg-surface transition-colors", on ? "border-copper" : "border-border hover:border-copper/50", reveal.className)} style={reveal.style}>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 0%), var(--glow), transparent 70%)" }}
              />
              <button type="button" onClick={() => setSelected(on ? null : i)} aria-expanded={on} className="relative w-full p-5 text-left">
                <span className="flex items-start justify-between gap-3">
                  <span className="font-bold">{p.title}</span>
                  <span
                    aria-hidden
                    className={cn("grid size-6 shrink-0 place-items-center rounded-full border transition-colors", on ? "border-copper bg-copper text-white" : "border-border-strong text-transparent group-hover:border-copper-text")}
                  >
                    <Check className="size-3.5" />
                  </span>
                </span>
                <span className="mt-1 block text-sm text-fg-muted">{p.text}</span>
              </button>
              {/* Consejo y acceso al agendamiento (se despliega al elegir el perfil). */}
              <div className={cn("relative grid transition-[grid-template-rows] duration-300", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <div className="mx-5 mb-5 rounded-xl bg-copper-soft p-4">
                    <p className="flex gap-2 text-sm">
                      <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-copper-text" />
                      {p.tip}
                    </p>
                    <button
                      type="button"
                      tabIndex={on ? 0 : -1}
                      onClick={() => emitReferral("referral:profile", p.profile, "agendar")}
                      className="mt-3 inline-flex items-center gap-1.5 text-left text-sm font-semibold text-copper-text hover:underline"
                    >
                      Agendar como {p.profile.toLowerCase()}
                      <ArrowRight aria-hidden className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
