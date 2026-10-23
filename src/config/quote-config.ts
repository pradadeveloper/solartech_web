// Parámetros del cotizador web. Editar aquí cambia el cálculo en todo el sitio
// (motor en src/lib/quote-engine.ts). Al cambiar valores, sube `version`: queda
// guardada con cada lead para auditar con qué parámetros se cotizó.
//
// Fuentes: solartech_app/backend/formulas.js (dimensionamiento y ahorro),
// Cotizador WEB.xlsm (degradación, PPA, beneficio tributario), propuestas de
// mercado 2025 (rangos de precio). Ver audit/quote-engine-findings.md.
//
// ⚠ PROVISIONAL = valor de referencia pendiente de confirmar por Solartech.

import hspTable from "@/content/hsp-colombia.json";

/** Los mismos tipos de proyecto que usa el CRM (solartech_app: Hogar, Comercial, Empresa, Gran Escala). */
export const CLIENT_TYPES = ["hogar", "comercial", "empresa", "gran_escala"] as const;
export type ClientType = (typeof CLIENT_TYPES)[number];

export const quoteConfig = {
  version: "2026-10-20-provisional",

  solar: {
    panelWp: 620, // Excel E22
    panelAreaM2: 2.5, // Excel E23
    areaFactorM2PerKwp: 5.5, // Excel E29 (incluye pasillos y separaciones)
    dcAcRatio: 1.3, // Excel E9
    // La tabla de HSP de solartech_app ya es una radiación "efectiva": Medellín 3,5 → 1.277 kWh/kWp·año,
    // en línea con simulaciones PVsyst del mercado (1.250–1.350). Por eso no se aplica un PR adicional.
    performanceRatio: 1,
    defaultHsp: 3.8,
    degradationPerYear: 0.0055, // Excel E34, lineal
    lifetimeYears: 25,
  },

  regulation: {
    // Autogenerador a pequeña escala hasta 100 kW AC ≈ 135 kWp (Excel G2).
    smallSelfGenMaxKwp: 135,
    // Por encima, se limita a 52 % del consumo anual (Excel G3).
    largeSelfGenFactor: 0.52,
    // Curva de excedentes (Excel E12): fracción de la generación que se exporta a la red.
    surplus: { lowRatio: 0.33, slope: 5 / 7, intercept: 15 / 67, highShare: 0.5 },
    commercializationCopKwh: 120, // excedentes se pagan a tarifa − 120 (Excel E27)
    generationCopKwh: 330, // por encima de 135 kWp, a precio de bolsa aprox. (Excel E28)
  },

  pricing: {
    // ⚠ PROVISIONAL: $/kWp antes de IVA por tamaño. Hoy solartech_app usa 4.500.000 plano.
    // Calibrado con el retorno real de los proyectos (≈2,7–4,2 M/kWp implícito) y propuestas de mercado,
    // del lado conservador para no prometer retornos más cortos que los casos reales (3–3,8 años).
    tiers: [
      { maxKwp: 20, copPerKwp: 4_500_000 },
      { maxKwp: 50, copPerKwp: 4_000_000 },
      { maxKwp: 150, copPerKwp: 3_600_000 },
      { maxKwp: 500, copPerKwp: 3_400_000 },
      { maxKwp: Infinity, copPerKwp: 3_200_000 },
    ],
    ivaRate: 0.05, // tasa combinada usada por solartech_app (equipos excluidos por Ley 1715 + servicios)
    rangeSpread: 0.15, // la inversión se muestra como rango ±15 %
    maintenanceCopPerKwpYear: 45_000, // Excel E19
  },

  // ⚠ PROVISIONAL: no existe dimensionamiento de baterías en la app ni en el Excel.
  batteries: {
    backupShareOfDailyConsumption: 0.25, // respaldo de cargas críticas
    copPerKwh: 3_000_000, // LFP instalado, incluye inversor híbrido
    minKwh: 5,
  },

  finance: {
    tariffEscalation: 0.06, // ⚠ PROVISIONAL (app 8 % IPC; mercado 5–7 %)
  },

  tax: {
    incomeTaxRate: 0.35, // Art. 240 E.T. (Excel E2)
    specialDeductionShare: 0.5, // Art. 11 Ley 1715 (mod. Ley 2099)
    // Se suma al retorno solo para estos tipos de cliente (declarantes de renta).
    eligibleClientTypes: ["comercial", "empresa", "gran_escala"] as ClientType[],
  },

  ppa: {
    discountVsTariff: 0.35, // Excel G13 y caso Edificio Plex
    termYears: 15, // Excel O16
    indexation: 0.05, // Excel O15
    minKwp: 30, // ⚠ PROVISIONAL: tamaño mínimo para ofrecer PPA
  },

  environment: {
    // ⚠ PROVISIONAL: factor de emisión del SIN ≈ 0,126 kgCO2/kWh (UPME). La app usaba ≈0,28–0,58 (sobreestimado).
    co2KgPerKwh: 0.126,
    co2TonPerTreeYear: 0.02, // solartech_app
  },

  // ⚠ PROVISIONAL: tarifa de referencia $/kWh por departamento para prellenar el cotizador.
  // El usuario la edita con el valor de su factura.
  tariffs: {
    default: 900,
    byDepartment: {
      Antioquia: 830,
      "Bogotá D.C.": 880,
      Cundinamarca: 880,
      "Valle del Cauca": 850,
      Atlántico: 1000,
      Bolívar: 1000,
      Córdoba: 1000,
      Sucre: 1000,
      Cesar: 1000,
      Magdalena: 1000,
      "La Guajira": 1000,
    } as Record<string, number>,
  },

  leadScoring: {
    highPriorityBillCop: 5_000_000, // brief: empresa + factura > $5M = prioridad alta
    mediumPriorityBillCop: 1_500_000,
  },
} as const;

export type QuoteConfig = typeof quoteConfig;

export type HspDepartment = { departamento: string; hsp: number; municipios: { nombre: string; hsp: number }[] };
export const hspByDepartment = hspTable as HspDepartment[];
