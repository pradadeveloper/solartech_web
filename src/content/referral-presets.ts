// Proyectos típicos del simulador de referidos, valorados con los precios del cotizador web.
// Se calcula en el servidor y se pasa al simulador: así el navegador no carga el motor.
import { quoteConfig } from "@/config/quote-config";
import { pricePerKwp } from "@/lib/quote-engine";
import type { ProjectPreset } from "@/content/referrals";

/** Valor de referencia de un proyecto (IVA incluido) con los precios ⚠ provisionales del cotizador. */
function projectValue(kwp: number) {
  return Math.round(kwp * pricePerKwp(kwp) * (1 + quoteConfig.pricing.ivaRate));
}

// Tamaños de proyectos reales del portafolio: casas de ~10 kWp, comercios de ~50, industrias de
// 135 y la planta de 540 kWp de Absorbentes de Colombia.
export const projectPresets: ProjectPreset[] = [
  { key: "hogar", label: "Hogar", detail: "Casa o finca pequeña", kwp: 10 },
  { key: "comercial", label: "Comercio", detail: "Local, hotel o colegio", kwp: 50 },
  { key: "empresa", label: "Industria", detail: "Planta o bodega mediana", kwp: 135 },
  { key: "gran_escala", label: "Gran industria", detail: "Planta de gran consumo", kwp: 540 },
].map((p) => ({ ...p, valueCop: projectValue(p.kwp) }));
