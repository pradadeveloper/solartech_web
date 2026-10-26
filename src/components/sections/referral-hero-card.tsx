"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowDownRight } from "lucide-react";
import type { ProjectPreset } from "@/content/referrals";
import { emitReferral } from "@/lib/referral-events";
import { cn, formatCOPCompact, formatNumber } from "@/lib/utils";

const RATES = [0.01, 0.03, 0.05];

/** Tarjeta del encabezado: comisión por tamaño de proyecto con el porcentaje elegido. Tocar
    una fila lleva al simulador con ese tipo de proyecto. */
export function ReferralHeroCard({ presets }: { presets: ProjectPreset[] }) {
  const [rate, setRate] = useState(0.03);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-copper/40 bg-surface shadow-2xl shadow-black/10">
      <div className="relative aspect-[16/7]">
        <Image
          src="/images/proyectos/dron-planta-solar-dji-0587.webp"
          alt="Planta solar sobre la cubierta de un edificio comercial, vista desde dron"
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover motion-safe:animate-[cta-drift_24s_ease-in-out_infinite_alternate]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute inset-x-4 bottom-3 flex flex-wrap items-end justify-between gap-2">
          <p className="text-xs font-semibold text-white">Tu comisión por proyecto, según su tamaño</p>
          <div role="radiogroup" aria-label="Porcentaje de comisión" className="inline-flex rounded-full bg-black/55 p-0.5 text-xs">
            {RATES.map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={rate === r}
                onClick={() => setRate(r)}
                className={cn("rounded-full px-3 py-1 font-mono font-semibold tabular transition-colors", rate === r ? "bg-copper text-white" : "text-white/75 hover:text-white")}
              >
                {r * 100} %
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="divide-y divide-border">
        {presets.map((p) => (
          <li key={p.key}>
            <button
              type="button"
              onClick={() => emitReferral("referral:preset", p.key, "simulador")}
              className="group flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-copper-soft focus-visible:bg-copper-soft"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{p.label}</span>
                <span className="block font-mono text-xs text-fg-subtle tabular">
                  ~{formatNumber(p.kwp, 0)} kWp · proyecto de {formatCOPCompact(p.valueCop)}
                </span>
              </span>
              <span key={`${p.key}-${rate}`} className="font-mono text-lg font-semibold whitespace-nowrap text-positive tabular motion-safe:animate-[value-pop_400ms_ease-out]">
                {formatCOPCompact(p.valueCop * rate)}
              </span>
              <ArrowDownRight aria-hidden className="size-4 shrink-0 text-fg-subtle transition-[transform,color] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-copper-text" />
              <span className="sr-only">Ver en el simulador</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="px-5 pt-1 pb-4 text-[11px] text-fg-subtle">Toca un tipo de proyecto para simular tus ganancias. Valores de referencia del cotizador, IVA incluido.</p>
    </div>
  );
}
