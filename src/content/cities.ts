// Landings de SEO local (/energia-solar-en/<ciudad>/). Cada ciudad lleva contenido propio:
// radiación de la tabla del cotizador, operador de red, proyectos cercanos y FAQ local.
// Las cifras de producción y ahorro se calculan con el motor (src/lib/quote-engine.ts).
import type { Faq } from "@/content/faq";

export type City = {
  slug: string;
  name: string;
  departamento: string;
  /** Municipio tal como aparece en src/content/hsp-colombia.json. */
  municipio: string;
  operator: { name: string; url: string };
  /** Slugs de proyectos de la ciudad o la región, del más cercano al más lejano. */
  projectSlugs: string[];
  projectsLabel: string;
  intro: string;
  context: { title: string; text: string }[];
  faqs: Faq[];
  metaTitle: string;
  metaDescription: string;
};

export const cities: City[] = [
  {
    slug: "medellin",
    name: "Medellín",
    departamento: "Antioquia",
    municipio: "Medellín",
    operator: { name: "EPM", url: "https://www.epm.com.co" },
    projectSlugs: ["caribe-motor", "templamos", "edificio-plex"],
    projectsLabel: "Proyectos en Medellín",
    intro:
      "Medellín es la ciudad donde más plantas solares hemos construido: un concesionario, una planta industrial y un edificio residencial ya producen su propia energía. Aunque el valle de Aburrá recibe menos sol que la costa, la tarifa de energía hace que los proyectos se paguen en 3 a 3,6 años.",
    context: [
      {
        title: "Menos sol que la costa, igual de rentable",
        text: "La nubosidad del valle de Aburrá deja una radiación menor que en el Caribe, pero la tarifa comercial e industrial compensa: Caribe Motor recupera su inversión en 3,6 años y Templamos en 3 años.",
      },
      {
        title: "Edificios y copropiedades sin invertir",
        text: "En una ciudad vertical, muchas cubiertas son de copropiedades. El Edificio Plex instaló 45,65 kWp bajo modelo PPA: no invirtió y compra la energía solar un 35 % más barata que la del operador de red.",
      },
      {
        title: "Conexión con EPM",
        text: "Los sistemas de autogeneración se conectan a la red de EPM con una solicitud regulada por la CREG (Resolución 174 de 2021). Nosotros hacemos el trámite y la certificación RETIE.",
      },
    ],
    faqs: [
      {
        q: "¿Vale la pena la energía solar en Medellín si hay muchos días nublados?",
        a: "Sí. Los paneles siguen generando con nubes, y el diseño usa la radiación promedio real del año. Nuestros proyectos en Medellín recuperan la inversión entre 3 y 3,6 años.",
      },
      {
        q: "¿Quién es el operador de red en Medellín?",
        a: "EPM. Para conectar una planta solar se presenta la solicitud de conexión ante EPM, según la regulación de la CREG para autogeneradores. Solartech se encarga del trámite.",
      },
      {
        q: "¿Un edificio residencial en Medellín puede tener paneles solares sin invertir?",
        a: "Sí, con un PPA. Instalamos la planta en la cubierta y la copropiedad paga solo la energía solar, con descuento sobre la tarifa. Es el caso del Edificio Plex.",
      },
    ],
    metaTitle: "Paneles solares en Medellín para empresas",
    metaDescription: "Energía solar en Medellín: proyectos reales con retorno de 3 a 3,6 años, conexión con EPM y modelo PPA sin inversión. Calcula tu ahorro gratis.",
  },
  {
    slug: "itagui",
    name: "Itagüí",
    departamento: "Antioquia",
    municipio: "Itagüí",
    operator: { name: "EPM", url: "https://www.epm.com.co" },
    projectSlugs: ["templamos", "caribe-motor", "edificio-plex"],
    projectsLabel: "Proyectos en el valle de Aburrá",
    intro:
      "Itagüí es nuestra casa: la sede de Solartech y del grupo Ferragro está en el barrio Santa Cruz. Para las empresas e industrias del municipio, eso significa visitas técnicas rápidas y un equipo de mantenimiento a pocos minutos.",
    context: [
      {
        title: "Un municipio industrial",
        text: "Las cubiertas de bodegas, talleres y plantas industriales de Itagüí son ideales para paneles solares: grandes, despejadas y con consumo durante el día, justo cuando el sistema produce.",
      },
      {
        title: "Atención desde nuestra sede",
        text: "Nuestra oficina queda en la Carrera 42 # 51-34. La visita técnica, la instalación y el mantenimiento se coordinan desde aquí, sin desplazamientos largos.",
      },
      {
        title: "La misma red y la misma radiación del valle",
        text: "Itagüí comparte con Medellín el operador de red, EPM, y una radiación similar. Por eso las cifras de nuestros proyectos en Medellín son la mejor referencia para tu empresa.",
      },
    ],
    faqs: [
      {
        q: "¿Dónde queda la oficina de Solartech en Itagüí?",
        a: "En la Carrera 42 # 51-34, barrio Santa Cruz, Itagüí, Antioquia. Allí está también el grupo Ferragro.",
      },
      {
        q: "¿Cuánto tarda la visita técnica en Itagüí?",
        a: "Como estamos en el mismo municipio, la coordinamos con prioridad. Agéndala por WhatsApp después de calcular tu ahorro en el cotizador.",
      },
      {
        q: "¿Quién es el operador de red en Itagüí?",
        a: "EPM. Solartech tramita la solicitud de conexión de tu planta solar y la certificación RETIE.",
      },
    ],
    metaTitle: "Paneles solares en Itagüí: empresas e industria",
    metaDescription: "Energía solar en Itagüí con la sede de Solartech a minutos de tu empresa. Plantas para industria y comercio, conexión con EPM. Calcula tu ahorro.",
  },
  {
    slug: "rionegro",
    name: "Rionegro",
    departamento: "Antioquia",
    municipio: "Rionegro",
    operator: { name: "EPM", url: "https://www.epm.com.co" },
    projectSlugs: ["safer-agrobiologicos", "agricolas-unidas", "caribe-motor"],
    projectsLabel: "Proyectos en Antioquia",
    intro:
      "Rionegro y el Oriente antioqueño reciben más radiación que el valle de Aburrá, y su mezcla de parques industriales, comercio y agroindustria tiene el perfil de consumo ideal para la energía solar.",
    context: [
      {
        title: "Más sol que Medellín",
        text: "Según la tabla de radiación de nuestro cotizador, Rionegro recibe 3,8 horas de sol pico al día frente a 3,5 en Medellín: cada kWp instalado produce cerca de un 9 % más energía al año.",
      },
      {
        title: "Industria, logística y agro",
        text: "Bodegas, plantas industriales, invernaderos y cuartos fríos consumen energía de día. Nuestros proyectos agro en Antioquia, como Safer Agrobiológicos, recuperan la inversión en 3,2 a 3,3 años.",
      },
      {
        title: "Conexión con EPM",
        text: "Rionegro está en la zona de EPM. Hacemos la solicitud de conexión de tu planta y la certificación RETIE.",
      },
    ],
    faqs: [
      {
        q: "¿Cuánta energía produce un sistema solar en Rionegro?",
        a: "Con 3,8 horas de sol pico al día, cada kWp produce alrededor de 1.390 kWh al año. Un sistema de 100 kWp genera unos 11.500 kWh al mes.",
      },
      {
        q: "¿Sirven los paneles solares para invernaderos y cuartos fríos?",
        a: "Sí. Son cargas que consumen durante el día, cuando la planta produce. Revisa nuestras soluciones para el agro y calcula tu ahorro con tu factura.",
      },
      {
        q: "¿Quién es el operador de red en Rionegro?",
        a: "EPM. Solartech se encarga del trámite de conexión y de la certificación RETIE.",
      },
    ],
    metaTitle: "Paneles solares en Rionegro y el Oriente",
    metaDescription: "Energía solar en Rionegro: más radiación que Medellín, ideal para industria, logística y agro. Conexión con EPM y retorno de 3 a 4 años. Cotiza gratis.",
  },
  {
    slug: "cartagena",
    name: "Cartagena",
    departamento: "Bolívar",
    municipio: "Cartagena",
    operator: { name: "Afinia", url: "https://www.afinia.com.co" },
    projectSlugs: ["absorbentes-de-colombia"],
    projectsLabel: "Nuestro proyecto en Cartagena",
    intro:
      "Cartagena tiene la radiación más alta de las ciudades donde trabajamos: 4,8 horas de sol pico al día. Allí construimos nuestra planta más grande, de 540 kWp, que le ahorra a Absorbentes de Colombia $55 millones al mes.",
    context: [
      {
        title: "37 % más energía por panel que en Medellín",
        text: "Con 4,8 horas de sol pico frente a 3,5 en Medellín, cada panel instalado en Cartagena produce cerca de un 37 % más energía al año.",
      },
      {
        title: "Diseñado para el ambiente costero",
        text: "La brisa salina exige estructura, tornillería y conexiones resistentes a la corrosión. Las especificamos desde el diseño y las revisamos en cada mantenimiento.",
      },
      {
        title: "Conexión con Afinia",
        text: "En Bolívar el operador de red es Afinia. Gestionamos la solicitud de conexión de tu planta, según la regulación de la CREG para autogeneradores, y la certificación RETIE.",
      },
    ],
    faqs: [
      {
        q: "¿Cuánta energía produce un sistema solar en Cartagena?",
        a: "Con 4,8 horas de sol pico al día, cada kWp produce alrededor de 1.750 kWh al año. Un sistema de 100 kWp genera unos 14.600 kWh al mes.",
      },
      {
        q: "¿El clima de la costa daña los paneles solares?",
        a: "No, si el sistema se diseña para ello. Usamos estructura y tornillería resistentes a la corrosión y un plan de limpieza y revisión periódica.",
      },
      {
        q: "¿Quién es el operador de red en Cartagena?",
        a: "Afinia. Solartech tramita la conexión de tu planta solar y la certificación RETIE.",
      },
    ],
    metaTitle: "Paneles solares en Cartagena para empresas",
    metaDescription: "Energía solar en Cartagena: la radiación más alta, planta de 540 kWp que ahorra $55M al mes y conexión con Afinia. Calcula el ahorro de tu empresa.",
  },
  {
    slug: "pereira",
    name: "Pereira",
    departamento: "Risaralda",
    municipio: "Pereira",
    operator: { name: "Energía de Pereira", url: "https://www.eep.com.co" },
    projectSlugs: ["natural-harvest"],
    projectsLabel: "Nuestro proyecto en Pereira",
    intro:
      "En Pereira construimos la planta solar de Natural Harvest, que ahorra $11,5 millones al mes. La radiación del Eje Cafetero, similar a la del Oriente antioqueño, hace rentables los proyectos para industria, comercio y agroindustria.",
    context: [
      {
        title: "La radiación del Eje Cafetero",
        text: "Pereira recibe 3,8 horas de sol pico al día según la tabla de nuestro cotizador, más que Medellín. Cada kWp produce cerca de 1.390 kWh al año.",
      },
      {
        title: "Agroindustria que consume de día",
        text: "Procesamiento, secado, refrigeración y bombeo concentran su consumo en horas de sol, cuando la planta produce. Natural Harvest recupera su inversión en 3,8 años.",
      },
      {
        title: "Conexión con Energía de Pereira",
        text: "El operador de red en Pereira es Energía de Pereira. Hacemos la solicitud de conexión de tu planta y la certificación RETIE.",
      },
    ],
    faqs: [
      {
        q: "¿Cuánta energía produce un sistema solar en Pereira?",
        a: "Con 3,8 horas de sol pico al día, cada kWp produce alrededor de 1.390 kWh al año. Un sistema de 100 kWp genera unos 11.500 kWh al mes.",
      },
      {
        q: "¿Quién es el operador de red en Pereira?",
        a: "Energía de Pereira. Solartech tramita la conexión de tu planta solar y la certificación RETIE.",
      },
      {
        q: "¿Atienden proyectos en otros municipios del Eje Cafetero?",
        a: "Sí. Calcula tu ahorro con el cotizador eligiendo tu municipio, y coordinamos la visita técnica.",
      },
    ],
    metaTitle: "Paneles solares en Pereira y el Eje Cafetero",
    metaDescription: "Energía solar en Pereira: planta de Natural Harvest que ahorra $11,5M al mes, conexión con Energía de Pereira y retorno de 3 a 4 años. Cotiza gratis.",
  },
  {
    slug: "envigado",
    name: "Envigado",
    departamento: "Antioquia",
    municipio: "Envigado",
    operator: { name: "EPM", url: "https://www.epm.com.co" },
    projectSlugs: ["ph-entre-parques", "edificio-oclock", "edificio-lyon"],
    projectsLabel: "Copropiedades en Envigado que ya ahorran",
    intro:
      "En Envigado están 4 de las 10 copropiedades que operan con nuestro modelo PPA: PH Entre Parques, Edificio O’Clock, Edificio Lyon y Torre Guayacán. Suman cerca de 335 kWp en cubiertas residenciales que hoy producen energía sin que los edificios hayan invertido.",
    context: [
      {
        title: "Edificios que ahorran sin invertir",
        text: "PH Entre Parques (148,6 kWp), Edificio O’Clock (74,2 kWp) y Edificio Lyon (73,12 kWp) ahorran en conjunto más de $18,6 millones al mes en la energía de sus zonas comunes con el modelo PPA.",
      },
      {
        title: "La misma radiación del valle de Aburrá",
        text: "Envigado tiene 3,5 horas de sol pico al día, igual que Medellín: cada kWp produce cerca de 1.280 kWh al año. Por eso las cifras de nuestros proyectos en el valle son la mejor referencia.",
      },
      {
        title: "También para colegios y empresas",
        text: "En Las Palmas instalamos 192 kWp en el parqueadero de The Columbus School. Las cubiertas de parqueaderos, bodegas y sedes educativas son aprovechables cuando el techo principal no alcanza.",
      },
    ],
    faqs: [
      {
        q: "¿Una copropiedad en Envigado puede tener paneles solares sin invertir?",
        a: "Sí, con un PPA. Instalamos la planta en la cubierta y la copropiedad paga solo la energía solar que consume, con descuento sobre la tarifa. Así operan PH Entre Parques, Edificio O’Clock, Edificio Lyon y Torre Guayacán.",
      },
      {
        q: "¿Qué tiene que aprobar la asamblea para un PPA?",
        a: "El uso de la cubierta y la firma del contrato de compra de energía a largo plazo. Te acompañamos con la propuesta técnica y financiera para presentarla a la administración y a la asamblea.",
      },
      {
        q: "¿Quién es el operador de red en Envigado?",
        a: "EPM. Solartech tramita la conexión de la planta, el medidor bidireccional y la certificación RETIE.",
      },
    ],
    metaTitle: "Paneles solares en Envigado: PPA y empresas",
    metaDescription: "Energía solar en Envigado: 4 copropiedades ya ahorran sin invertir con nuestro modelo PPA. Edificios, colegios y empresas. Calcula tu ahorro gratis.",
  },
  {
    slug: "bogota",
    name: "Bogotá",
    departamento: "Bogotá D.C.",
    municipio: "Bogotá",
    operator: { name: "Enel Colombia", url: "https://www.enel.com.co" },
    projectSlugs: ["absorbentes-de-colombia", "caribe-motor", "ph-entre-parques"],
    projectsLabel: "Algunos de nuestros proyectos en Colombia",
    intro:
      "Bogotá recibe menos sol que el resto de las ciudades donde trabajamos: 3,0 horas de sol pico al día según la tabla de nuestro cotizador. Aun así, para empresas con consumo diurno y cubiertas amplias, una planta solar puede reducir de forma importante la factura de energía.",
    context: [
      {
        title: "Menos radiación, cálculo más cuidadoso",
        text: "Con 3,0 horas de sol pico, cada kWp produce cerca de 1.095 kWh al año, alrededor de 14 % menos que en Medellín. Por eso dimensionamos con tu consumo real y tu tarifa antes de proponer un sistema.",
      },
      {
        title: "El frío no es un problema",
        text: "Lo que reduce la producción en Bogotá es la nubosidad, no la temperatura: los paneles trabajan con mejor eficiencia en climas fríos que en climas calientes.",
      },
      {
        title: "Conexión con Enel Colombia",
        text: "En Bogotá el operador de red es Enel Colombia. Gestionamos la solicitud de conexión de tu planta según la regulación de la CREG para autogeneradores, y la certificación RETIE.",
      },
    ],
    faqs: [
      {
        q: "¿Vale la pena la energía solar en Bogotá?",
        a: "Depende de tu consumo, tu tarifa y el área disponible. Un sistema de 100 kWp en Bogotá genera unos 9.125 kWh al mes. Calcula tu caso con el cotizador eligiendo Bogotá y tu factura.",
      },
      {
        q: "¿El clima frío de Bogotá afecta los paneles solares?",
        a: "No. Las temperaturas bajas favorecen la eficiencia de los paneles. Lo que reduce la producción es la nubosidad, y ya está considerada en la radiación promedio que usamos para el diseño.",
      },
      {
        q: "¿Quién es el operador de red en Bogotá?",
        a: "Enel Colombia. Solartech tramita la conexión de tu planta solar y la certificación RETIE.",
      },
    ],
    metaTitle: "Paneles solares en Bogotá para empresas",
    metaDescription: "Energía solar en Bogotá: cuánto produce un sistema con la radiación de la ciudad, conexión con Enel Colombia y cómo saber si te conviene. Cotiza gratis.",
  },
  {
    slug: "cali",
    name: "Cali",
    departamento: "Valle del Cauca",
    municipio: "Cali",
    operator: { name: "EMCALI", url: "https://www.emcali.com.co" },
    projectSlugs: ["natural-harvest", "rotoplast", "caribe-motor"],
    projectsLabel: "Algunos de nuestros proyectos en Colombia",
    intro:
      "Cali recibe 4,0 horas de sol pico al día según la tabla de nuestro cotizador, más que el valle de Aburrá. Para la industria, el comercio y la agroindustria del Valle del Cauca, eso se traduce en más energía por cada panel instalado.",
    context: [
      {
        title: "14 % más energía por panel que en Medellín",
        text: "Con 4,0 horas de sol pico frente a 3,5 en Medellín, cada kWp produce cerca de 1.460 kWh al año. Un sistema de 100 kWp genera unos 12.170 kWh al mes.",
      },
      {
        title: "Industria y agroindustria del Valle",
        text: "Plantas de proceso, bodegas, centros de distribución y operaciones agroindustriales consumen energía de día, justo cuando la planta solar produce. Es el perfil donde el autoconsumo rinde más.",
      },
      {
        title: "Conexión con EMCALI",
        text: "En Cali el operador de red es EMCALI; en otros municipios del Valle puede ser otro operador. Hacemos la solicitud de conexión de tu planta y la certificación RETIE.",
      },
    ],
    faqs: [
      {
        q: "¿Cuánta energía produce un sistema solar en Cali?",
        a: "Con 4,0 horas de sol pico al día, cada kWp produce alrededor de 1.460 kWh al año. Un sistema de 100 kWp genera unos 12.170 kWh al mes.",
      },
      {
        q: "¿Quién es el operador de red en Cali?",
        a: "EMCALI (Empresas Municipales de Cali). Si tu empresa está en otro municipio del Valle, verificamos el operador en tu factura y nos encargamos del trámite.",
      },
      {
        q: "¿Atienden proyectos en Cali y el Valle del Cauca?",
        a: "Sí. Calcula tu ahorro con el cotizador eligiendo tu municipio y coordinamos la visita técnica.",
      },
    ],
    metaTitle: "Paneles solares en Cali y el Valle del Cauca",
    metaDescription: "Energía solar en Cali: 4 horas de sol pico al día, ideal para la industria y la agroindustria del Valle. Conexión con EMCALI y RETIE. Cotiza gratis.",
  },
  {
    slug: "barranquilla",
    name: "Barranquilla",
    departamento: "Atlántico",
    municipio: "Barranquilla",
    operator: { name: "Air-e", url: "https://www.air-e.com" },
    projectSlugs: ["absorbentes-de-colombia", "hotel-sabana-del-sinu", "agroindefuturo"],
    projectsLabel: "Proyectos en la costa Caribe",
    intro:
      "Barranquilla tiene una de las radiaciones más altas del país: 4,8 horas de sol pico al día según la tabla de nuestro cotizador. Muy cerca, en Cartagena, construimos nuestra planta más grande: 540 kWp para Absorbentes de Colombia.",
    context: [
      {
        title: "37 % más energía por panel que en Medellín",
        text: "Con 4,8 horas de sol pico frente a 3,5 en Medellín, cada kWp produce cerca de 1.750 kWh al año. Un sistema de 100 kWp genera unos 14.600 kWh al mes.",
      },
      {
        title: "Diseñado para la brisa salina",
        text: "La cercanía al mar y al río Magdalena exige estructura, tornillería y conexiones resistentes a la corrosión. Las especificamos desde el diseño y las revisamos en cada mantenimiento.",
      },
      {
        title: "Conexión con Air-e",
        text: "En el Atlántico el operador de red es Air-e. Gestionamos la solicitud de conexión de tu planta, según la regulación de la CREG para autogeneradores, y la certificación RETIE.",
      },
    ],
    faqs: [
      {
        q: "¿Cuánta energía produce un sistema solar en Barranquilla?",
        a: "Con 4,8 horas de sol pico al día, cada kWp produce alrededor de 1.750 kWh al año. Un sistema de 100 kWp genera unos 14.600 kWh al mes.",
      },
      {
        q: "¿El calor de la costa reduce la producción de los paneles?",
        a: "Las altas temperaturas restan algo de eficiencia, pero la radiación de la costa lo compensa con creces. Lo consideramos en el diseño, junto con la ventilación de los paneles y la protección contra la corrosión.",
      },
      {
        q: "¿Quién es el operador de red en Barranquilla?",
        a: "Air-e. Solartech tramita la conexión de tu planta solar y la certificación RETIE.",
      },
    ],
    metaTitle: "Paneles solares en Barranquilla para empresas",
    metaDescription: "Energía solar en Barranquilla: 4,8 horas de sol pico al día, diseño para ambiente salino y conexión con Air-e. Calcula el ahorro de tu empresa gratis.",
  },
  {
    slug: "bucaramanga",
    name: "Bucaramanga",
    departamento: "Santander",
    municipio: "Bucaramanga",
    operator: { name: "ESSA", url: "https://www.essa.com.co" },
    projectSlugs: ["absorbentes-de-colombia", "rotoplast", "ph-entre-parques"],
    projectsLabel: "Algunos de nuestros proyectos en Colombia",
    intro:
      "Bucaramanga recibe 4,0 horas de sol pico al día según la tabla de nuestro cotizador, más que el valle de Aburrá. Su área metropolitana, con Floridablanca, Girón y Piedecuesta, concentra industria, comercio y avicultura con consumo diurno.",
    context: [
      {
        title: "14 % más energía por panel que en Medellín",
        text: "Con 4,0 horas de sol pico frente a 3,5 en Medellín, cada kWp produce cerca de 1.460 kWh al año. Un sistema de 100 kWp genera unos 12.170 kWh al mes.",
      },
      {
        title: "Área metropolitana con consumo de día",
        text: "Bodegas, plantas de producción, galpones y locales comerciales usan la energía en las horas de sol. En ese perfil, la mayor parte de lo que produce la planta se autoconsume y se descuenta directo de la factura.",
      },
      {
        title: "Conexión con ESSA",
        text: "En Santander el operador de red es ESSA (Electrificadora de Santander). Hacemos la solicitud de conexión de tu planta y la certificación RETIE.",
      },
    ],
    faqs: [
      {
        q: "¿Cuánta energía produce un sistema solar en Bucaramanga?",
        a: "Con 4,0 horas de sol pico al día, cada kWp produce alrededor de 1.460 kWh al año. Un sistema de 100 kWp genera unos 12.170 kWh al mes.",
      },
      {
        q: "¿Quién es el operador de red en Bucaramanga?",
        a: "ESSA, la Electrificadora de Santander. Solartech tramita la conexión de tu planta solar y la certificación RETIE.",
      },
      {
        q: "¿Atienden Floridablanca, Girón y Piedecuesta?",
        a: "Sí. Calcula tu ahorro con el cotizador eligiendo tu municipio y coordinamos la visita técnica.",
      },
    ],
    metaTitle: "Paneles solares en Bucaramanga para empresas",
    metaDescription: "Energía solar en Bucaramanga y su área metropolitana: 4 horas de sol pico al día, conexión con ESSA y certificación RETIE. Calcula tu ahorro gratis.",
  },
];

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}
