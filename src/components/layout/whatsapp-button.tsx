"use client";

import { usePathname } from "next/navigation";
import { whatsappDefaultMessage, whatsappUrl } from "@/content/site";
import { pushEvent } from "@/lib/analytics";

// Mensaje prellenado según la sección desde la que escribe el visitante.
const messages: [prefix: string, message: string][] = [
  ["/servicios/ppa", "Hola Solartech. Quiero información sobre el modelo PPA (energía solar sin inversión)."],
  ["/servicios/epc", "Hola Solartech. Quiero cotizar un proyecto solar llave en mano (EPC)."],
  ["/servicios/gestion-de-plantas", "Hola Solartech. Quiero información sobre mantenimiento y gestión de mi planta solar."],
  ["/soluciones/agro", "Hola Solartech. Quiero información sobre energía solar para mi finca."],
  ["/soluciones/hogares", "Hola Solartech. Quiero información sobre paneles solares para mi casa."],
  ["/beneficios-tributarios", "Hola Solartech. Quiero saber cómo aplicar los beneficios tributarios de la energía solar."],
  ["/proyectos", "Hola Solartech. Vi sus proyectos y quiero uno similar para mi empresa."],
  ["/cotizador", "Hola Solartech. Estoy usando el cotizador y tengo una pregunta."],
];

export function WhatsAppButton() {
  const pathname = usePathname();
  const message = messages.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? whatsappDefaultMessage;

  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      onClick={() => pushEvent("whatsapp_click", { location: "floating_button", page: pathname })}
      className="group fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/30 transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-7 fill-current">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.43 9.44-9.43a9.38 9.38 0 0 1 9.43 9.44c0 5.2-4.24 9.43-9.44 9.43m8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.79.72.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.6l6-1.57a11.3 11.3 0 0 0 5.43 1.38h.01c6.25 0 11.34-5.09 11.35-11.35 0-3.03-1.18-5.88-3.32-8.02" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-surface px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-fg shadow-lg group-hover:block">
        ¿Hablamos?
      </span>
    </a>
  );
}
