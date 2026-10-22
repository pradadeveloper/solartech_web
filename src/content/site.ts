// Datos globales de la empresa. Fuente: audit/site-copy.json (sitio WordPress, oct-2026).

export const site = {
  name: "Solartech",
  legalName: "Solartech Energy Systems",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://solartechenergy.co",
  tagline: "Expertos en proyectos de energía solar",
  description:
    "Diseñamos, construimos y operamos sistemas de energía solar para empresas, agro y hogares en Colombia. Modelos PPA sin inversión, EPC llave en mano y gestión de plantas.",
  parent: { name: "Ferragro", url: "https://www.ferragro.com" },
  locale: "es_CO",
  contact: {
    phoneDisplay: "+57 310 258 7657",
    phone: "+573102587657",
    whatsapp: "573102587657",
    email: "muribec@ferragro.com",
    address: {
      street: "Carrera 42 # 51-34, Barrio Santa Cruz",
      city: "Itagüí",
      region: "Antioquia",
      postalCode: "055412",
      country: "CO",
    },
    // TODO: confirmar coordenadas exactas y horario con Solartech (no publicados en el sitio actual).
    geo: { lat: 6.1719, lng: -75.6114 },
    hours: [{ days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:30" }],
  },
  social: {
    instagram: "https://www.instagram.com/solartechenergy.co/",
    linkedin: "https://www.linkedin.com/company/solartechlatam/",
    facebook: "https://www.facebook.com/profile.php?id=61569699247436",
  },
  equipmentStore: "https://www.ferragro.com/collections/solartech",
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-WVZQJV4W",
  // Cifras institucionales publicadas en /quienes-somos/ del sitio actual.
  claims: { yearsExperience: 10, installedKwpTotal: 5000 },
} as const;

export const whatsappDefaultMessage =
  "Hola Solartech. Vengo desde la página web y quiero información para mi proyecto solar.";

export function whatsappUrl(message: string = whatsappDefaultMessage) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
  children?: NavItem[];
};

export const mainNav: NavItem[] = [
  {
    label: "Servicios",
    href: "/servicios/",
    children: [
      { label: "PPA · Energía sin inversión", href: "/servicios/ppa/", description: "Paga solo la energía que consumes, con descuento sobre tu tarifa." },
      { label: "EPC · Llave en mano", href: "/servicios/epc/", description: "Diseño, ingeniería y construcción. El sistema es tuyo." },
      { label: "Gestión de plantas", href: "/servicios/gestion-de-plantas/", description: "Operación, monitoreo y mantenimiento (O&M)." },
    ],
  },
  {
    label: "Soluciones",
    href: "/soluciones/",
    children: [
      { label: "Empresas e industria", href: "/soluciones/empresas/", description: "Reduce el costo energético de tu operación." },
      { label: "Agro", href: "/soluciones/agro/", description: "Fincas, riego, bombeo y cuartos fríos." },
      { label: "Hogares", href: "/soluciones/hogares/", description: "Energía solar para tu casa." },
      { label: "Híbridos y baterías", href: "/soluciones/sistemas-hibridos-baterias/", description: "Respaldo ante cortes y red inestable." },
    ],
  },
  { label: "Proyectos", href: "/proyectos/" },
  { label: "Beneficios tributarios", href: "/beneficios-tributarios/" },
  { label: "Blog", href: "/blog/" },
  { label: "Venta de equipos", href: site.equipmentStore, external: true },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Servicios",
    items: [
      { label: "PPA", href: "/servicios/ppa/" },
      { label: "EPC llave en mano", href: "/servicios/epc/" },
      { label: "Gestión de plantas", href: "/servicios/gestion-de-plantas/" },
      { label: "Venta de equipos", href: site.equipmentStore, external: true },
    ],
  },
  {
    title: "Recursos",
    items: [
      { label: "Cotizador", href: "/cotizador/" },
      { label: "Calculadora de ahorro", href: "/calculadora-ahorro/" },
      { label: "Beneficios tributarios", href: "/beneficios-tributarios/" },
      { label: "Proyectos", href: "/proyectos/" },
      { label: "Energía solar por ciudad", href: "/energia-solar-en/" },
      { label: "Blog", href: "/blog/" },
      { label: "Preguntas frecuentes", href: "/preguntas-frecuentes/" },
    ],
  },
  {
    title: "Compañía",
    items: [
      { label: "Quiénes somos", href: "/quienes-somos/" },
      { label: "Contacto", href: "/contacto/" },
      { label: "Política de privacidad", href: "/politica-de-privacidad/" },
      { label: "Términos y condiciones", href: "/terminos/" },
    ],
  },
];
