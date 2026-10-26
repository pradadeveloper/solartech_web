import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { hasProjectPage, projects } from "@/content/projects";
import { cities } from "@/content/cities";
import { getActiveCategories, getAllPosts } from "@/lib/blog";

// Rutas estáticas publicadas. Blog, categorías y proyectos se generan desde su contenido.
const staticRoutes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/cotizador/", priority: 0.9 },
  { path: "/calculadora-ahorro/", priority: 0.8 },
  { path: "/servicios/", priority: 0.9 },
  { path: "/servicios/ppa/", priority: 0.9 },
  { path: "/servicios/epc/", priority: 0.9 },
  { path: "/servicios/gestion-de-plantas/", priority: 0.8 },
  { path: "/soluciones/", priority: 0.8 },
  { path: "/soluciones/empresas/", priority: 0.8 },
  { path: "/soluciones/agro/", priority: 0.8 },
  { path: "/soluciones/hogares/", priority: 0.7 },
  { path: "/soluciones/sistemas-hibridos-baterias/", priority: 0.7 },
  { path: "/proyectos/", priority: 0.8 },
  { path: "/beneficios-tributarios/", priority: 0.9 },
  { path: "/blog/", priority: 0.7 },
  { path: "/energia-solar-en/", priority: 0.6 },
  { path: "/quienes-somos/", priority: 0.6 },
  { path: "/referidos-comerciales/", priority: 0.6 },
  { path: "/preguntas-frecuentes/", priority: 0.6 },
  { path: "/contacto/", priority: 0.6 },
  // /politica-de-privacidad/ y /terminos/ quedan fuera mientras sean borrador (noindex).
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getAllPosts().filter((p) => !p.noindex);

  return [
    ...staticRoutes.map(({ path, priority }) => ({ url: `${site.url}${path}`, lastModified: now, priority })),
    ...projects.filter(hasProjectPage).map((p) => ({ url: `${site.url}/proyectos/${p.slug}/`, lastModified: now, priority: 0.7 })),
    ...cities.map((c) => ({ url: `${site.url}/energia-solar-en/${c.slug}/`, lastModified: now, priority: 0.7 })),
    ...getActiveCategories().map((c) => ({ url: `${site.url}/blog/${c.slug}/`, lastModified: now, priority: 0.5 })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}/`, lastModified: p.updated ?? p.date, priority: 0.6 })),
  ];
}
