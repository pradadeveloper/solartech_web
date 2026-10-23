"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { pushEvent } from "@/lib/analytics";
import { formatCOPCompact, formatNumber } from "@/lib/utils";

export type EstimatorRow = { billCop: number; monthlyCop: number; yearlyCop: number; kwp: number };

/** Estimador instantáneo de la banda de conversión. Las cifras llegan calculadas desde el
    servidor (mismo motor del cotizador) para no cargar el motor en cada página. */
export function CtaEstimator({ rows, initial = 3, assumptions }: { rows: EstimatorRow[]; initial?: number; assumptions: string }) {
  const [index, setIndex] = useState(initial);
  const [touched, setTouched] = useState(false);
  const row = rows[index];

  return (
    <div className="rounded-3xl bg-[#14100e]/90 p-6 text-white ring-1 ring-white/10 sm:p-7">
      <p className="text-sm font-semibold text-white/85">Pruébalo ahora: ¿cuánto pagas de energía al mes?</p>
      <label htmlFor="cta-bill" className="mt-4 flex items-baseline justify-between gap-3">
        <span className="text-xs text-white/60">Factura mensual</span>
        <output htmlFor="cta-bill" className="font-mono text-2xl font-semibold tabular">
          {formatCOPCompact(row.billCop)}
        </output>
      </label>
      <input
        id="cta-bill"
        type="range"
        min={0}
        max={rows.length - 1}
        step={1}
        value={index}
        onChange={(e) => {
          setIndex(Number(e.target.value));
          if (!touched) {
            setTouched(true);
            pushEvent("cta_estimator_used", { location: "cta_band" });
          }
        }}
        aria-valuetext={formatCOPCompact(row.billCop)}
        className="mt-3 w-full cursor-pointer accent-[var(--copper)]"
      />
      <div className="mt-1 flex justify-between font-mono text-[11px] text-white/45">
        <span>{formatCOPCompact(rows[0].billCop)}</span>
        <span>{formatCOPCompact(rows[rows.length - 1].billCop)}</span>
      </div>

      <div className="mt-6 rounded-2xl bg-white/[0.06] p-5">
        <p className="text-xs text-white/60">Podrías ahorrar cerca de</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span key={index} className="font-mono text-4xl font-semibold text-[#7bd88f] tabular motion-safe:animate-[value-pop_400ms_ease-out] sm:text-5xl">
            {formatCOPCompact(row.monthlyCop)}
          </span>
          <span className="text-sm text-white/60">al mes</span>
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-white/55">Al año</dt>
            <dd className="mt-0.5 font-mono font-semibold tabular">{formatCOPCompact(row.yearlyCop)}</dd>
          </div>
          <div>
            <dt className="text-xs text-white/55">Sistema estimado</dt>
            <dd className="mt-0.5 font-mono font-semibold tabular">{formatNumber(row.kwp)} kWp</dd>
          </div>
        </dl>
      </div>

      <Link
        href={`/cotizador/?factura=${row.billCop}`}
        data-event="cta_estimator_continue"
        className="group mt-5 flex h-12 items-center justify-center gap-2 rounded-full bg-copper font-semibold text-white shadow-[0_10px_30px_-10px_var(--copper)] transition-[background-color,transform] hover:bg-copper-hover active:scale-[0.98]"
      >
        Ver mi cotización completa
        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
      <p className="mt-3 text-[11px] leading-relaxed text-white/45">{assumptions}</p>
    </div>
  );
}
