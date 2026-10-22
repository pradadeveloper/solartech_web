"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clients } from "@/content/clients";
import { cn } from "@/lib/utils";

/** Logos de empresas clientes sobre fichas blancas (se leen igual en tema oscuro y claro).
    Muestra 18 y despliega el resto; todos están en el HTML para que se indexen. */
export function ClientLogos({ initial = 18 }: { initial?: number }) {
  const [expanded, setExpanded] = useState(initial >= clients.length);
  return (
    <div>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {clients.map((c, i) => (
          <li
            key={c.name}
            className={cn(
              "flex h-20 items-center justify-center rounded-2xl bg-white px-4 py-3 ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5 sm:h-24",
              !expanded && i >= initial && "hidden",
            )}
          >
            <Image src={c.logo} alt={c.name} width={c.width} height={c.height} loading="lazy" sizes="160px" className="h-auto max-h-full w-auto max-w-full object-contain" />
          </li>
        ))}
      </ul>
      {initial < clients.length && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border-strong px-5 text-sm font-semibold text-fg-muted transition-colors hover:border-copper-text hover:text-fg"
          >
            {expanded ? "Ver menos" : `Ver todos (${clients.length})`}
            <ChevronDown aria-hidden className={cn("size-4 transition-transform", expanded && "rotate-180")} />
          </button>
        </div>
      )}
    </div>
  );
}
