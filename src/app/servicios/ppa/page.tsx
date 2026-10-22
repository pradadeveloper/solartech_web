import { ServicePage } from "@/components/sections/service-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "PPA de energía solar: ahorra sin invertir",
  description: "Modelo PPA de energía solar en Colombia: inversión $0 y kWh hasta 35 % más barato que la red. Solartech financia, instala y mantiene. Cotiza gratis.",
  path: "/servicios/ppa/",
});

export default function PpaPage() {
  return <ServicePage serviceKey="ppa" />;
}
