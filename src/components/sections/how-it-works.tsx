"use client";

import { useEffect, useState } from "react";
import { ArrowRightLeft, Building2, Moon, SolarPanel, Sun, UtilityPole, Zap, type LucideIcon } from "lucide-react";
import { generationExample } from "@/content/sales-deck";
import { useInView, usePrefersReducedMotion } from "@/lib/use-in-view";
import { cn, formatCOP, formatNumber } from "@/lib/utils";

type Mode = "dia" | "noche";

const flow: { icon: LucideIcon; title: string; dia: string; noche: string }[] = [
  { icon: SolarPanel, title: "Paneles solares", dia: "Convierten la luz del sol en corriente continua (DC).", noche: "En reposo: sin sol no generan." },
  { icon: Zap, title: "Inversor", dia: "Transforma la energía DC en corriente alterna (AC) para tu instalación.", noche: "En espera hasta el amanecer." },
  { icon: Building2, title: "Tu consumo", dia: "La energía va primero a tus equipos: lo que consumes deja de comprarse a la red.", noche: "Sigues operando normal: la energía llega de la red." },
  { icon: ArrowRightLeft, title: "Medidor bidireccional", dia: "Registra los excedentes que le entregas a la red.", noche: "Registra lo que tomas de la red para cruzarlo con tus excedentes." },
  { icon: UtilityPole, title: "Operador de red", dia: "Recibe los excedentes y te los reconoce en tu factura (CREG 174).", noche: "Te entrega energía como siempre; tus excedentes del día la compensan." },
];

// Pasos que participan y orden en que viaja la energía en cada momento del día.
const route: Record<Mode, number[]> = { dia: [0, 1, 2, 3, 4], noche: [4, 3, 2] };
const STEP_MS = 1600;

