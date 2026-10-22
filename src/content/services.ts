// Modelos de negocio. Descripciones base: /servicios/ del sitio actual (audit/site-copy.json).
import type { Faq } from "@/content/faq";

export type ServiceKey = "ppa" | "epc" | "gestion-de-plantas";

export type Service = {
  key: ServiceKey;
  name: string;
  shortName: string;
  path: string;
  tagline: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Métrica destacada en la tarjeta (estilo "producto financiero"). */
  highlight: { label: string; value: string };
  terms: { label: string; value: string }[];
  includes: string[];
  idealFor: string[];
  caseSlug?: string;
  faqs: Faq[];
};

export const services: Service[] = [
  {
    key: "ppa",
    name: "PPA · Compra de energía",
    shortName: "PPA",
    path: "/servicios/ppa/",
    tagline: "Energía solar sin invertir un peso",
    summary: "Instalamos y financiamos la planta en tu techo. Tú solo pagas la energía que consumes, más barata que la del operador de red.",
    description:
      "El PPA (Power Purchase Agreement) es un contrato de compra de energía: Solartech diseña, financia, instala, opera y mantiene la planta solar en tu propiedad. Tú no inviertes en equipos; firmas un contrato de largo plazo para comprar la energía que produce a un precio por kWh inferior a la tarifa de la red.",
    image: "/images/proyectos/caso-ppa-edificio-plex-medellin.webp",
    imageAlt: "Planta solar bajo modelo PPA en la terraza del Edificio Plex, Medellín",
    highlight: { label: "Inversión inicial", value: "$0" },
    terms: [
      { label: "Inversión", value: "$0" },
      { label: "Precio del kWh", value: "Hasta 35 % menos que la red" },
      { label: "Plazo típico", value: "10 a 15 años" },
      { label: "Mantenimiento", value: "Incluido, costo $0" },
      { label: "Riesgo de obsolescencia", value: "Cero para ti" },
    ],
    includes: [
      "Estudio de consumo y diseño del sistema",
      "Financiación total de equipos e instalación",
      "Trámites ante el operador de red y certificación RETIE",
      "Monitoreo, limpieza y mantenimiento durante el contrato",
      "Factura mensual solo por la energía solar consumida",
    ],
    idealFor: ["Empresas que prefieren no comprometer caja", "Copropiedades y edificios", "Clientes con consumo estable durante el día"],
    caseSlug: "edificio-plex",
    faqs: [
      {
        q: "¿Qué pasa con la planta al terminar el contrato PPA?",
        a: "Al finalizar el plazo se acuerda la renovación del contrato, la transferencia del sistema al cliente o su retiro, según lo pactado desde el inicio.",
      },
      {
        q: "¿Quién se encarga del mantenimiento en un PPA?",
        a: "Solartech. Durante todo el contrato operamos, monitoreamos y mantenemos la planta para garantizar su producción.",
      },
      {
        q: "¿Necesito un consumo mínimo para acceder a un PPA?",
        a: "El modelo PPA está pensado para empresas y copropiedades con consumos medios o altos. Con tu factura evaluamos si aplica en tu caso.",
      },
    ],
  },
  {
    key: "epc",
    name: "EPC · Llave en mano",
    shortName: "EPC",
    path: "/servicios/epc/",
    tagline: "Tu planta solar propia, llave en mano",
    summary: "Diseñamos, suministramos y construimos tu sistema solar. Al terminar, la planta es tuya y el ahorro es 100 % tuyo.",
    description:
      "En el modelo EPC (Engineering, Procurement and Construction) Solartech se encarga de todo el proyecto: ingeniería, suministro de equipos, construcción, trámites y puesta en marcha. Al finalizar, el cliente es propietario del sistema, recibe todo el ahorro en su factura y puede acceder a los beneficios tributarios de la Ley 1715.",
    image: "/images/proyectos/caso-epc-caribe-motor-aerea.webp",
    imageAlt: "Vista aérea de la planta solar EPC de Caribe Motor en Medellín",
    highlight: { label: "Retorno de la inversión", value: "2,7–4 años" },
    terms: [
      { label: "Propiedad del sistema", value: "Tuya desde el primer día" },
      { label: "Retorno", value: "2,7 a 4 años" },
      { label: "Beneficio tributario", value: "Deducción del 50 % en renta" },
      { label: "Activo", value: "Se valoriza con tu inmueble" },
      { label: "Garantía de paneles", value: "15 años" },
    ],
    includes: [
      "Visita técnica y análisis de factura",
      "Ingeniería y diseño del sistema",
      "Suministro de paneles, inversores y estructura de nuestras marcas aliadas, con distribución directa",
      "Construcción, certificación RETIE y conexión con el operador de red",
      "Acompañamiento para acceder a los incentivos de la Ley 1715",
      "Opciones de financiación con banca aliada",
    ],
    idealFor: ["Empresas que buscan la máxima rentabilidad", "Declarantes de renta que aprovechan el beneficio tributario", "Agro, industria y comercio con techos o terreno disponible"],
    caseSlug: "caribe-motor",
    faqs: [
      {
        q: "¿Cuánto tarda la construcción de un proyecto EPC?",
        a: "Depende del tamaño del sistema y de los trámites con el operador de red. Nuestros proyectos han tomado entre 4 y 10 meses desde el diseño hasta la puesta en operación.",
      },
      {
        q: "¿Puedo financiar un proyecto EPC?",
        a: "Sí. Puedes pagarlo con leasing en cuotas mensuales, sin un gran desembolso inicial y conservando los beneficios tributarios. Trabajamos con Bancolombia, Davivienda y Banco de Bogotá.",
      },
      {
        q: "¿Qué garantía tienen los equipos?",
        a: "Los paneles tienen 15 años de garantía y conservan cerca del 86 % de su eficiencia a los 25 años. La garantía de los inversores depende del fabricante.",
      },
    ],
  },
  {
    key: "gestion-de-plantas",
    name: "Gestión de plantas · O&M",
    shortName: "Gestión de plantas",
    path: "/servicios/gestion-de-plantas/",
    tagline: "Tu planta produciendo al máximo, siempre",
    summary: "Monitoreo, limpieza y mantenimiento preventivo y correctivo para que tu sistema solar entregue el retorno prometido.",
    description:
      "La gestión de plantas solares (O&M) es la operación y el mantenimiento de sistemas fotovoltaicos. Nos encargamos de la administración técnica: monitoreo remoto de la producción, limpieza de paneles, revisión de inversores, protecciones, estructura y cableado, y atención de fallas. Aplica para plantas construidas por Solartech o por terceros.",
    image: "/images/proyectos/caso-gestion-plantas-mantenimiento.webp",
    imageAlt: "Técnico de Solartech realizando mantenimiento a paneles solares",
    highlight: { label: "Producción garantizada", value: "Monitoreo 24/7" },
    terms: [
      { label: "Monitoreo", value: "Remoto y continuo" },
      { label: "Mantenimiento", value: "Preventivo y correctivo" },
      { label: "Frecuencia", value: "Según el plan" },
      { label: "Aplica a", value: "Plantas propias o de terceros" },
    ],
    includes: [
      "Monitoreo remoto de producción y alarmas",
      "Limpieza de paneles",
      "Inspección de inversores, caja de protecciones, estructura y cableado",
      "Cambio de marcación y ajustes de conexiones",
      "Informe técnico de cada visita",
    ],
    idealFor: ["Dueños de plantas solares de cualquier tamaño", "Plantas instaladas por terceros sin soporte", "Inversionistas que necesitan asegurar su retorno"],
    faqs: [
      {
        q: "¿Cada cuánto se debe hacer mantenimiento a una planta solar?",
        a: "La primera revisión se recomienda a los 6 meses de la instalación; luego, en general, una revisión anual y limpiezas según el nivel de polvo de la zona.",
      },
      {
        q: "¿Atienden plantas que no instaló Solartech?",
        a: "Sí. Hacemos un diagnóstico inicial y te proponemos un plan de operación y mantenimiento.",
      },
    ],
  },
];

