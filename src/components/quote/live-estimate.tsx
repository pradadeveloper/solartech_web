"use client";

import { Lock, MapPin, Receipt, Sun } from "lucide-react";
import type { QuoteResult } from "@/lib/quote-engine";
import { formatCOPCompact, formatNumber } from "@/lib/utils";

/** Panel lateral: muestra el rango de ahorro en vivo y bloquea el detalle hasta el último paso. */
export function LiveEstimate({ result, step }: { result: QuoteResult | null; step: number }) {
  return (
    <aside aria-live="polite" className="lg:sticky lg:top-24 lg:self-start">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-7">
        <div aria-hidden className="glow-copper pointer-events-none absolute inset-x-0 -top-24 h-48" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Estimación en vivo</p>
            {result && (
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-positive">
                <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-positive" />
                Calculando
              </span>
            )}
          </div>

          {!result ? (
            <div className="mt-6 space-y-4 text-sm text-fg-muted">
              <p className="text-base font-semibold text-fg">Así calculamos tu ahorro</p>
              <p className="flex gap-3">
                <MapPin aria-hidden className="size-5 shrink-0 text-copper-text" /> Radiación solar real de tu municipio.
              </p>
              <p className="flex gap-3">
                <Receipt aria-hidden className="size-5 shrink-0 text-copper-text" /> Tu consumo y tarifa de energía.
              </p>
              <p className="flex gap-3">
                <Sun aria-hidden className="size-5 shrink-0 text-copper-text" /> Costos y rendimiento de nuestros proyectos reales.
              </p>
              {step >= 1 && <p className="rounded-xl bg-surface-2 p-3 text-xs">Ingresa tu factura para ver el ahorro estimado.</p>}
            </div>
          ) : (
            <>
              <p className="mt-5 text-sm text-fg-muted">Podrías ahorrar al mes</p>
              <p className="mt-1 font-mono text-3xl font-semibold tracking-tight text-positive tabular sm:text-4xl">
                {formatCOPCompact(result.savings.monthlyCop * 0.9)} – {formatCOPCompact(result.savings.monthlyCop * 1.1)}
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border text-sm">
                <div className="bg-surface-2 p-4">
                  <dt className="text-[11px] text-fg-muted">Sistema</dt>
                  <dd className="mt-1 font-mono text-lg font-semibold tabular">{formatNumber(result.system.kwp)} kWp</dd>
                </div>
                <div className="bg-surface-2 p-4">
                  <dt className="text-[11px] text-fg-muted">Cobertura</dt>
                  <dd className="mt-1 font-mono text-lg font-semibold tabular">{Math.round(result.energy.coverage * 100)} %</dd>
                </div>
              </dl>

              <div className="mt-6">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-fg-muted">
                  <Lock aria-hidden className="size-3.5" />
                  {step < 3 ? "Se desbloquea al final" : "Envía tus datos para ver el detalle"}
                </p>
                <ul aria-hidden className="mt-3 space-y-2 select-none">
                  {["Inversión estimada", "Retorno de la inversión", "Beneficio tributario", "Flujo de caja a 25 años"].map((label) => (
                    <li key={label} className="flex items-center justify-between rounded-xl bg-surface-2 px-4 py-3 text-sm">
                      <span className="text-fg-muted">{label}</span>
                      <span className="h-3 w-20 rounded bg-fg-subtle/30 blur-[2px]" />
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
