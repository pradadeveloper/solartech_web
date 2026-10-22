import { PageHeader } from "@/components/sections/page-header";
import { Section } from "@/components/sections/section";
import { ProjectFilters } from "@/components/sections/project-filters";
import { CtaBand } from "@/components/sections/cta-band";
import { projects, portfolioStats } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";
import { formatCOPCompact, formatNumber } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Proyectos de energía solar en Colombia",
  description: "Casos de éxito de Solartech: plantas solares de 45 a 540 kWp con ahorros de hasta $55M al mes y retorno de 3 a 4 años. Conoce las cifras reales.",
  path: "/proyectos/",
});

// Listado con filtros (sector, departamento, tamaño) y orden. El HTML del servidor trae
// todas las tarjetas; el filtrado ocurre en el navegador. Cada tarjeta enlaza a su ficha.
export default function ProyectosPage() {
  const stats = portfolioStats();
  const kpis = [
    { label: "Potencia instalada", value: `${formatNumber(stats.kwp, 0)} kWp` },
    { label: "Ahorro mensual combinado", value: formatCOPCompact(stats.monthlySavingsCop) },
    { label: "Retorno de la inversión", value: `${formatNumber(stats.paybackMin)}–${formatNumber(stats.paybackMax)} años` },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Casos de éxito"
        title="Proyectos de energía solar con cifras reales"
        description="Industria, agro, comercio y copropiedades que hoy producen su propia energía. Estos son sus números."
        crumbs={[{ name: "Proyectos", path: "/proyectos/" }]}
        aside={
          <dl className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border">
            {kpis.map((k) => (
              <div key={k.label} className="flex items-baseline justify-between gap-4 bg-surface px-6 py-5">
                <dt className="text-sm text-fg-muted">{k.label}</dt>
                <dd className="font-mono text-xl font-semibold whitespace-nowrap tabular sm:text-2xl">{k.value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <Section className="pt-14 lg:pt-16">
        <ProjectFilters projects={projects} />
      </Section>

      <CtaBand title="¿Quieres un proyecto como estos?" whatsappMessage="Hola Solartech. Vi sus proyectos y quiero uno similar para mi empresa." />
    </>
  );
}
