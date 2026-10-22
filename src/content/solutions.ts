// Soluciones por segmento (/soluciones/[segmento]/). Las cifras salen de projects.ts y services.ts;
// aquí no se agregan precios ni casos nuevos.
import type { Faq } from "@/content/faq";
import type { ServiceKey } from "@/content/services";

export type SolutionSlug = "empresas" | "agro" | "hogares" | "sistemas-hibridos-baterias";

export type Solution = {
  slug: SolutionSlug;
  name: string;
  path: string;
  seo: { title: string; description: string };
  eyebrow: string;
  h1: string;
  intro: string;
  image: string;
  imageAlt: string;
  pains: { title: string; text: string }[];
  benefits: { title: string; text: string }[];
  /** Usos típicos del segmento (riego, cuartos fríos…). */
  useCases: string[];
  models: ServiceKey[];
  projectSlugs: string[];
  whatsappMessage: string;
  faqs: Faq[];
};

export const solutions: Solution[] = [
  {
    slug: "empresas",
    name: "Empresas e industria",
    path: "/soluciones/empresas/",
    seo: {
      title: "Paneles solares para empresas en Colombia",
      description: "Paneles solares para empresas e industria: reduce tu factura de energía con retorno de 3 a 4 años y beneficios tributarios. Calcula tu ahorro.",
    },
    eyebrow: "Empresas e industria",
    h1: "Paneles solares para empresas que quieren bajar su costo de energía",
    intro:
      "La energía es uno de los costos operativos que más crece. Con una planta solar en tu cubierta conviertes ese gasto en un activo que produce durante más de 25 años y se paga en 3 a 4 años.",
    image: "/images/proyectos/proyecto-absorbentes-de-colombia-cartagena.webp",
    imageAlt: "Planta solar industrial de 540 kWp en la cubierta de Absorbentes de Colombia, Cartagena",
    pains: [
      { title: "Tarifas al alza", text: "El costo del kWh sube año tras año y presiona los márgenes de tu operación." },
      { title: "Costo poco predecible", text: "La factura de energía varía y complica la planeación financiera." },
      { title: "Metas de sostenibilidad", text: "Clientes e inversionistas exigen reducir la huella de carbono." },
    ],
    benefits: [
      { title: "Ahorro desde el primer mes", text: "La energía que generas deja de comprarse a la red, en las horas de mayor consumo de tu planta." },
      { title: "Beneficios tributarios", text: "Deducción del 50 % de la inversión en renta, exclusión de IVA y depreciación acelerada (Ley 1715)." },
      { title: "Con o sin inversión", text: "Compra tu planta llave en mano (EPC) o paga solo la energía con descuento (PPA)." },
      { title: "Activo de largo plazo", text: "Los paneles operan más de 25 años con un mantenimiento mínimo." },
    ],
    useCases: ["Plantas de producción", "Bodegas y centros logísticos", "Concesionarios y comercio", "Edificios corporativos"],
    models: ["epc", "ppa", "gestion-de-plantas"],
    projectSlugs: ["absorbentes-de-colombia", "rotoplast", "plastired"],
    whatsappMessage: "Hola Solartech. Quiero información sobre paneles solares para mi empresa.",
    faqs: [
      {
        q: "¿Cuánto puede ahorrar mi empresa con paneles solares?",
        a: "Depende de tu consumo, tu tarifa y la radiación de tu zona. Nuestros proyectos empresariales ahorran entre $9,5 y $55 millones al mes. Con tu factura te damos una estimación en minutos.",
      },
      {
        q: "¿Mi empresa puede acceder a los beneficios de la Ley 1715?",
        a: "Si eres declarante de renta e inviertes en el sistema (modelo EPC), puedes deducir el 50 % de la inversión, además de la exclusión de IVA y la depreciación acelerada, con la certificación de la UPME.",
      },
      {
        q: "¿Qué pasa con la operación durante la instalación?",
        a: "Planeamos la obra para no interrumpir tu operación. La conexión final se coordina en una ventana corta acordada contigo.",
      },
      {
        q: "¿Puedo tener paneles solares si no quiero invertir?",
        a: "Sí. Con el modelo PPA, Solartech financia e instala la planta y tú pagas solo la energía, con un descuento sobre tu tarifa actual.",
      },
    ],
  },
  {
    slug: "agro",
    name: "Agro",
    path: "/soluciones/agro/",
    seo: {
      title: "Paneles solares para fincas y proyectos agro",
      description: "Paneles solares para fincas: energía para riego, bombeo y cuartos fríos con retorno de 3 a 4 años. Proyectos reales en Antioquia y Córdoba. Cotiza.",
    },
    eyebrow: "Agro",
    h1: "Paneles solares para fincas y proyectos agroindustriales",
    intro:
      "Riego, bombeo, cuartos fríos y procesos de poscosecha consumen energía todo el día, justo cuando el sol produce más. Una planta solar reduce tu costo por unidad producida y tu dependencia de redes rurales inestables.",
    image: "/images/proyectos/proyecto-safer-agrobiologicos-san-pedro.webp",
    imageAlt: "Planta solar de 135 kWp de Safer Agrobiológicos en San Pedro de los Milagros, Antioquia",
    pains: [
      { title: "Red rural inestable", text: "Cortes y variaciones de voltaje que afectan bombas, motores y refrigeración." },
      { title: "Dependencia del diésel", text: "Plantas de respaldo con combustible costoso y mantenimiento frecuente." },
      { title: "Costo energético alto", text: "Riego y frío representan una parte importante del costo de producción." },
    ],
    benefits: [
      { title: "Energía cuando más la necesitas", text: "La producción solar coincide con las horas de riego, bombeo y mayor carga de frío." },
      { title: "Menos diésel", text: "Reduce el uso de plantas eléctricas y su costo de combustible." },
      { title: "Respaldo con baterías", text: "Opcionalmente, almacena energía para mantener la operación ante cortes." },
      { title: "Rentabilidad comprobada", text: "Nuestros proyectos agro recuperan la inversión en 2,8 a 4 años." },
    ],
    useCases: ["Riego y bombeo solar", "Cuartos fríos y poscosecha", "Invernaderos y laboratorios", "Plantas de procesamiento"],
    models: ["epc", "ppa", "gestion-de-plantas"],
    projectSlugs: ["agricolas-unidas", "agroindefuturo", "finca-ganadera-dorada"],
    whatsappMessage: "Hola Solartech. Quiero información sobre energía solar para mi finca.",
    faqs: [
      {
        q: "¿Se puede instalar una planta solar en una finca sin techo adecuado?",
        a: "Sí. Si la cubierta no es apta, el sistema puede instalarse en suelo con estructura propia. Lo evaluamos en la visita técnica.",
      },
      {
        q: "¿Los paneles solares sirven para bombeo y riego?",
        a: "Sí. El bombeo solar es uno de los usos más rentables porque el consumo coincide con las horas de sol.",
      },
      {
        q: "¿Qué pasa si se va la luz en la finca?",
        a: "Un sistema conectado a la red se apaga por seguridad durante un corte. Si necesitas respaldo, diseñamos un sistema híbrido con baterías.",
      },
    ],
  },
  {
    slug: "hogares",
    name: "Hogares",
    path: "/soluciones/hogares/",
    seo: {
      title: "Paneles solares para casa y copropiedades",
      description: "Paneles solares para casa y conjuntos residenciales en Colombia: baja tu factura de energía con un sistema a tu medida. Calcula tu ahorro gratis.",
    },
    eyebrow: "Hogares y copropiedades",
    h1: "Paneles solares para tu casa o tu conjunto residencial",
    intro:
      "Genera tu propia energía y reduce la factura de tu hogar con un sistema diseñado a tu consumo. Para edificios y conjuntos, el modelo PPA permite ahorrar en las zonas comunes sin que la copropiedad invierta.",
    image: "/images/secciones/beneficio-alta-rentabilidad-casas.webp",
    imageAlt: "Vista aérea de casas con paneles solares en sus techos",
    pains: [
      { title: "Factura en aumento", text: "El valor del kWh residencial sube y pesa cada vez más en el presupuesto del hogar." },
      { title: "Zonas comunes costosas", text: "Ascensores, bombas e iluminación elevan la cuota de administración." },
      { title: "Cortes de energía", text: "En algunas zonas los cortes afectan el día a día de la familia." },
    ],
    benefits: [
      { title: "Menor factura", text: "La energía que generas reduce lo que compras a la red cada mes." },
      { title: "Copropiedades sin inversión", text: "Con PPA, el edificio paga la energía solar con descuento sobre su tarifa." },
      { title: "Respaldo opcional", text: "Agrega baterías para mantener lo esencial encendido durante un corte." },
      { title: "Bajo mantenimiento", text: "Una limpieza periódica y una revisión anual bastan para mantener el sistema." },
    ],
    useCases: ["Casas y fincas de recreo", "Edificios y conjuntos residenciales", "Zonas comunes y bombas de agua", "Respaldo para equipos esenciales"],
    models: ["epc", "ppa", "gestion-de-plantas"],
    projectSlugs: ["ph-entre-parques", "casa-medellin", "casa-la-ceja"],
    whatsappMessage: "Hola Solartech. Quiero información sobre paneles solares para mi casa.",
    faqs: [
      {
        q: "¿Vale la pena instalar paneles solares en una casa?",
        a: "Depende de tu consumo y del espacio disponible en el techo. Con tu factura calculamos el tamaño del sistema y el ahorro esperado.",
      },
      {
        q: "¿Un conjunto residencial puede tener paneles solares sin invertir?",
        a: "Sí. Con el modelo PPA, Solartech instala la planta y la copropiedad compra la energía a un precio menor que el de la red, como en el Edificio Plex de Medellín.",
      },
      {
        q: "¿Dónde puedo comprar equipos solares?",
        a: "Si prefieres comprar paneles, inversores o baterías por tu cuenta, los encuentras en la tienda de Ferragro, nuestra compañía del grupo.",
      },
    ],
  },
  {
    slug: "sistemas-hibridos-baterias",
    name: "Híbridos y baterías",
    path: "/soluciones/sistemas-hibridos-baterias/",
    seo: {
      title: "Sistema solar híbrido con baterías en Colombia",
      description: "Sistema solar híbrido con baterías: respaldo ante cortes, red inestable y menos diésel. Diseñamos tu sistema a la medida. Habla con un asesor.",
    },
    eyebrow: "Híbridos y baterías",
    h1: "Sistemas solares híbridos con baterías para no quedarte sin energía",
    intro:
      "Un sistema híbrido combina paneles solares, baterías y la red eléctrica. Ahorras con la energía del sol y, cuando hay un corte, las baterías mantienen encendidas tus cargas críticas.",
    image: "/images/proyectos/dron-planta-solar-dji-0537.webp",
    imageAlt: "Vista aérea de una planta solar instalada por Solartech",
    pains: [
      { title: "Cortes frecuentes", text: "Interrupciones que detienen la producción, afectan equipos o echan a perder mercancía refrigerada." },
      { title: "Red inestable", text: "Variaciones de voltaje en zonas rurales o al final de la línea de distribución." },
      { title: "Generadores diésel", text: "Combustible costoso, ruido, emisiones y mantenimiento constante." },
    ],
    benefits: [
      { title: "Respaldo automático", text: "Ante un corte, las baterías alimentan tus cargas críticas sin intervención manual." },
      { title: "Ahorro diario", text: "Los paneles reducen tu factura todos los días, haya o no cortes." },
      { title: "Menos diésel", text: "Reduce o reemplaza el uso del generador como respaldo principal." },
      { title: "Diseño a la medida", text: "Dimensionamos las baterías según las cargas que necesitas respaldar y por cuántas horas." },
    ],
    useCases: ["Cuartos fríos y cadena de frío", "Servidores, comunicaciones y seguridad", "Fincas con red rural inestable", "Hogares con equipos esenciales"],
    models: ["epc", "gestion-de-plantas"],
    projectSlugs: [],
    whatsappMessage: "Hola Solartech. Quiero información sobre un sistema solar híbrido con baterías.",
    faqs: [
      {
        q: "¿Cuál es la diferencia entre un sistema on-grid y uno híbrido?",
        a: "El on-grid está conectado a la red y no tiene baterías: ahorra, pero se apaga durante un corte. El híbrido suma baterías para respaldar tus cargas cuando la red falla.",
      },
      {
        q: "¿Cuánto tiempo de respaldo dan las baterías?",
        a: "Depende de la capacidad instalada y de las cargas conectadas. Diseñamos el banco de baterías según las horas de autonomía que necesitas.",
      },
      {
        q: "¿Un sistema híbrido puede reemplazar mi planta diésel?",
        a: "En muchos casos puede reducir su uso o reemplazarla para cargas críticas. Lo evaluamos con tu perfil de consumo y la frecuencia de los cortes.",
      },
    ],
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}
