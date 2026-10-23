import { projectPlace, projects, type BusinessModel } from "@/content/projects";
import { services, type ServiceKey } from "@/content/services";
import { BusinessModelsDeck, type DeckModel } from "@/components/sections/business-models-deck";

// Proyectos que ilustra cada modelo. Gestión de plantas no tiene casos propios: muestra las
// plantas más grandes que diseñó y construyó Solartech, con un título que no promete más.
const showcase: Record<ServiceKey, { models: BusinessModel[]; label: string }> = {
  ppa: { models: ["PPA"], label: "Proyectos PPA más grandes" },
  epc: { models: ["EPC"], label: "Proyectos EPC más grandes" },
  "gestion-de-plantas": { models: ["EPC", "PPA"], label: "Plantas que diseñamos y construimos" },
};

/** Los 3 modelos como "productos financieros" comparables. Al pasar el mouse, cada uno se
    despliega con fotos de sus proyectos más grandes (ver BusinessModelsDeck). */
export function BusinessModels({ exclude, headingLevel = "h3" }: { exclude?: ServiceKey; headingLevel?: "h2" | "h3" }) {
  const bySize = [...projects].sort((a, b) => b.kwp - a.kwp);
  const used = new Set<string>();
  const models: DeckModel[] = services.map((s) => {
    const { models: wanted, label } = showcase[s.key];
    // Gestión toma plantas que no aparezcan ya en las otras tarjetas, para no repetir fotos.
    const pool = bySize.filter((p) => wanted.includes(p.model) && (s.key !== "gestion-de-plantas" || !used.has(p.slug)));
    const picked = pool.slice(0, 4);
    if (s.key !== "gestion-de-plantas") picked.forEach((p) => used.add(p.slug));
    return {
      key: s.key,
      path: s.path,
      shortName: s.shortName,
      tagline: s.tagline,
      summary: s.summary,
      highlight: s.highlight,
      // Condiciones en reposo; se omiten las que ya dice la cifra destacada.
      terms: s.terms.filter((t) => !["Inversión", "Retorno"].includes(t.label)).slice(0, 3),
      showcaseLabel: label,
      projects: picked.map((p) => ({ slug: p.slug, name: p.name, place: projectPlace(p), kwp: p.kwp, image: p.image, imageAlt: p.imageAlt })),
    };
  });

  return <BusinessModelsDeck models={models.filter((m) => m.key !== exclude)} headingLevel={headingLevel} />;
}