export function getService(key: ServiceKey) {
  return services.find((s) => s.key === key)!;
}

/** Proceso de trabajo (home y páginas de servicio). */
export const processSteps = [
  { title: "Análisis de tu factura", text: "Revisamos tu consumo y tarifa para dimensionar el sistema y estimar el ahorro." },
  { title: "Visita técnica", text: "Evaluamos techo o terreno, sombras, estructura y conexión eléctrica." },
  { title: "Propuesta financiera", text: "Te presentamos inversión, ahorro, retorno y beneficio tributario, en EPC o PPA." },
  { title: "Instalación", text: "Construimos, certificamos RETIE y gestionamos la conexión con el operador de red." },
  { title: "Monitoreo", text: "Seguimos la producción y mantenemos la planta para asegurar tu retorno." },
];

/** Pilares de la propuesta de valor (sitio actual). */
export const pillars = [
  { title: "Rentables", text: "Proyectos con retorno de 3 a 4 años y múltiples alternativas de financiación." },
  { title: "Beneficios tributarios", text: "Deducción en renta, exclusión de IVA y depreciación acelerada por la Ley 1715." },
  { title: "Bajo mantenimiento", text: "Equipos muy confiables, con vida útil superior a 25 años." },
  { title: "Sostenibles", text: "Energía limpia que reduce tu huella de carbono y tu dependencia de la red." },
];
