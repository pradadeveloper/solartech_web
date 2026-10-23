"use client";

import { revealStyle, useReveal } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

/** Lista cuyos elementos entran escalonados al aparecer en pantalla. El contenido llega ya
    renderizado desde el servidor; aquí solo se agrega la animación de entrada. */
export function RevealList({ items, keys, className, itemClassName, as: Tag = "ul" }: { items: React.ReactNode[]; keys: string[]; className?: string; itemClassName?: string; as?: "ul" | "ol" }) {
  const [ref, hidden] = useReveal<HTMLUListElement & HTMLOListElement>();
  return (
    <Tag ref={ref} className={className}>
      {items.map((item, i) => {
        const reveal = revealStyle(hidden, i);
        return (
          <li key={keys[i]} className={cn(itemClassName, reveal.className)} style={reveal.style}>
            {item}
          </li>
        );
      })}
    </Tag>
  );
}
