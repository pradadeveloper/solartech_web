"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/sections/project-card";
import { sectorLabels, type Project } from "@/content/projects";
import { cn } from "@/lib/utils";

const sectors = (Object.keys(sectorLabels) as Project["sector"][]).map((value) => ({ value, label: sectorLabels[value] }));

const sizes = [
  { value: "small", label: "Hasta 50 kWp", test: (p: Project) => p.kwp <= 50 },
  { value: "medium", label: "50 a 150 kWp", test: (p: Project) => p.kwp > 50 && p.kwp <= 150 },
  { value: "large", label: "Más de 150 kWp", test: (p: Project) => p.kwp > 150 },
] as const;

const sorts = {
  ahorro: { label: "Mayor ahorro", fn: (a: Project, b: Project) => (b.monthlySavingsCop ?? -1) - (a.monthlySavingsCop ?? -1) },
  potencia: { label: "Mayor potencia", fn: (a: Project, b: Project) => b.kwp - a.kwp },
  retorno: { label: "Menor retorno", fn: (a: Project, b: Project) => (a.paybackYears ?? 99) - (b.paybackYears ?? 99) },
} as const;

type SortKey = keyof typeof sorts;

/** Listado filtrable. El primer render (servidor) incluye todas las tarjetas para SEO;
    los filtros solo actúan en el navegador. */
export function ProjectFilters({ projects }: { projects: Project[] }) {
  const [sector, setSector] = useState<Project["sector"] | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [size, setSize] = useState<(typeof sizes)[number]["value"] | null>(null);
  const [sort, setSort] = useState<SortKey>("potencia");

  // "Colombia" marca proyectos sin municipio confirmado: no se ofrece como filtro.
  const departments = useMemo(() => [...new Set(projects.map((p) => p.department))].filter((d) => d !== "Colombia").sort(), [projects]);
  const visible = useMemo(
    () =>
      projects
        .filter((p) => (!sector || p.sector === sector) && (!department || p.department === department) && (!size || sizes.find((s) => s.value === size)!.test(p)))
        .sort(sorts[sort].fn),
    [projects, sector, department, size, sort],
  );

  const active = sector || department || size;

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-border bg-surface p-4 sm:p-5">
        <ChipGroup label="Sector" options={sectors} value={sector} onChange={setSector} />
        <ChipGroup label="Departamento" options={departments.map((d) => ({ value: d, label: d }))} value={department} onChange={setDepartment} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ChipGroup label="Tamaño" options={[...sizes]} value={size} onChange={setSize} />
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            Ordenar por
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-9 rounded-full border border-border-strong bg-surface-2 px-3 text-sm text-fg outline-none focus:border-copper-text"
            >
              {(Object.keys(sorts) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {sorts[k].label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="mb-4 text-sm text-fg-muted" aria-live="polite">
        {visible.length} {visible.length === 1 ? "proyecto" : "proyectos"}
        {active && (
          <button
            type="button"
            className="ml-3 font-semibold text-copper-text hover:underline"
            onClick={() => {
              setSector(null);
              setDepartment(null);
              setSize(null);
            }}
          >
            Quitar filtros
          </button>
        )}
      </p>

      {visible.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-3xl border border-border bg-surface p-8 text-center text-fg-muted">No hay proyectos con estos filtros todavía.</p>
      )}
    </>
  );
}

function ChipGroup<T extends string>({ label, options, value, onChange }: { label: string; options: { value: T; label: string }[]; value: T | null; onChange: (v: T | null) => void }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">{label}</span>
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(selected ? null : o.value)}
            className={cn(
              "h-8 rounded-full border px-3 text-sm font-medium transition-colors",
              selected ? "border-copper bg-copper-soft text-fg" : "border-border-strong text-fg-muted hover:text-fg",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
