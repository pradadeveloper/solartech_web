"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { COMMISSION, type ProjectPreset } from "@/content/referrals";
import { pushEvent } from "@/lib/analytics";
import { cn, formatCOP, formatCOPCompact, formatNumber } from "@/lib/utils";

const MONTHS = 12;
const RATES = [0.01, 0.02, 0.03, 0.04, 0.05];

/** Proyectos que se hacen efectivos hasta el mes `m`, repartiendo `n` al año de forma pareja. */
function closedBy(m: number, n: number) {
  return Math.floor((m * n) / MONTHS);
}

/** Dashboard de ganancias del programa de referidos: tipo de proyecto, cuántos al año y la
    comisión → comisión por proyecto, ganancia anual y su acumulado mes a mes. */
export function ReferralEarnings({ presets }: { presets: ProjectPreset[] }) {
  const [presetKey, setPresetKey] = useState(presets[2]?.key ?? presets[0].key);
  const [perYear, setPerYear] = useState(4);
  const [rate, setRate] = useState(0.03);
  const [touched, setTouched] = useState(false);

  const preset = presets.find((p) => p.key === presetKey) ?? presets[0];
  const perProject = preset.valueCop * rate;
  const yearly = perProject * perYear;

  const touch = () => {
    if (touched) return;
    setTouched(true);
    pushEvent("referral_simulator_used", {});
  };

  const series = useMemo(
    () => Array.from({ length: MONTHS }, (_, i) => ({ month: i + 1, projects: closedBy(i + 1, perYear), total: closedBy(i + 1, perYear) * perProject })),
    [perYear, perProject],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
      {/* Controles */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <fieldset>
          <legend className="text-sm font-semibold">¿Qué tipo de proyectos refieres?</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {presets.map((p) => {
              const on = p.key === presetKey;
              return (
                <label
                  key={p.key}
                  className={cn(
                    "cursor-pointer rounded-2xl border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper/50",
                    on ? "border-copper bg-copper-soft" : "border-border-strong bg-surface-2 hover:border-fg-subtle",
                  )}
                >
                  <input
                    type="radio"
                    name="referral-preset"
                    value={p.key}
                    checked={on}
                    onChange={() => {
                      setPresetKey(p.key);
                      touch();
                    }}
                    className="sr-only"
                  />
                  <span className="block text-sm font-semibold">{p.label}</span>
                  <span className="block text-xs text-fg-muted">{p.detail}</span>
                  <span className="mt-1.5 block font-mono text-xs text-fg-subtle tabular">
                    ~{formatNumber(p.kwp, 0)} kWp · {formatCOPCompact(p.valueCop)}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <Slider
          id="ref-per-year"
          label="Proyectos efectivos al año"
          value={perYear}
          display={`${perYear} ${perYear === 1 ? "proyecto" : "proyectos"}`}
          min={1}
          max={24}
          step={1}
          onChange={(v) => {
            setPerYear(v);
            touch();
          }}
          minLabel="1"
          maxLabel="24"
        />
        <Slider
          id="ref-rate"
          label="Tu comisión"
          value={rate * 100}
          display={`${formatNumber(rate * 100)} %`}
          min={COMMISSION.min * 100}
          max={COMMISSION.max * 100}
          step={0.5}
          onChange={(v) => {
            setRate(v / 100);
            touch();
          }}
          minLabel="1 %"
          maxLabel="5 %"
        />
        <p className="mt-5 text-xs text-fg-subtle">
          El porcentaje depende del tipo y tamaño del proyecto y de tu participación en la venta. Lo definimos contigo en la reunión.
        </p>
      </div>

      {/* Resultado */}
      <div className="flex flex-col rounded-3xl border border-copper/40 bg-surface p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-xs text-fg-muted">Podrías ganar al año</p>
            <p key={`${yearly}`} className="mt-1 font-mono text-4xl font-semibold tracking-tight text-positive tabular motion-safe:animate-[value-pop_400ms_ease-out] sm:text-5xl">
              {formatCOPCompact(yearly)}
            </p>
          </div>
          <div>
            <p className="text-xs text-fg-muted">Por proyecto</p>
            <p className="mt-1 font-mono text-xl font-semibold tabular">{formatCOPCompact(perProject)}</p>
            <p className="text-[11px] text-fg-subtle">{formatNumber(rate * 100)} % de {formatCOPCompact(preset.valueCop)}</p>
          </div>
          <div>
            <p className="text-xs text-fg-muted">Promedio al mes</p>
            <p className="mt-1 font-mono text-xl font-semibold tabular">{formatCOPCompact(yearly / MONTHS)}</p>
          </div>
        </div>

        <CumulativeBars series={series} />

        <div className="mt-6">
          <p className="text-sm font-semibold">Según tu comisión, con {perYear} {perYear === 1 ? "proyecto" : "proyectos"} de {preset.label.toLowerCase()} al año</p>
          <ul className="mt-3 grid grid-cols-5 gap-2">
            {RATES.map((r) => {
              const on = Math.abs(r - rate) < 0.001;
              return (
                <li key={r}>
                  <button
                    type="button"
                    onClick={() => {
                      setRate(r);
                      touch();
                    }}
                    aria-pressed={on}
                    className={cn("w-full rounded-xl border px-1 py-2.5 text-center transition-colors sm:px-2", on ? "border-copper bg-copper-soft" : "border-border bg-surface-2 hover:border-fg-subtle")}
                  >
                    <span className="block font-mono text-xs text-fg-muted tabular">{r * 100} %</span>
                    <span className="mt-0.5 block font-mono text-[11px] font-semibold tabular sm:text-sm">{formatCOPCompact(preset.valueCop * r * perYear)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
          <p className="max-w-sm text-xs text-fg-subtle">Valores de referencia con los precios del cotizador de Solartech, IVA incluido. No constituyen una oferta.</p>
          <a href="#agendar" data-event="referral_simulator_cta" className="inline-flex h-11 items-center gap-2 rounded-full bg-copper px-5 text-sm font-semibold text-white transition-colors hover:bg-copper-hover">
            Agenda tu reunión
            <ArrowRight aria-hidden className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function Slider({
  id,
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  minLabel,
  maxLabel,
}: {
  id: string;
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  minLabel: string;
  maxLabel: string;
}) {
  return (
    <div className="mt-6">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold">{label}</span>
        <output htmlFor={id} className="font-mono text-lg font-semibold tabular">
          {display}
        </output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={display}
        className="mt-2 w-full cursor-pointer accent-[var(--copper)]"
      />
      <div className="flex justify-between font-mono text-[11px] text-fg-subtle">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

/** Ganancia acumulada mes a mes: una sola serie, barras con tooltip y tabla equivalente. */
function CumulativeBars({ series }: { series: { month: number; projects: number; total: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = 200;
  const PAD = { l: 52, r: 8, t: 12, b: 26 };
  const max = Math.max(...series.map((s) => s.total), 1);
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const slot = plotW / series.length;
  const barW = Math.min(28, slot - 6);
  const y = (v: number) => PAD.t + plotH - (v / max) * plotH;
  const ticks = [0, max / 2, max];
  const active = hover !== null ? series[hover] : null;

  return (
    <figure className="relative mt-6">
      <figcaption className="text-sm font-semibold">Ganancia acumulada en 12 meses</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full" role="img" aria-label={`Ganancia acumulada: ${formatCOPCompact(series[series.length - 1].total)} al mes 12`} onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth={1} />
            <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill="var(--fg-subtle)">
              {formatCOPCompact(t)}
            </text>
          </g>
        ))}
        {series.map((s, i) => {
          const x = PAD.l + i * slot + (slot - barW) / 2;
          const h = Math.max(0, y(0) - y(s.total));
          const r = Math.min(4, h / 2, barW / 2);
          // Barra con esquinas superiores redondeadas y base recta sobre el eje.
          const d = h > 0 ? `M${x},${y(0)} V${y(s.total) + r} Q${x},${y(s.total)} ${x + r},${y(s.total)} H${x + barW - r} Q${x + barW},${y(s.total)} ${x + barW},${y(s.total) + r} V${y(0)} Z` : "";
          return (
            <g key={s.month}>
              {d && <path d={d} fill="var(--chart-positive)" opacity={hover === null || hover === i ? 1 : 0.45} className="transition-opacity" />}
              {/* Zona de interacción más grande que la barra. */}
              <rect x={PAD.l + i * slot} y={PAD.t} width={slot} height={plotH} fill="transparent" onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} tabIndex={-1} />
              <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="var(--fg-subtle)">
                {s.month}
              </text>
            </g>
          );
        })}
      </svg>
      {active && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-8 rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-lg"
          style={{ left: `clamp(0px, calc(${((PAD.l + (hover! + 0.5) * slot) / W) * 100}% - 70px), calc(100% - 150px))` }}
        >
          <p className="font-semibold">Mes {active.month}</p>
          <p className="text-fg-muted">
            {active.projects} {active.projects === 1 ? "proyecto efectivo" : "proyectos efectivos"}
          </p>
          <p className="font-mono font-semibold tabular">{formatCOP(active.total)}</p>
        </div>
      )}
      <p className="mt-1 text-center text-[11px] text-fg-subtle">Mes</p>
      <table className="sr-only">
        <caption>Ganancia acumulada por mes</caption>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Proyectos efectivos</th>
            <th>Ganancia acumulada</th>
          </tr>
        </thead>
        <tbody>
          {series.map((s) => (
            <tr key={s.month}>
              <td>{s.month}</td>
              <td>{s.projects}</td>
              <td>{formatCOP(s.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
