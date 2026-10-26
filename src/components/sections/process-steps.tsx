"use client";

import { useEffect, useState } from "react";
import { processSteps } from "@/content/services";
import { useInView, usePrefersReducedMotion } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

const STEP_MS = 2800;

type Step = { title: string; text: string };

// Clases literales para que Tailwind las detecte.
const COLS: Record<number, string> = { 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };

/** Proceso por pasos (por defecto los 5 de la factura al monitoreo). Se recorre solo, como
    "historias": una barra de avance por paso. Pasar el mouse o tocar un paso lo fija; fuera de
    pantalla o con movimiento reducido no avanza. */
export function ProcessSteps({ steps = processSteps }: { steps?: Step[] }) {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const reduced = usePrefersReducedMotion();
  const running = inView && !held && !reduced;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % steps.length), STEP_MS);
    return () => clearTimeout(id);
  }, [running, active, steps.length]);

  const hold = (i: number) => {
    setActive(i);
    setHeld(true);
  };

  return (
    <div ref={ref} onMouseLeave={() => setHeld(false)}>
      {/* Barras de avance (escritorio): completas las anteriores, llenándose la actual. */}
      <div aria-hidden className={cn("mb-3 hidden gap-2 lg:grid", COLS[steps.length] ?? "lg:grid-cols-5")}>
        {steps.map((s, i) => (
          <span key={s.title} className="h-1 overflow-hidden rounded-full bg-border">
            <span
              key={i === active ? `${active}-${running}` : "static"}
              className={cn(
                "block h-full origin-left rounded-full bg-copper",
                i < active || (i === active && !running) ? "scale-x-100" : i === active ? "animate-[rotator-progress_linear_forwards]" : "scale-x-0",
              )}
              style={i === active && running ? { animationDuration: `${STEP_MS}ms` } : undefined}
            />
          </span>
        ))}
      </div>

      <ol className={cn("grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2", COLS[steps.length] ?? "lg:grid-cols-5")}>
        {steps.map((step, i) => {
          const isOn = i === active;
          const done = i < active;
          return (
            <li
              key={step.title}
              aria-current={isOn ? "step" : undefined}
              onMouseEnter={() => hold(i)}
              onClick={() => hold(i)}
              className={cn(
                "relative cursor-default p-6 transition-colors duration-500",
                // Con un número impar de pasos, el último ocupa la fila completa en tablet.
                steps.length % 2 === 1 && "sm:last:col-span-2 lg:last:col-span-1",
                isOn ? "bg-copper-soft" : "bg-surface",
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full font-mono text-xs font-semibold transition-[background-color,color,transform] duration-500",
                    isOn ? "scale-110 bg-copper text-white" : done ? "bg-copper/15 text-copper-text" : "bg-surface-3 text-fg-subtle",
                  )}
                >
                  {i + 1}
                </span>
                <span className="font-mono text-xs text-copper-text">Paso {String(i + 1).padStart(2, "0")}</span>
              </span>
              <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
              <p className={cn("mt-2 text-sm transition-colors duration-500", isOn ? "text-fg" : "text-fg-muted")}>{step.text}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
