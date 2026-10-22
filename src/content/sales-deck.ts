// Contenido tomado de las presentaciones comerciales de Solartech (oct-2026):
// "PPT Solartech-Industria.pdf" y "Presentación PPA 2026.pdf".

/** Respaldo de la empresa (el grupo Ferragro) y garantías técnicas. */
export const company = {
  group: [
    { value: "35+", label: "años de trayectoria del grupo Ferragro" },
    { value: "200+", label: "empleados" },
    { value: "Nacional", label: "presencia en todo el país" },
    { value: "Directos", label: "distribuidores directos de equipos" },
  ],
  technology: [
    { value: "15 años", label: "de garantía en paneles" },
    // Las presentaciones difieren (86 % a 25 años vs. 89 % a 30 años): se usa la cifra conservadora.
    { value: "86 %", label: "de eficiencia de los paneles a los 25 años" },
  ],
  closing: "Con Solartech hoy tienes la oportunidad de transformar un gasto en ahorro.",
};

/** "Ejecutamos el 100 % del proyecto" (presentación PPA). */
export const executionSteps = [
  { title: "Diseño", text: "Ingeniería del sistema según tu consumo, tu cubierta y tu conexión." },
  { title: "Suministro", text: "Paneles, inversores y estructura de nuestras marcas aliadas, con distribución directa." },
  { title: "Instalación", text: "Montaje y puesta en marcha del sistema en tu cubierta o terreno." },
  { title: "Certificado RETIE", text: "Inspección y certificación de la instalación eléctrica." },
  { title: "Legalización ante el OR", text: "Trámite de conexión con el operador de red y medidor bidireccional." },
];

/** ¿Por qué energía solar? (presentación industria). */
export const whySolar = [
  { title: "Altos costos de la energía", text: "La tarifa sube cada año; tu planta fija buena parte de tu costo energético por más de 25 años." },
  { title: "Riesgo de racionamiento", text: "Generar tu propia energía reduce tu exposición a la red. Con baterías, también tienes respaldo ante cortes." },
  { title: "Alta rentabilidad", text: "Nuestros proyectos recuperan la inversión en 2,7 a 4 años y siguen ahorrando décadas después." },
  { title: "Bajo costo de mantenimiento", text: "Equipos muy confiables: limpieza periódica y una revisión anual." },
  { title: "Desarrollo sostenible", text: "Energía limpia que reduce la huella de carbono de tu empresa u hogar." },
];

/** ¿Cómo estructurar un proyecto solar? (presentación industria). */
export const projectStructuring = {
  need: { title: "1. La necesidad", items: ["Cantidad de kWh que consumes al mes (está en tu factura)."] },
  constraints: {
    title: "2. Las restricciones",
    items: ["Área disponible", "Tipo de cubierta", "Capacidad estructural", "Subestación y conexión eléctrica", "Capacidad financiera"],
  },
};

/** Formas de financiar el proyecto (presentación industria). */
export const financingOptions = [
  {
    key: "epc",
    name: "EPC · Compra",
    href: "/servicios/epc/",
    points: ["El cliente compra el sistema solar.", "Retorno de la inversión alto en el tiempo.", "Valorización del activo.", "Requiere inversión inicial."],
  },
  {
    key: "ppa",
    name: "PPA · Sin inversión",
    href: "/servicios/ppa/",
    points: ["Sin inversión inicial.", "Pagas solo la energía generada, a una tarifa menor que la de la red.", "Contrato a largo plazo."],
  },
  {
    key: "leasing",
    name: "Leasing",
    href: "/contacto/",
    points: ["Sistema financiado en cuotas mensuales.", "No requiere un gran desembolso inicial.", "Conserva los beneficios tributarios.", "Ideal para un flujo de caja controlado."],
  },
] as const;

/** PPA frente a compra (presentación PPA, diapositiva "Alternativas"). */
export const ppaVsPurchase = {
  ppa: ["Cero inversión", "Descuento sobre los kWh generados por el sistema", "Cero costo de mantenimiento", "Cero riesgo de obsolescencia"],
  purchase: ["Inversión alta", "Cuota extra si se financia", "Ahorro alto", "El mantenimiento corre por tu cuenta"],
};

/** Venta de excedentes según la CREG 174 de 2021 (presentación industria, valores de referencia).
    Los $/kWh son de la presentación; la liquidación real depende del operador de red. */
export const surplusRules = [
  { range: "0 – 135 kWp", price: "Tu tarifa menos el costo de comercialización", example: "≈ $800 − $100 por kWh", extras: "—" },
  { range: "135 – 340 kWp", price: "Precio de bolsa de referencia", example: "≈ $350 por kWh", extras: "Contrato de respaldo" },
  { range: "Más de 340 kWp", price: "Precio de bolsa de referencia", example: "≈ $350 por kWh", extras: "Contrato de respaldo y protección de red" },
];

/** Ejemplo de la curva de generación (presentación industria, "¿Cómo funciona?").
    500 kWh/mes: 60 % autoconsumo a $750 y 40 % excedentes a $700 = $365.000 de ahorro. */
export const generationExample = {
  generationKwhMonth: 500,
  selfConsumptionShare: 0.6,
  surplusShare: 0.4,
  tariffCopKwh: 750,
  surplusCopKwh: 700,
  kwhPerKwpDay: "3 a 5",
};

export const regulationRefs = ["Ley 1715 de 2014", "Art. 174 Ley 1955 de 2019", "Ley 2099 de 2021", "Resolución CREG 174 de 2021"];
