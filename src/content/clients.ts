// Empresas que ya tienen su planta solar con Solartech. Fuente: diapositivas "Algunos de
// nuestros clientes" de la presentación "PPT Solartech-Industria" (oct-2026).
// Logos en public/images/clientes (scripts/import-deck-assets.mjs).

export type Client = { name: string; logo: string; width: number; height: number };

const c = (name: string, file: string, width: number, height: number): Client => ({ name, logo: `/images/clientes/${file}.webp`, width, height });

export const clients: Client[] = [
  c("Absorbentes de Colombia", "absorbentes", 205, 57),
  c("Rotoplast", "rotoplast", 400, 110),
  c("PlastiRed", "plastired", 400, 98),
  c("Caribe Motor", "caribe-motor", 400, 72),
  c("Comodísimos", "comodisimos", 240, 41),
  c("Templamos", "templamos", 240, 131),
  c("Safer Agrobiológicos", "safer", 163, 111),
  c("Natural Harvest", "natural-harvest", 192, 78),
  c("The Columbus School", "columbus-school", 173, 133),
  c("Colpagro", "colpagro", 225, 225),
  c("Colplast", "colplast", 284, 223),
  c("Especial Impresores", "especial-impresores", 340, 136),
  c("Lam Cosmetics", "lam-cosmeticos", 175, 88),
  c("Hotel Sabana del Sinú", "hotel-sabana-del-sinu", 208, 221),
  c("Club Campestre Medellín", "club-campestre", 400, 208),
  c("Marymount School Medellín", "marymount-school", 201, 201),
  c("Clínica Erasmo", "clinica-erasmo", 162, 157),
  c("Laboratorios Delta", "laboratorios-delta", 189, 123),
  c("Grupo Santamaría", "grupo-santamaria", 183, 78),
  c("Proalco", "proalco", 400, 73),
  c("Invesa", "invesa", 177, 76),
  c("Monterrey", "monterrey", 211, 155),
  c("Aeromaquinados", "aeromaquinados", 400, 73),
  c("Aduanimex", "aduanimex", 332, 171),
  c("Distecsa", "distecsa", 237, 111),
  c("Implantec", "implantec", 184, 170),
  c("Geodic", "geodic", 236, 161),
  c("Línea Directa", "linea-directa", 174, 93),
  c("Tropical Banana Co", "tropical-banana", 265, 137),
  c("La Media Naranja", "la-media-naranja", 286, 159),
  c("Frudelca", "frudelca", 151, 166),
  c("Pergamino", "pergamino", 136, 152),
  c("La Manchuria Coffee Reserve", "la-manchuria", 269, 123),
  c("Casa Magna", "casa-magna", 125, 69),
  c("Marrés", "marres", 133, 38),
  c("Canta Girone", "canta-girone", 166, 53),
];
