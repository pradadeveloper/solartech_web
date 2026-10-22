// Aliados financieros y marcas de equipos. Fuentes: /quienes-somos/ del sitio anterior y
// diapositiva "Nuestras marcas" de las presentaciones comerciales 2026.

export type Partner = { name: string; kind: "financiación" | "paneles" | "inversores" | "estructuras"; logo: string; width: number; height: number };

export const partners: Partner[] = [
  { name: "Bancolombia", kind: "financiación", logo: "/images/aliados/aliado-bancolombia.webp", width: 600, height: 84 },
  { name: "Davivienda", kind: "financiación", logo: "/images/aliados/aliado-davivienda.webp", width: 600, height: 212 },
  { name: "Banco de Bogotá", kind: "financiación", logo: "/images/aliados/aliado-banco-de-bogota.webp", width: 600, height: 121 },
  { name: "LONGi", kind: "paneles", logo: "/images/aliados/marca-longi.webp", width: 600, height: 252 },
  { name: "JinkoSolar", kind: "paneles", logo: "/images/aliados/marca-jinko-solar.webp", width: 577, height: 193 },
  { name: "Huawei", kind: "inversores", logo: "/images/aliados/marca-huawei.webp", width: 310, height: 316 },
  { name: "Growatt", kind: "inversores", logo: "/images/aliados/marca-growatt.webp", width: 600, height: 146 },
  { name: "GoodWe", kind: "inversores", logo: "/images/aliados/marca-goodwe.webp", width: 326, height: 48 },
  { name: "Acesco Alurak", kind: "estructuras", logo: "/images/aliados/marca-acesco-alurak.webp", width: 500, height: 121 },
];
