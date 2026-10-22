import { ServicePage } from "@/components/sections/service-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Paneles solares llave en mano (EPC)",
  description: "Paneles solares llave en mano: diseño, equipos, construcción y trámites. Retorno de 3 a 4 años y deducción del 50 % en renta. Calcula tu ahorro.",
  path: "/servicios/epc/",
});

export default function EpcPage() {
  return <ServicePage serviceKey="epc" />;
}
