// Categorías y autores del blog. Las páginas de categoría solo se publican si tienen posts.

export type Category = { slug: string; name: string; description: string };

export const categories: Category[] = [
  {
    slug: "paneles-solares-para-empresas",
    name: "Paneles solares para empresas",
    description: "Energía solar industrial y comercial en Colombia: cómo funciona, cuánto ahorra y cómo implementarla en tu empresa.",
  },
  {
    slug: "costos-y-financiacion",
    name: "Costos y financiación",
    description: "Cuánto cuesta un sistema solar en Colombia, precio por kWp, modelos PPA y alternativas de financiación.",
  },
  {
    slug: "beneficios-tributarios",
    name: "Beneficios tributarios",
    description: "Ley 1715 y Ley 2099: deducción en renta, exclusión de IVA, aranceles y depreciación acelerada para proyectos solares.",
  },
  {
    slug: "energia-solar-agro",
    name: "Energía solar para el agro",
    description: "Paneles solares para fincas, bombeo solar, riego y cuartos fríos en el campo colombiano.",
  },
  {
    slug: "guias-tecnicas",
    name: "Guías técnicas",
    description: "On-grid vs. híbrido, baterías, mantenimiento, techos aptos y todo lo técnico de un sistema solar, explicado claro.",
  },
  {
    slug: "energia-solar-por-ciudad",
    name: "Energía solar por ciudad",
    description: "Radiación, tarifas y proyectos de energía solar en las principales ciudades de Colombia.",
  },
];

export type Author = { slug: string; name: string; role: string; bio: string; image?: string; linkedin?: string };

export const authors: Author[] = [
  {
    slug: "equipo-solartech",
    name: "Equipo técnico Solartech",
    role: "Ingeniería y proyectos solares",
    bio: "Equipo de ingeniería de Solartech, parte del grupo Ferragro. Diseñamos, construimos y operamos plantas solares para empresas, agro y hogares en Colombia.",
    linkedin: "https://www.linkedin.com/company/solartechlatam/",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getAuthor(slug: string) {
  return authors.find((a) => a.slug === slug) ?? authors[0];
}
