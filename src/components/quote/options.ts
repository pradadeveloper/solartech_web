import { Factory, Home, SolarPanel, Store, type LucideIcon } from "lucide-react";
import { CLIENT_TYPES, type ClientType } from "@/config/quote-config";
import type { ModelInterest, RoofType } from "@/lib/quote-engine";

// Mismo orden y mismos tipos que el CRM (solartech_app).
export const clientTypes: { value: ClientType; title: string; description: string; icon: LucideIcon }[] = [
  { value: "hogar", title: "Hogar", description: "Casa o copropiedad", icon: Home },
  { value: "comercial", title: "Comercial", description: "Comercio, servicios, fincas", icon: Store },
  { value: "empresa", title: "Empresa", description: "Industria y manufactura", icon: Factory },
  { value: "gran_escala", title: "Granja solar", description: "Proyectos a gran escala", icon: SolarPanel },
];

export function isClientType(value: string | null): value is ClientType {
  return CLIENT_TYPES.includes(value as ClientType);
}

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
