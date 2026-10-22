import { cn } from "@/lib/utils";

/** Etiqueta pequeña sobre los títulos de sección (estilo "ticker"). */
export function Eyebrow({ className, children, live = false }: { className?: string; children: React.ReactNode; live?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 font-mono text-[11px] font-medium tracking-[0.12em] text-fg-muted uppercase backdrop-blur",
        className,
      )}
    >
      {live && <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-positive" />}
      {children}
    </span>
  );
}

/** Variación positiva, p. ej. "▲ 35 %". */
export function Delta({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md bg-positive-soft px-1.5 py-0.5 font-mono text-xs font-semibold text-positive tabular", className)}>
      <span aria-hidden>▲</span>
      {children}
    </span>
  );
}
