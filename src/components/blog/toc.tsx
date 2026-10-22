"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/blog";
import { cn } from "@/lib/utils";

/** Tabla de contenidos con la sección activa resaltada. */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Contenido del artículo">
      <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">En este artículo</p>
      <ol className="mt-4 space-y-1 border-l border-border text-sm">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l py-1.5 transition-colors",
                h.depth === 3 ? "pl-7" : "pl-4",
                active === h.id ? "border-copper-text font-semibold text-fg" : "border-transparent text-fg-muted hover:text-fg",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
