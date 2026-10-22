import type { ClientType } from "@/config/quote-config";
import type { ModelInterest, RoofType } from "@/lib/quote-engine";

export const clientTypes: { value: ClientType; title: string; description: string }[] = [
  { value: "empresa", title: "Empresa", description: "Industria, comercio o servicios" },
  { value: "agro", title: "Agro", description: "Fincas, riego, cuartos fríos" },
  { value: "hogar", title: "Hogar", description: "Casa o copropiedad" },
];

export const roofTypes: { value: RoofType; title: string }[] = [
  { value: "lamina", title: "Lámina / metálico" },
  { value: "teja_barro", title: "Teja de barro" },
  { value: "losa", title: "Losa de concreto" },
  { value: "suelo", title: "Suelo / terreno" },
];

export const modelOptions: { value: ModelInterest; title: string; description: string }[] = [
  { value: "epc", title: "Comprar el sistema (EPC)", description: "Quedarte con todo el ahorro" },
  { value: "ppa", title: "Sin inversión (PPA)", description: "Pagar solo la energía, con descuento" },
  { value: "no_se", title: "No sé aún", description: "Quiero comparar ambas opciones" },
];

export const stepTitles = ["Tu proyecto", "Tu consumo", "Tu instalación", "Tus datos"] as const;
