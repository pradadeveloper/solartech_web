import { ServicePage } from "@/components/sections/service-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Mantenimiento de paneles solares (O&M)",
  description: "Mantenimiento de paneles solares y O&M: monitoreo, limpieza e inspección de inversores para que tu planta rinda al máximo. Agenda un diagnóstico.",
  path: "/servicios/gestion-de-plantas/",
});

export default function GestionDePlantasPage() {
  return <ServicePage serviceKey="gestion-de-plantas" />;
}
