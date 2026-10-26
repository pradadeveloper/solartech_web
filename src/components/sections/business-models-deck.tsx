"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { ServiceKey } from "@/content/services";
import { cn, formatNumber } from "@/lib/utils";

export type DeckProject = { slug: string; name: string; place: string; kwp: number; image: string; imageAlt: string };
export type DeckModel = {
  key: ServiceKey;
  path: string;
  shortName: string;
  tagline: string;
  summary: string;
  highlight: { label: string; value: string };
  terms: { label: string; value: string }[];
  showcaseLabel: string;
  projects: DeckProject[];
};

/** Tarjetas de modelos de negocio. En escritorio, la tarjeta bajo el mouse (o con foco) se
    ensancha y se convierte en vitrina: foto del proyecto más grande del modelo y miniaturas
    de los siguientes (pasar sobre una cambia la foto). En móvil, cada tarjeta trae su franja
    de fotos. Las fotos de la vitrina se montan cuando el mouse entra a la sección (no al cargar
    la página), así que al cambiar de miniatura ya están descargadas. */
export function BusinessModelsDeck({ models, headingLevel = "h3" }: { models: DeckModel[]; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const [active, setActive] = useState<ServiceKey | null>(null);
  const [selected, setSelected] = useState(0);
  const [warm, setWarm] = useState(false);

  const open = (key: ServiceKey) => {
    setWarm(true);
    if (key !== active) setSelected(0);
    setActive(key);
  };

  return (
    <ul
      className={cn("grid gap-4 lg:flex lg:h-[500px]", models.length !== 3 && "md:grid-cols-2")}
      onMouseEnter={() => setWarm(true)}
      onMouseLeave={() => setActive(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setActive(null);
      }}
    >
      {models.map((m, i) => {
        const isActive = active === m.key;
        const shown = m.projects[Math.min(selected, m.projects.length - 1)];
        return (
          <li
            key={m.key}
            style={{ flexGrow: isActive ? 2.4 : 1 }}
            className="min-w-0 lg:basis-0 lg:transition-[flex-grow] lg:duration-500 lg:ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            onMouseEnter={() => open(m.key)}
            onFocus={() => open(m.key)}
          >
            <Link
              href={m.path}
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-surface p-6 transition-colors duration-300 sm:p-8",
                isActive ? "border-copper/70 lg:bg-black" : "border-border hover:border-copper/60",
              )}
            >
              {/* Vitrina (solo escritorio): todas las fotos apiladas, se ve la seleccionada. */}
              <div aria-hidden className={cn("absolute inset-0 hidden transition-opacity duration-500 lg:block", isActive ? "opacity-100" : "opacity-0")}>
                {(warm || isActive) &&
                  m.projects.map((p) => (
                    <Image
                      key={p.slug}
                      src={p.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 60vw, 1px"
                      className={cn(
                        "object-cover transition-[opacity,transform] duration-700 ease-out",
                        isActive && p.slug === shown?.slug ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
                      )}
                    />
                  ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/45" />
              </div>

              <div className="relative flex items-start justify-between gap-4">
                <span className={cn("font-mono text-xs transition-colors", isActive ? "lg:text-white/70" : "text-fg-subtle")}>0{i + 1}</span>
                <ArrowUpRight
                  aria-hidden
                  className={cn(
                    "size-5 transition-[transform,color] group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                    isActive ? "text-copper-text lg:text-white" : "text-fg-subtle group-hover:text-copper-text",
                  )}
                />
              </div>

              <Heading className={cn("relative mt-6 text-2xl font-extrabold transition-colors", isActive && "lg:text-white")}>{m.shortName}</Heading>
              <p className={cn("relative mt-1 text-sm font-semibold text-copper-text transition-colors", isActive && "lg:text-[#f7b5a3]")}>{m.tagline}</p>
              <p className={cn("relative mt-4 max-w-md text-sm text-fg-muted transition-colors", isActive && "lg:text-white/80")}>{m.summary}</p>

              {/* Condiciones del modelo: siempre en móvil; en escritorio solo con todas las tarjetas en reposo. */}
              {m.terms.length > 0 && (
                <dl className={cn("relative mt-6 divide-y divide-border text-sm", active !== null && "lg:hidden")}>
                  {m.terms.map((t) => (
                    <div key={t.label} className="flex items-baseline justify-between gap-3 py-2">
                      <dt className="text-fg-muted">{t.label}</dt>
                      <dd className="text-right font-semibold">{t.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* Móvil y tablet: franja de fotos siempre visible. */}
              {m.projects.length > 0 && (
                <div className="relative mt-6 lg:hidden">
                  <p className="text-[11px] text-fg-muted">{m.showcaseLabel}</p>
                  <ul className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                    {m.projects.slice(0, 3).map((p) => (
                      <li key={p.slug} className="w-36 shrink-0">
                        <span className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-surface-3">
                          <Image src={p.image} alt={p.imageAlt} fill sizes="144px" className="object-cover" />
                        </span>
                        <span className="mt-1 block truncate text-xs font-semibold">{p.name}</span>
                        <span className="block font-mono text-[11px] text-fg-subtle tabular">{formatNumber(p.kwp)} kWp</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="relative mt-auto pt-8">
                {/* Escritorio, tarjeta activa: proyecto en foto y miniaturas para cambiarlo. */}
                {shown && (
                  <div aria-hidden={!isActive} className={cn("mb-4 hidden text-white transition-[opacity,transform] duration-500 lg:block", isActive ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none absolute inset-x-0 bottom-full translate-y-3 opacity-0")}>
                    <p className="text-[11px] text-white/65">{m.showcaseLabel}</p>
                    <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-lg font-bold">{shown.name}</span>
                      <span className="font-mono text-sm tabular">{formatNumber(shown.kwp)} kWp</span>
                      <span className="inline-flex items-center gap-1 text-xs text-white/70">
                        <MapPin aria-hidden className="size-3" />
                        {shown.place}
                      </span>
                    </p>
                    <ul className="mt-3 flex gap-2">
                      {m.projects.map((p, j) => (
                        <li
                          key={p.slug}
                          onMouseEnter={() => setSelected(j)}
                          className={cn(
                            "relative h-14 w-20 overflow-hidden rounded-lg ring-2 transition-[box-shadow,opacity]",
                            p.slug === shown.slug ? "ring-white" : "opacity-70 ring-transparent hover:opacity-100",
                          )}
                        >
                          {isActive && <Image src={p.image} alt="" fill sizes="80px" className="object-cover" />}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className={cn("rounded-2xl border p-4 transition-colors duration-300", isActive ? "border-border bg-surface-2 lg:border-white/15 lg:bg-white/10" : "border-border bg-surface-2")}>
                  <p className={cn("text-[11px] text-fg-muted", isActive && "lg:text-white/70")}>{m.highlight.label}</p>
                  <p className={cn("mt-1 font-mono text-2xl font-semibold tabular", isActive && "lg:text-white")}>{m.highlight.value}</p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
