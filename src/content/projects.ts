// Casos de éxito. Fuentes: sitio anterior (audit/site-copy.json) y presentaciones comerciales
// "PPT Solartech-Industria" y "Presentación PPA 2026" (oct-2026). Cuando hubo diferencias se
// tomaron las presentaciones, que son el material más reciente (ver audit/QA-LANZAMIENTO.md).
// Las cifras agregadas del sitio se calculan de esta lista (ver portfolioStats).

export type BusinessModel = "EPC" | "PPA" | "Gestión de plantas";
export type Sector = "industria" | "comercio" | "agro" | "residencial" | "copropiedad";

export type Project = {
  slug: string;
  name: string;
  city: string;
  department: string;
  sector: Sector;
  model: BusinessModel;
  kwp: number;
  /** Ahorro mensual documentado. `null` cuando la presentación solo trae potencia y retorno. */
  monthlySavingsCop: number | null;
  paybackYears: number | null;
  image: string;
  imageAlt: string;
  summary?: string;
  clientUrl?: string;
  /** Datos pendientes de confirmar con Solartech antes de publicar. */
  pendingReview?: string;
};

export const sectorLabels: Record<Sector, string> = {
  industria: "Industria",
  comercio: "Comercio y servicios",
  agro: "Agro",
  residencial: "Hogares",
  copropiedad: "Copropiedades",
};

const img = (file: string) => `/images/proyectos/${file}.webp`;

