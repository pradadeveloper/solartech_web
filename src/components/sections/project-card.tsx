import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { hasProjectPage, projectPlace, sectorLabels, type Project } from "@/content/projects";
import { formatCOPCompact, formatNumber } from "@/lib/utils";

/** Caso de éxito presentado como ficha de inversión. Si el proyecto tiene ficha propia,
    toda la tarjeta enlaza a /proyectos/<slug>/. */
export function ProjectCard({ project: p, headingLevel = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const linked = hasProjectPage(p);
  const body = (
    <article className="flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute top-4 left-4 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur">{p.model}</span>
        {linked && (
          <span aria-hidden className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </span>
        )}
        <div className="absolute right-4 bottom-4 left-4 text-white">
          <Heading className="text-xl font-extrabold">{p.name}</Heading>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-white/80">
            <MapPin aria-hidden className="size-3.5" />
            {projectPlace(p)}
          </p>
        </div>
      </div>
      <dl className="grid grid-cols-3 divide-x divide-border">
        <div className="p-4">
          <dt className="text-[11px] text-fg-muted">Potencia</dt>
          <dd className="mt-1 font-mono text-sm font-semibold whitespace-nowrap tabular sm:text-base">{formatNumber(p.kwp)} kWp</dd>
        </div>
        <div className="p-4">
          {p.monthlySavingsCop !== null ? (
            <>
              <dt className="text-[11px] text-fg-muted">Ahorro / mes</dt>
              <dd className="mt-1 font-mono text-sm font-semibold whitespace-nowrap text-positive tabular sm:text-base">{formatCOPCompact(p.monthlySavingsCop)}</dd>
            </>
          ) : (
            <>
              <dt className="text-[11px] text-fg-muted">Sector</dt>
              <dd className="mt-1 truncate text-sm font-semibold">{sectorLabels[p.sector]}</dd>
            </>
          )}
        </div>
        <div className="p-4">
          <dt className="text-[11px] text-fg-muted">{p.paybackYears ? "Retorno" : "Inversión"}</dt>
          <dd className="mt-1 font-mono text-sm font-semibold whitespace-nowrap tabular sm:text-base">{p.paybackYears ? `${formatNumber(p.paybackYears)} años` : "$0"}</dd>
        </div>
      </dl>
    </article>
  );

  const frame = "group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface";
  if (!linked) return <div className={frame}>{body}</div>;
  return (
    <Link href={`/proyectos/${p.slug}/`} className={`${frame} transition-colors hover:border-copper/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper-text`}>
      {body}
    </Link>
  );
}
