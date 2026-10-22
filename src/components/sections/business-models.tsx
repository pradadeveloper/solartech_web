import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services, type ServiceKey } from "@/content/services";
import { cn } from "@/lib/utils";

/** Los 3 modelos como "productos financieros" comparables. */
export function BusinessModels({ exclude, headingLevel = "h3" }: { exclude?: ServiceKey; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const list = services.filter((s) => s.key !== exclude);
  return (
    <ul className={cn("grid gap-4", list.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2")}>
      {list.map((s, i) => (
        <li key={s.key}>
          <Link
            href={s.path}
            className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-colors hover:border-copper/60 sm:p-8"
          >
            <div aria-hidden className="glow-copper pointer-events-none absolute inset-x-0 -top-24 h-48 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-start justify-between gap-4">
              <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
              <ArrowUpRight aria-hidden className="size-5 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-copper-text" />
            </div>
            <Heading className="relative mt-6 text-2xl font-extrabold">{s.shortName}</Heading>
            <p className="relative mt-1 text-sm font-semibold text-copper-text">{s.tagline}</p>
            <p className="relative mt-4 text-sm text-fg-muted">{s.summary}</p>
            <div className="relative mt-auto pt-8">
              <div className="rounded-2xl border border-border bg-surface-2 p-4">
                <p className="text-[11px] text-fg-muted">{s.highlight.label}</p>
                <p className="mt-1 font-mono text-2xl font-semibold tabular">{s.highlight.value}</p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