export const projects: Project[] = [
  // ---------- Industria ----------
  {
    slug: "absorbentes-de-colombia",
    name: "Absorbentes de Colombia",
    city: "Cartagena",
    department: "Bolívar",
    sector: "industria",
    model: "EPC",
    kwp: 540,
    monthlySavingsCop: 55_000_000,
    paybackYears: 2.9,
    image: img("proyecto-absorbentes-de-colombia-cartagena"),
    imageAlt: "Vista aérea de la planta solar de 540 kWp en la cubierta de Absorbentes de Colombia, Cartagena",
  },
  {
    slug: "rotoplast",
    name: "Rotoplast",
    city: "Guarne",
    department: "Antioquia",
    sector: "industria",
    model: "EPC",
    kwp: 340,
    monthlySavingsCop: null,
    paybackYears: 3,
    image: img("proyecto-rotoplast-guarne"),
    imageAlt: "Planta solar de 340 kWp sobre la nave industrial de Rotoplast en Guarne, vista desde dron",
  },
  {
    slug: "plastired",
    name: "Plastired",
    city: "La Estrella",
    department: "Antioquia",
    sector: "industria",
    model: "EPC",
    kwp: 198,
    monthlySavingsCop: null,
    paybackYears: 2.7,
    image: img("proyecto-plastired-la-estrella"),
    imageAlt: "Filas de paneles solares de la planta de 198 kWp de Plastired en La Estrella",
  },
  {
    slug: "templamos",
    name: "Templamos",
    city: "Medellín",
    department: "Antioquia",
    sector: "industria",
    model: "EPC",
    kwp: 136,
    monthlySavingsCop: 12_000_000,
    paybackYears: 3.0,
    image: img("proyecto-templamos-medellin"),
    imageAlt: "Planta solar de 136 kWp en la cubierta industrial de Templamos, Medellín",
    pendingReview: "Foto en baja resolución (828×622): pedir original. No aparece en la presentación 2026.",
  },
  {
    slug: "safer-agrobiologicos",
    name: "Safer Agrobiológicos",
    city: "San Pedro de los Milagros",
    department: "Antioquia",
    sector: "industria",
    model: "EPC",
    kwp: 135,
    monthlySavingsCop: 13_000_000,
    paybackYears: 3,
    image: img("proyecto-safer-agrobiologicos-san-pedro"),
    imageAlt: "Sistema solar de 135 kWp de Safer Agrobiológicos en San Pedro de los Milagros, Antioquia",
    pendingReview: "Sitio anterior: 130 kWp y 3,3 años; presentación 2026: 135 kWp y 3 años.",
  },
  {
    slug: "natural-harvest",
    name: "Natural Harvest",
    city: "Pereira",
    department: "Risaralda",
    sector: "industria",
    model: "EPC",
    kwp: 135,
    monthlySavingsCop: 11_500_000,
    paybackYears: 2.8,
    image: img("proyecto-natural-harvest-pereira"),
    imageAlt: "Sistema fotovoltaico de Natural Harvest en Pereira, Risaralda",
    pendingReview: "Sitio anterior: retorno 3,8 años; presentación 2026: 2,8 años.",
  },
  {
    slug: "especial-impresores",
    name: "Especial Impresores",
    city: "Medellín",
    department: "Antioquia",
    sector: "industria",
    model: "EPC",
    kwp: 134,
    monthlySavingsCop: null,
    paybackYears: 2.8,
    image: img("proyecto-especial-impresores-medellin"),
    imageAlt: "Paneles solares de 134 kWp en la terraza de Especial Impresores en El Poblado, Medellín",
  },
  {
    slug: "comodisimos",
    name: "Comodísimos",
    city: "Sabaneta",
    department: "Antioquia",
    sector: "industria",
    model: "EPC",
    kwp: 134,
    monthlySavingsCop: null,
    paybackYears: 2.8,
    image: img("proyecto-comodisimos-sabaneta"),
    imageAlt: "Planta solar de 134 kWp sobre la cubierta de Comodísimos en Sabaneta",
  },
  {
    slug: "colpagro",
    name: "Colpagro",
    city: "Itagüí",
    department: "Antioquia",
    sector: "industria",
    model: "EPC",
    kwp: 123,
    monthlySavingsCop: null,
    paybackYears: 3,
    image: img("proyecto-colpagro-itagui"),
    imageAlt: "Vista aérea de la planta solar de 123 kWp de Colpagro en Itagüí",
  },
  {
    slug: "botero-soto",
    name: "Botero Soto Soluciones Logísticas",
    city: "Itagüí",
    department: "Antioquia",
    sector: "industria",
    model: "EPC",
    kwp: 93,
    monthlySavingsCop: null,
    paybackYears: 3.3,
    image: img("proyecto-botero-soto-itagui"),
    imageAlt: "Paneles solares de 93 kWp en la bodega de Botero Soto Soluciones Logísticas, Itagüí",
  },
  {
    slug: "lam-cosmeticos",
    name: "Lam Cosméticos",
    city: "Itagüí",
    department: "Antioquia",
    sector: "industria",
    model: "EPC",
    kwp: 56,
    monthlySavingsCop: null,
    paybackYears: 4,
    image: img("proyecto-lam-cosmeticos-itagui"),
    imageAlt: "Sistema solar de 56 kWp en la cubierta de Lam Cosméticos, Itagüí",
  },

  // ---------- Comercio y servicios ----------
  {
    slug: "caribe-motor",
    name: "Caribe Motor",
    city: "Medellín",
    department: "Antioquia",
    sector: "comercio",
    model: "EPC",
    kwp: 134,
    monthlySavingsCop: 9_500_000,
    paybackYears: 3,
    image: img("proyecto-caribe-motor-medellin"),
    imageAlt: "Paneles solares de 134 kWp sobre la cubierta de Caribe Motor en Medellín, vista desde dron",
    clientUrl: "https://www.caribemotor.com.co/",
    summary:
      "En 10 meses diseñamos e instalamos un sistema fotovoltaico que produce 15.000 kWh al mes, cubre el 50 % de la factura de energía y genera un ahorro anual superior a $120.000.000. A 25 años seguirá operando al 89 % de su eficiencia.",
    pendingReview: "Sitio anterior: 135 kWp y 3,6 años; presentación 2026: 134 kWp y 3 años.",
  },
  {
    slug: "columbus-school",
    name: "The Columbus School",
    city: "Envigado",
    department: "Antioquia",
    sector: "comercio",
    model: "EPC",
    kwp: 192,
    monthlySavingsCop: null,
    paybackYears: 4,
    image: img("proyecto-columbus-school-envigado"),
    imageAlt: "Parqueadero solar de 192 kWp del colegio The Columbus School en Las Palmas, Envigado",
  },
  {
    slug: "hotel-sabana-del-sinu",
    name: "Hotel Sabana del Sinú",
    city: "Montería",
    department: "Córdoba",
    sector: "comercio",
    model: "EPC",
    kwp: 106,
    monthlySavingsCop: null,
    paybackYears: 3.5,
    image: img("proyecto-hotel-sabana-del-sinu-monteria"),
    imageAlt: "Paneles solares de 106 kWp en la cubierta del Hotel Sabana del Sinú, Montería",
  },
  {
    slug: "hotel-alfahar",
    name: "Hotel Alfahar",
    city: "El Carmen de Viboral",
    department: "Antioquia",
    sector: "comercio",
    model: "EPC",
    kwp: 99,
    monthlySavingsCop: null,
    paybackYears: 4,
    image: img("proyecto-hotel-alfahar-carmen-de-viboral"),
    imageAlt: "Sistema solar de 99 kWp en el Hotel Alfahar, El Carmen de Viboral",
  },

  // ---------- Agro ----------
  {
    slug: "agricolas-unidas",
    name: "Agrícolas Unidas",
    city: "Támesis",
    department: "Antioquia",
    sector: "agro",
    model: "EPC",
    kwp: 136,
    monthlySavingsCop: 9_500_000,
    paybackYears: 3.2,
    image: img("proyecto-agricolas-unidas-tamesis"),
    imageAlt: "Paneles solares de 136 kWp instalados en Agrícolas Unidas, Támesis, Antioquia",
    pendingReview: "No aparece en la presentación 2026; cifras del sitio anterior.",
  },
  {
    slug: "agroindefuturo",
    name: "Agroindefuturo",
    city: "Córdoba",
    department: "Córdoba",
    sector: "agro",
    model: "EPC",
    kwp: 134,
    monthlySavingsCop: null,
    paybackYears: 2.8,
    image: img("proyecto-agroindefuturo-cordoba"),
    imageAlt: "Planta solar de 134 kWp sobre cubierta de teja en Agroindefuturo, Córdoba",
    pendingReview: "La presentación solo indica el departamento (Córdoba).",
  },
  {
    slug: "finca-ganadera-dorada",
    name: "Finca Ganadera Dorada",
    city: "Colombia",
    department: "Colombia",
    sector: "agro",
    model: "EPC",
    kwp: 35,
    monthlySavingsCop: null,
    paybackYears: 3,
    image: img("agro-finca-ganadera-dorada"),
    imageAlt: "Paneles solares montados en suelo en la Finca Ganadera Dorada",
    pendingReview: "Falta el municipio; foto de baja resolución (272 px).",
  },
  {
    slug: "guadalquivir",
    name: "Proyecto agrícola Guadalquivir",
    city: "Colombia",
    department: "Colombia",
    sector: "agro",
    model: "EPC",
    kwp: 26.84,
    monthlySavingsCop: null,
    paybackYears: 4,
    image: img("agro-guadalquivir"),
    imageAlt: "Sistema solar en suelo de 26,84 kWp del proyecto agrícola Guadalquivir, vista aérea",
    pendingReview: "Falta el municipio; foto de baja resolución (319 px).",
  },

  // ---------- Copropiedades (PPA) — cifras de la Presentación PPA 2026 ----------
  {
    slug: "ph-entre-parques",
    name: "PH Entre Parques",
    city: "Envigado",
    department: "Antioquia",
    sector: "copropiedad",
    model: "PPA",
    kwp: 148.6,
    monthlySavingsCop: 9_224_115,
    paybackYears: null,
    image: img("ppa-ph-entre-parques-envigado"),
    imageAlt: "Vista aérea de las torres de PH Entre Parques en Envigado con paneles solares en sus cubiertas",
  },
  {
    slug: "ph-cr-canela",
    name: "PH CR Canela",
    city: "Sabaneta",
    department: "Antioquia",
    sector: "copropiedad",
    model: "PPA",
    kwp: 91.2,
    monthlySavingsCop: 5_801_250,
    paybackYears: null,
    image: img("ppa-ph-cr-canela-sabaneta"),
    imageAlt: "Cubierta del conjunto PH CR Canela en Sabaneta con 91,2 kWp de paneles solares, vista cenital",
  },
  {
    slug: "edificio-oclock",
    name: "Edificio O’Clock",
    city: "Envigado",
    department: "Antioquia",
    sector: "copropiedad",
    model: "PPA",
    kwp: 74.2,
    monthlySavingsCop: 4_809_087,
    paybackYears: null,
    image: img("ppa-edificio-oclock-envigado"),
    imageAlt: "Paneles solares de 74,2 kWp en la terraza del Edificio O’Clock, Envigado, vista desde dron",
  },
  {
    slug: "edificio-lyon",
    name: "Edificio Lyon",
    city: "Envigado",
    department: "Antioquia",
    sector: "copropiedad",
    model: "PPA",
    kwp: 73.12,
    monthlySavingsCop: 4_661_400,
    paybackYears: null,
    image: img("ppa-edificio-lyon-envigado"),
    imageAlt: "Torres del Edificio Lyon en Envigado con paneles solares en sus cubiertas",
  },
  {
    slug: "ph-el-vergel",
    name: "PH El Vergel",
    city: "Medellín",
    department: "Antioquia",
    sector: "copropiedad",
    model: "PPA",
    kwp: 65.8,
    monthlySavingsCop: 4_096_050,
    paybackYears: null,
    image: img("ppa-ph-el-vergel-medellin"),
    imageAlt: "Vista cenital de PH El Vergel en Medellín con 65,8 kWp de paneles solares",
  },
  {
    slug: "edificio-plex",
    name: "Edificio Plex",
    city: "Medellín",
    department: "Antioquia",
    sector: "copropiedad",
    model: "PPA",
    kwp: 45.6,
    monthlySavingsCop: 3_129_000,
    paybackYears: null,
    image: img("ppa-edificio-plex-medellin"),
    imageAlt: "Paneles solares en la terraza del Edificio Plex, Medellín, bajo modelo PPA",
    clientUrl: "https://www.especialconpropiedad.com/plex",
    summary:
      "Instalamos en 4 meses un sistema que cubre el 40 % de la demanda del edificio. Plex no invirtió: le vendemos el kWh un 35 % más barato que el operador de red, con una producción de 4.500 a 5.000 kWh al mes.",
    pendingReview: "Sitio anterior: ahorro de $1,5M al mes; presentación PPA 2026: $3.129.000.",
  },
  {
    slug: "torre-guayacan",
    name: "Torre Guayacán",
    city: "Envigado",
    department: "Antioquia",
    sector: "copropiedad",
    model: "PPA",
    kwp: 39,
    monthlySavingsCop: null,
    paybackYears: null,
    image: img("ppa-torre-guayacan-envigado"),
    imageAlt: "Paneles solares en la cubierta de Torre Guayacán, Envigado, vista aérea",
  },
  {
    slug: "ph-nuvo",
    name: "PH NUVO",
    city: "Medellín",
    department: "Antioquia",
    sector: "copropiedad",
    model: "PPA",
    kwp: 32.3,
    monthlySavingsCop: 2_093_000,
    paybackYears: null,
    image: img("ppa-ph-nuvo-medellin"),
    imageAlt: "Cubierta de PH NUVO en Medellín con 32,3 kWp de paneles solares, vista cenital",
  },
  {
    slug: "edificio-avinon-20c",
    name: "Edificio Aviñón 20C",
    city: "Medellín",
    department: "Antioquia",
    sector: "copropiedad",
    model: "PPA",
    kwp: 27.5,
    monthlySavingsCop: 2_201_000,
    paybackYears: null,
    image: img("ppa-edificio-avinon-medellin"),
    imageAlt: "Paneles solares en la terraza del Edificio Aviñón 20C, El Poblado, Medellín",
    pendingReview: "Presentación industria: 14,3 kWp; presentación PPA 2026: 27,5 kWp.",
  },
  {
    slug: "ph-canta-girone",
    name: "PH Canta Girone",
    city: "Medellín",
    department: "Antioquia",
    sector: "copropiedad",
    model: "PPA",
    kwp: 27.5,
    monthlySavingsCop: 1_010_000,
    paybackYears: null,
    image: img("ppa-ph-canta-girone-medellin"),
    imageAlt: "Paneles solares de 27,5 kWp en la cubierta de PH Canta Girone, Medellín",
  },

  // ---------- Hogares ----------
  {
    slug: "casa-medellin",
    name: "Casa en Medellín",
    city: "Medellín",
    department: "Antioquia",
    sector: "residencial",
    model: "EPC",
    kwp: 11,
    monthlySavingsCop: null,
    paybackYears: 3,
    image: img("residencial-casa-medellin"),
    imageAlt: "Paneles solares sobre el techo de teja de una casa en Medellín, vista cenital",
  },
  {
    slug: "casa-la-ceja",
    name: "Casa en La Ceja",
    city: "La Ceja",
    department: "Antioquia",
    sector: "residencial",
    model: "EPC",
    kwp: 9.28,
    monthlySavingsCop: null,
    paybackYears: 3.3,
    image: img("residencial-casa-la-ceja"),
    imageAlt: "Sistema solar de 9,28 kWp en el techo de una casa en La Ceja",
  },
  {
    slug: "casa-rionegro",
    name: "Casa en Rionegro",
    city: "Rionegro",
    department: "Antioquia",
    sector: "residencial",
    model: "EPC",
    kwp: 8.8,
    monthlySavingsCop: null,
    paybackYears: 4,
    image: img("residencial-casa-rionegro"),
    imageAlt: "Paneles solares de 8,8 kWp en la terraza de una casa en Rionegro",
  },
  {
    slug: "casa-envigado",
    name: "Casa en Envigado",
    city: "Envigado",
    department: "Antioquia",
    sector: "residencial",
    model: "EPC",
    kwp: 6.6,
    monthlySavingsCop: null,
    paybackYears: 3.5,
    image: img("residencial-casa-envigado"),
    imageAlt: "Paneles solares de 6,6 kWp en la cubierta de una casa en Envigado",
  },
  {
    slug: "casa-rionegro-2",
    name: "Vivienda en Rionegro",
    city: "Rionegro",
    department: "Antioquia",
    sector: "residencial",
    model: "EPC",
    kwp: 5.8,
    monthlySavingsCop: null,
    paybackYears: 2.8,
    image: img("residencial-casa-rionegro-2"),
    imageAlt: "Paneles solares de 5,8 kWp sobre la cubierta de una vivienda en Rionegro",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Solo los proyectos con ahorro documentado o con historia propia tienen ficha individual;
    los demás aparecen en el listado (una ficha con solo dos cifras sería una página delgada). */
export function hasProjectPage(p: Project) {
  return p.monthlySavingsCop !== null || Boolean(p.summary);
}

/** Lugar para mostrar: "Itagüí, Antioquia", o solo uno si coinciden. */
export function projectPlace(p: Project) {
  return p.city === p.department ? p.city : `${p.city}, ${p.department}`;
}

/** Cifras agregadas del portafolio (barra de confianza del home). */
export function portfolioStats(list: Project[] = projects) {
  const paybacks = list.map((p) => p.paybackYears).filter((y): y is number => y !== null);
  const withSavings = list.filter((p) => p.monthlySavingsCop !== null);
  return {
    projects: list.length,
    kwp: list.reduce((sum, p) => sum + p.kwp, 0),
    monthlySavingsCop: withSavings.reduce((sum, p) => sum + (p.monthlySavingsCop ?? 0), 0),
    projectsWithSavings: withSavings.length,
    paybackMin: Math.min(...paybacks),
    paybackMax: Math.max(...paybacks),
  };
}

/** Totales del portafolio PPA (página de PPA). */
export function ppaStats(list: Project[] = projects) {
  const ppa = list.filter((p) => p.model === "PPA");
  return {
    projects: ppa.length,
    kwp: ppa.reduce((s, p) => s + p.kwp, 0),
    monthlySavingsCop: ppa.reduce((s, p) => s + (p.monthlySavingsCop ?? 0), 0),
  };
}