/** ¿Cómo funciona un sistema solar? Diagrama vivo (de día / de noche) + "de cada 10 kWh". */
export function HowItWorks() {
  const ex = generationExample;
  const selfKwh = ex.generationKwhMonth * ex.selfConsumptionShare;
  const surplusKwh = ex.generationKwhMonth * ex.surplusShare;
  const selfCop = selfKwh * ex.tariffCopKwh;
  const surplusCop = surplusKwh * ex.surplusCopKwh;

  return (
    <div className="space-y-6">
      <EnergyFlow />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <TenKwh />

        <div className="flex flex-col rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Ejemplo ilustrativo</p>
          <h3 className="mt-3 text-lg font-bold">Así se traduce en tu factura</h3>
          <dl className="mt-5 divide-y divide-border text-sm">
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-fg-muted">Generación del mes</dt>
              <dd className="font-mono font-semibold tabular">{formatNumber(ex.generationKwhMonth, 0)} kWh</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="flex items-baseline gap-2 text-fg-muted">
                <span aria-hidden className="size-2.5 shrink-0 rounded-sm bg-positive" />
                Lo que usas · {formatNumber(selfKwh, 0)} kWh × {formatCOP(ex.tariffCopKwh)}
              </dt>
              <dd className="font-mono font-semibold tabular">{formatCOP(selfCop)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="flex items-baseline gap-2 text-fg-muted">
                <span aria-hidden className="size-2.5 shrink-0 rounded-sm bg-copper" />
                Excedentes · {formatNumber(surplusKwh, 0)} kWh × {formatCOP(ex.surplusCopKwh)}
              </dt>
              <dd className="font-mono font-semibold tabular">{formatCOP(surplusCop)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="font-semibold">Ahorro del mes</dt>
              <dd className="font-mono text-xl font-semibold text-positive tabular">{formatCOP(selfCop + surplusCop)}</dd>
            </div>
          </dl>
          <p className="mt-auto pt-4 text-xs text-fg-subtle">
            Valores de referencia. La tarifa y el precio de los excedentes dependen de tu operador de red y del tamaño del sistema. Cada kWp produce de {ex.kwhPerKwpDay} kWh al día
            según la región.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Los 5 componentes unidos por una línea por la que corre la energía; un resaltado recorre
    los pasos en el orden del flujo. El interruptor muestra qué pasa de noche. */
function EnergyFlow() {
  const [mode, setMode] = useState<Mode>("dia");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const steps = route[mode];
  const running = inView && hovered === null && !reduced;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setCursor((c) => (c + 1) % steps.length), STEP_MS);
    return () => clearTimeout(id);
  }, [running, cursor, steps.length]);

  const highlighted = hovered ?? (reduced ? null : steps[cursor % steps.length]);
  const choose = (m: Mode) => {
    setMode(m);
    setCursor(0);
  };

  return (
    <div ref={ref} className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">{mode === "dia" ? "De día: tu planta te da la energía" : "De noche: la red te respalda"}</h3>
          <p className="mt-1 text-sm text-fg-muted">
            {mode === "dia"
              ? "La energía del sol va primero a tus equipos y lo que sobra se entrega a la red."
              : "Los paneles descansan y tu instalación sigue funcionando con energía de la red, como siempre."}
          </p>
        </div>
        <div role="radiogroup" aria-label="Momento del día" className="inline-flex rounded-full border border-border-strong bg-surface-2 p-1 text-sm">
          {(
            [
              { m: "dia", label: "De día", icon: Sun },
              { m: "noche", label: "De noche", icon: Moon },
            ] as const
          ).map(({ m, label, icon: Icon }) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => choose(m)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-semibold transition-colors",
                mode === m ? "bg-copper text-white" : "text-fg-muted hover:text-fg",
              )}
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <ol className="mt-8 grid gap-6 md:grid-cols-5 md:gap-3" onMouseLeave={() => setHovered(null)}>
        {flow.map((step, i) => {
          const involved = steps.includes(i);
          const isOn = highlighted === i;
          // Tramo hacia el siguiente paso: lleva energía si ambos extremos participan.
          const linkLive = i < flow.length - 1 && steps.includes(i) && steps.includes(i + 1);
          const reverse = mode === "noche";
          return (
            <li key={step.title} className="relative flex gap-4 md:flex-col md:items-center md:gap-3 md:text-center" onMouseEnter={() => setHovered(i)}>
              {i < flow.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute rounded-full",
                    // Móvil: tramo vertical bajo el ícono. Escritorio: tramo horizontal al siguiente ícono.
                    "top-14 bottom-[-1.5rem] left-[27px] w-0.5 md:top-[27px] md:bottom-auto md:left-[calc(50%_+_34px)] md:h-0.5 md:w-[calc(100%_-_56px)]",
                    linkLive
                      ? cn(
                          "bg-[length:2px_16px] bg-[repeating-linear-gradient(180deg,var(--copper)_0_8px,transparent_8px_16px)] motion-safe:animate-[energy-y_0.6s_linear_infinite] md:bg-[length:16px_2px] md:bg-[repeating-linear-gradient(90deg,var(--copper)_0_8px,transparent_8px_16px)] md:motion-safe:animate-[energy-x_0.6s_linear_infinite]",
                          reverse && "[animation-direction:reverse]",
                        )
                      : "bg-border",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative grid size-14 shrink-0 place-items-center rounded-2xl border transition-[background-color,border-color,color,transform] duration-300",
                  !involved && "border-border bg-surface-2 text-fg-subtle",
                  involved && !isOn && "border-copper/30 bg-copper-soft text-copper-text",
                  isOn && "scale-110 border-copper bg-copper text-white",
                )}
              >
                <step.icon aria-hidden className="size-6" />
              </span>
              <span className={cn("transition-opacity duration-300", !involved && "opacity-55")}>
                <span className="block font-bold">{step.title}</span>
                <span className="mt-1 block text-sm text-fg-muted">{step[mode]}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** "De cada 10 kWh que genera tu planta": 10 fichas que se llenan al entrar en pantalla. */
function TenKwh() {
  const ex = generationExample;
  const own = Math.round(ex.selfConsumptionShare * 10);
  const [ref, inView] = useInView<HTMLDivElement>({ once: true, threshold: 0.4 });

  return (
    <div ref={ref} className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
      <h3 className="text-lg font-bold">¿A dónde va la energía que generas?</h3>
      <p className="mt-1 text-sm text-fg-muted">De cada 10 kWh que produce tu planta en un día típico:</p>

      <div role="img" className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-10" aria-label={`${own} de cada 10 kWh los usas tú; ${10 - own} van a la red`}>
        {Array.from({ length: 10 }, (_, i) => {
          const mine = i < own;
          return (
            <span
              key={i}
              style={{ transitionDelay: `${i * 90}ms` }}
              className={cn(
                "grid aspect-square place-items-center rounded-xl transition-[opacity,transform] duration-500 ease-out",
                mine ? "bg-positive text-white" : "bg-copper text-white",
                inView ? "scale-100 opacity-100" : "scale-75 opacity-0",
              )}
            >
              <Zap aria-hidden className="size-4 sm:size-5" />
            </span>
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-positive-soft p-4">
          <p className="font-mono text-2xl font-semibold text-positive tabular">{own} kWh</p>
          <p className="mt-1 text-sm font-semibold">Los usas tú, al instante</p>
          <p className="mt-1 text-sm text-fg-muted">Cada uno es un kWh que dejas de comprarle a la red a {formatCOP(ex.tariffCopKwh)}.</p>
        </div>
        <div className="rounded-2xl bg-copper-soft p-4">
          <p className="font-mono text-2xl font-semibold text-copper-text tabular">{10 - own} kWh</p>
          <p className="mt-1 text-sm font-semibold">Sobran y van a la red</p>
          <p className="mt-1 text-sm text-fg-muted">El operador te los reconoce en la factura, a cerca de {formatCOP(ex.surplusCopKwh)} cada uno.</p>
        </div>
      </div>
    </div>
  );
}
