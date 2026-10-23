"use client";

import { useState } from "react";
import { CORPORATE_TAX_RATE, deductionExample, taxDisclaimer } from "@/content/tax-benefits";
import { cn, formatCOPCompact } from "@/lib/utils";

// Tamaños de proyecto típicos (COP): el control avanza por estos valores, no linealmente.
const STOPS = [50, 100, 200, 300, 500, 750, 1_000, 1_500, 2_000, 3_000].map((m) => m * 1_000_000);

/** Ejemplo de la deducción en renta con la inversión elegida por el visitante. */
export function DeductionSimulator({ initial = 500_000_000, className }: { initial?: number; className?: string }) {
  const start = STOPS.reduce((best, v, i) => (Math.abs(v - initial) < Math.abs(STOPS[best] - initial) ? i : best), 0);
  const [index, setIndex] = useState(start);
  const ex = deductionExample(STOPS[index]);
  const share = Math.round(ex.effectiveShare * 1000) / 10;

  return (
    <div className={cn("flex flex-col rounded-3xl border border-copper/40 bg-surface p-6 sm:p-8", className)}>
      <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Simulador</p>
      <p className="mt-3 text-lg font-bold">¿Cuánto vale la deducción en renta?</p>

      <label htmlFor="deduction-investment" className="mt-6 flex items-baseline justify-between gap-4">
        <span className="text-sm text-fg-muted">Inversión del proyecto</span>
        <output htmlFor="deduction-investment" className="font-mono text-2xl font-semibold tabular">
          {formatCOPCompact(ex.investmentCop)}
        </output>
      </label>
      <input
        id="deduction-investment"
        type="range"
        min={0}
        max={STOPS.length - 1}
        step={1}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        aria-valuetext={formatCOPCompact(ex.investmentCop)}
        className="mt-3 w-full cursor-pointer accent-[var(--copper)]"
      />
      <div className="mt-1 flex justify-between font-mono text-[11px] text-fg-subtle">
        <span>{formatCOPCompact(STOPS[0])}</span>
        <span>{formatCOPCompact(STOPS[STOPS.length - 1])}</span>
      </div>

      <dl className="mt-5 divide-y divide-border">
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-sm text-fg-muted">Deducción en renta (50 %)</dt>
          <dd className="font-mono text-lg font-semibold tabular">{formatCOPCompact(ex.deduction)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 py-3">
          <dt className="text-sm text-fg-muted">Menor impuesto (tarifa {CORPORATE_TAX_RATE * 100} %)</dt>
          <dd key={index} className="font-mono text-lg font-semibold text-positive tabular motion-safe:animate-[value-pop_400ms_ease-out]">
            {formatCOPCompact(ex.taxSaving)}
          </dd>
        </div>
      </dl>

      {/* De la inversión total: lo que se deduce de la renta y lo que vuelve como menor impuesto. */}
      <div className="mt-4 space-y-2" aria-hidden>
        {[
          { label: "Se deduce de la renta", width: 50, tone: "bg-copper" },
          { label: "Vuelve como menor impuesto", width: share, tone: "bg-positive" },
        ].map((bar) => (
          <div key={bar.label}>
            <div className="flex justify-between text-[11px] text-fg-subtle">
              <span>{bar.label}</span>
              <span className="font-mono tabular">{bar.width.toLocaleString("es-CO")} %</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-3">
              <span className={cn("block h-full rounded-full", bar.tone)} style={{ width: `${bar.width}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-positive-soft p-4">
        <p className="text-sm">
          Recuperas hasta <strong className="font-mono text-positive tabular">{formatCOPCompact(ex.taxSaving)}</strong> ({share.toLocaleString("es-CO")} % de la inversión) solo en
          impuestos, además del ahorro en tu factura.
        </p>
      </div>
      <p className="mt-auto pt-6 text-xs text-fg-subtle">{taxDisclaimer}</p>
    </div>
  );
}
