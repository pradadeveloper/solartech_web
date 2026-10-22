// Preguntas frecuentes. Fuente: /quienes-somos/#faq del sitio actual (redactadas de nuevo
// con leves ajustes de estilo). Se usan en /preguntas-frecuentes/ y como FAQPage JSON-LD.

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "¿Cómo funcionan los paneles solares?",
    a: "Los paneles convierten la luz del sol en electricidad mediante el efecto fotovoltaico. Un inversor transforma esa energía para que la uses de inmediato en tu empresa u hogar; si tienes baterías, puedes almacenarla para usarla después.",
  },
  {
    q: "¿Los paneles solares funcionan en días nublados o lluviosos?",
    a: "Sí. En días nublados o lluviosos los paneles siguen generando, aunque a un nivel menor que en días soleados. El diseño del sistema considera la radiación promedio de tu zona a lo largo del año.",
  },
  {
    q: "¿Cuánto ahorro puedo esperar al instalar paneles solares?",
    a: "Depende de la radiación de tu ubicación, el tamaño del sistema y tu consumo. Nuestros proyectos empresariales ahorran entre $9,5 y $55 millones al mes y recuperan la inversión en 3 a 4 años. Usa el cotizador para una estimación en un minuto.",
  },
  {
    q: "¿Necesito algún permiso para instalar paneles solares?",
    a: "Según la ubicación y el tamaño del sistema puede requerirse trámite ante el operador de red y certificación RETIE. En Solartech nos encargamos de todo el proceso de permisos.",
  },
  {
    q: "¿Qué mantenimiento requieren los paneles solares?",
    a: "Muy poco. Recomendamos limpieza periódica para retirar polvo y residuos, y una revisión anual de inversores, protecciones, estructura y cableado. Lo ofrecemos con nuestro servicio de gestión de plantas.",
  },
  {
    q: "¿Cuánto duran los paneles solares?",
    a: "Los paneles están diseñados para durar al menos 25 años y muchos siguen generando más allá de ese periodo, con una pérdida de eficiencia gradual y baja.",
  },
  {
    q: "¿Puedo instalar paneles solares en cualquier tipo de techo?",
    a: "La mayoría de techos son aptos: lámina, teja de barro, losa o incluso suelo. La viabilidad depende de sombras, orientación y estado de la estructura, que evaluamos en la visita técnica.",
  },
];
