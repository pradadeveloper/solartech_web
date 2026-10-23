"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useInView, usePrefersReducedMotion } from "@/lib/use-in-view";
import { cn, formatNumber } from "@/lib/utils";

export type RotatorSlide = { slug: string; name: string; place: string; kwp: number; model: string; image: string; imageAlt: string; href?: string };

const INTERVAL_MS = 5000;

/** Vitrina de fotos de proyectos que rota sola (fundido + zoom lento). Se pausa con el mouse,
    con el foco o fuera de pantalla; con movimiento reducido no avanza sola. Solo monta la foto
    actual, las ya vistas y la siguiente, para no descargar todas de entrada. */
export function ProjectRotator({ slides, className }: { slides: RotatorSlide[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(() => new Set([0, 1]));
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const running = inView && !paused && !reduced && slides.length > 1;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => clearTimeout(id);
  });

  function go(next: number) {
    const i = (next + slides.length) % slides.length;
    setIndex(i);
    setMounted((m) => new Set(m).add(i).add((i + 1) % slides.length));
  }

  const current = slides[index];
  return (
    <div
      ref={ref}
      className={cn("group/rotator overflow-hidden rounded-3xl bg-surface-3", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carrusel"
      aria-label="Fotos de proyectos construidos por Solartech"
    >
      {slides.map((s, i) =>
        mounted.has(i) ? (
          <Image
            key={s.slug}
            src={s.image}
            alt={i === index ? s.imageAlt : ""}
            aria-hidden={i !== index || undefined}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={cn(
              "object-cover transition-[opacity,transform] ease-out motion-reduce:transition-none",
              i === index ? "scale-100 opacity-100 duration-[1000ms,6000ms]" : "scale-[1.06] opacity-0 duration-[1000ms,0ms]",
            )}
          />
        ) : null,
      )}
      {/* Velo solo donde va el texto, para que se lea sobre cualquier foto. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

      {/* En escritorio el panel del portafolio tapa el borde izquierdo: el texto empieza después. */}
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 text-white sm:p-7 lg:pl-[24%]">
        <div aria-live={running ? "off" : "polite"} className="min-w-0">
          <p className="flex items-center gap-2 text-xs text-white/75">
            <span className="rounded-full bg-black/45 px-2 py-0.5 font-mono text-[11px] font-semibold">{current.model}</span>
            <span className="font-mono tabular">{formatNumber(current.kwp)} kWp</span>
          </p>
          {current.href ? (
            <Link href={current.href} className="mt-2 block truncate text-xl font-extrabold hover:underline sm:text-2xl">
              {current.name}
            </Link>
          ) : (
            <p className="mt-2 truncate text-xl font-extrabold sm:text-2xl">{current.name}</p>
          )}
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-white/80">
            <MapPin aria-hidden className="size-3.5" />
            {current.place}
          </p>
        </div>

        <div className="flex items-center gap-1.5" role="group" aria-label="Elegir proyecto">
          {slides.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ver ${s.name}`}
              aria-current={i === index || undefined}
              className="group/dot grid h-6 place-items-center"
            >
              <span className={cn("relative block h-1 overflow-hidden rounded-full bg-white/35 transition-[width] duration-300", i === index ? "w-8" : "w-3 group-hover/dot:bg-white/60")}>
                {i === index && (
                  <span
                    key={`${index}-${running}`}
                    className={cn("absolute inset-0 origin-left rounded-full bg-white", running && "animate-[rotator-progress_linear_forwards]")}
                    style={running ? { animationDuration: `${INTERVAL_MS}ms` } : undefined}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
