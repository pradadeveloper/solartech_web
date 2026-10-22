// Motor de pre-cotización solar. Funciones puras: mismo resultado en el navegador
// (vista previa en vivo) y en el servidor (/api/leads recalcula antes de guardar).
//
// Dimensionamiento y ahorro replican solartech_app/backend/formulas.js, que a su vez
// porta Cotizador WEB.xlsm › DATOS ENTRADA (celdas E6–E26). Lo nuevo frente a la app:
// precio por rango de tamaño, degradación, escalamiento de tarifa, beneficio tributario
// según el Excel (50 % × tarifa de renta), PPA, baterías y CO₂ con factor de red.

import { hspByDepartment, quoteConfig, type ClientType, type QuoteConfig } from "@/config/quote-config";
import { projects, type Project } from "@/content/projects";

export type ModelInterest = "epc" | "ppa" | "no_se";
export type RoofType = "lamina" | "teja_barro" | "losa" | "suelo";

export type QuoteInput = {
  clientType: ClientType;
  departamento: string;
  municipio: string;
  /** Valor de la factura mensual (COP). Se usa si no hay consumo en kWh. */
  billCop?: number;
  /** Consumo mensual en kWh. Tiene prioridad sobre la factura. */
  consumptionKwh?: number;
  tariffCopKwh: number;
  roofType?: RoofType;
  areaM2?: number;
  batteries: boolean;
  modelInterest: ModelInterest;
};

export type CashFlowPoint = { year: number; flow: number; cumulative: number; cumulativeWithTax: number };

export type QuoteResult = {
  version: string;
  hsp: number;
  consumptionKwh: number;
  system: {
    kwp: number;
    panels: number;
    panelWp: number;
    acKw: number;
    areaM2: number;
    limitedBy: "consumo" | "area" | "regulacion";
  };
  energy: { generationKwhMonth: number; coverage: number; surplusShare: number };
  savings: { monthlyCop: number; yearlyCop: number; lifetimeCop: number };
  investment: { subtotalCop: number; ivaCop: number; batteriesCop: number; batteryKwh: number; totalCop: number; lowCop: number; highCop: number; copPerKwp: number };
  tax: { eligible: boolean; deductionCop: number; taxSavingCop: number };
  payback: { years: number | null; yearsWithTax: number | null };
  cashFlow: CashFlowPoint[];
  ppa: { available: boolean; discount: number; termYears: number; tariffCopKwh: number; monthlySavingsCop: number; termSavingsCop: number };
  environment: { co2TonYear: number; co2TonLifetime: number; trees: number };
  similarProject: Pick<Project, "slug" | "name" | "city" | "kwp" | "monthlySavingsCop" | "paybackYears" | "model"> | null;
};

export class QuoteError extends Error {}

// ---------- Ubicación ----------

export function resolveHsp(departamento: string, municipio: string, cfg: QuoteConfig = quoteConfig): number {
  const dep = hspByDepartment.find((d) => d.departamento === departamento);
  if (!dep) return cfg.solar.defaultHsp;
  return dep.municipios.find((m) => m.nombre === municipio)?.hsp ?? dep.hsp;
}

export function referenceTariff(departamento: string, cfg: QuoteConfig = quoteConfig): number {
  return cfg.tariffs.byDepartment[departamento] ?? cfg.tariffs.default;
}

// ---------- Dimensionamiento (formulas.js:118-150 · Excel E6, F7, E7, E10) ----------

export function monthlyConsumption(input: Pick<QuoteInput, "billCop" | "consumptionKwh" | "tariffCopKwh">): number {
  if (input.consumptionKwh && input.consumptionKwh > 0) return input.consumptionKwh;
  if (input.billCop && input.billCop > 0 && input.tariffCopKwh > 0) return input.billCop / input.tariffCopKwh;
  throw new QuoteError("Ingresa el valor de tu factura o tu consumo en kWh.");
}

export function sizeSystem(consumptionKwh: number, hsp: number, areaM2: number | undefined, cfg: QuoteConfig = quoteConfig) {
  const { solar, regulation } = cfg;
  const yieldPerKwpYear = hsp * 365 * solar.performanceRatio;
  const kwpByConsumption = (consumptionKwh * 12) / yieldPerKwpYear;
  const kwpByArea = areaM2 && areaM2 > 0 ? areaM2 / solar.areaFactorM2PerKwp : Infinity;

  let kwp = Math.min(kwpByConsumption, kwpByArea);
  let limitedBy: QuoteResult["system"]["limitedBy"] = kwpByArea < kwpByConsumption ? "area" : "consumo";

  // Límite regulatorio para autogeneradores (Excel F7).
  const maxLarge = kwpByConsumption * regulation.largeSelfGenFactor;
  if (kwp >= regulation.smallSelfGenMaxKwp && kwp >= maxLarge) {
    kwp = Math.max(regulation.smallSelfGenMaxKwp, maxLarge);
    limitedBy = "regulacion";
  }

  const panelKw = solar.panelWp / 1000;
  const panels = Math.floor(kwp / panelKw);
  if (panels < 2) throw new QuoteError("El consumo o el área son muy bajos para un sistema solar. Escríbenos y lo revisamos contigo.");
  const finalKwp = round(panels * panelKw, 2);

  return {
    kwp: finalKwp,
    panels,
    panelWp: solar.panelWp,
    acKw: round(finalKwp / solar.dcAcRatio, 1),
    areaM2: Math.round(finalKwp * solar.areaFactorM2PerKwp),
    limitedBy,
  };
}

export function monthlyGeneration(kwp: number, hsp: number, cfg: QuoteConfig = quoteConfig): number {
  return (kwp * hsp * 365 * cfg.solar.performanceRatio) / 12;
}

/** Fracción de la generación que se exporta como excedente (Excel E12). */
export function surplusShare(generationKwh: number, consumptionKwh: number, cfg: QuoteConfig = quoteConfig): number {
  const { lowRatio, slope, intercept, highShare } = cfg.regulation.surplus;
  const ratio = generationKwh / consumptionKwh;
  if (ratio <= lowRatio) return 0;
  if (ratio <= 1) return slope * ratio - intercept;
  return (highShare * consumptionKwh + generationKwh - consumptionKwh) / generationKwh;
}

/** Ahorro mensual: autoconsumo a tarifa plena + excedentes a precio de venta (Excel E26, H41). */
export function monthlySavings(generationKwh: number, surplus: number, tariff: number, kwp: number, cfg: QuoteConfig = quoteConfig): number {
  const { regulation } = cfg;
  const salePrice = kwp > regulation.smallSelfGenMaxKwp ? regulation.generationCopKwh : tariff - regulation.commercializationCopKwh;
  return generationKwh * tariff * (1 - surplus) + generationKwh * Math.max(0, salePrice) * surplus;
}

// ---------- Inversión ----------

export function pricePerKwp(kwp: number, cfg: QuoteConfig = quoteConfig): number {
  return cfg.pricing.tiers.find((t) => kwp <= t.maxKwp)!.copPerKwp;
}

export function batteryBank(consumptionKwh: number, cfg: QuoteConfig = quoteConfig) {
  const { batteries } = cfg;
  const kwh = Math.max(batteries.minKwh, Math.round((consumptionKwh / 30) * batteries.backupShareOfDailyConsumption));
  return { kwh, costCop: kwh * batteries.copPerKwh };
}

// ---------- Proyección financiera ----------

type ProjectionArgs = {
  totalInvestment: number;
  firstYearSavings: number;
  maintenanceYear1: number;
  taxSaving: number;
  cfg?: QuoteConfig;
};

/** Flujo de caja a 25 años con escalamiento de tarifa y degradación (Excel › Flujos).
    El beneficio tributario se recibe en el año 2, al presentar la declaración (Excel L10). */
export function projectCashFlow({ totalInvestment, firstYearSavings, maintenanceYear1, taxSaving, cfg = quoteConfig }: ProjectionArgs): CashFlowPoint[] {
  const { finance, solar } = cfg;
  const points: CashFlowPoint[] = [{ year: 0, flow: -totalInvestment, cumulative: -totalInvestment, cumulativeWithTax: -totalInvestment }];
  let cumulative = -totalInvestment;
  let cumulativeWithTax = -totalInvestment;
  for (let year = 1; year <= solar.lifetimeYears; year++) {
    const escalation = (1 + finance.tariffEscalation) ** (year - 1);
    const degradation = 1 - solar.degradationPerYear * (year - 1);
    const flow = firstYearSavings * escalation * degradation - maintenanceYear1 * escalation;
    cumulative += flow;
    cumulativeWithTax += flow + (year === 2 ? taxSaving : 0);
    points.push({ year, flow: Math.round(flow), cumulative: Math.round(cumulative), cumulativeWithTax: Math.round(cumulativeWithTax) });
  }
  return points;
}

/** Año (interpolado) en que el flujo acumulado se vuelve positivo. */
export function paybackYears(points: CashFlowPoint[], key: "cumulative" | "cumulativeWithTax"): number | null {
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1][key];
    const curr = points[i][key];
    if (curr >= 0) return round(points[i - 1].year + -prev / (curr - prev), 1);
  }
  return null;
}

// ---------- PPA ----------

export function ppaOffer(generationKwhMonth: number, tariff: number, kwp: number, cfg: QuoteConfig = quoteConfig) {
  const { ppa, solar } = cfg;
  const tariffPpa = tariff * (1 - ppa.discountVsTariff);
  let termSavings = 0;
  for (let year = 1; year <= ppa.termYears; year++) {
    const kwh = generationKwhMonth * 12 * (1 - solar.degradationPerYear * (year - 1));
    termSavings += kwh * (tariff - tariffPpa) * (1 + ppa.indexation) ** (year - 1);
  }
  return {
    available: kwp >= ppa.minKwp,
    discount: ppa.discountVsTariff,
    termYears: ppa.termYears,
    tariffCopKwh: Math.round(tariffPpa),
    monthlySavingsCop: Math.round(generationKwhMonth * (tariff - tariffPpa)),
    termSavingsCop: Math.round(termSavings),
  };
}

// ---------- Prueba social ----------

const sectorsByClient: Record<ClientType, Project["sector"][]> = {
  empresa: ["industria", "comercio"],
  agro: ["agro"],
  hogar: ["residencial", "copropiedad"],
};

/** Caso de éxito más parecido: mismo sector y tamaño más cercano (en escala logarítmica).
    Se prefieren los que tienen ahorro mensual documentado (es la cifra que se muestra). */
export function similarProject(clientType: ClientType, kwp: number, list: Project[] = projects) {
  const sameSector = list.filter((p) => sectorsByClient[clientType].includes(p.sector));
  const base = sameSector.length ? sameSector : list;
  const withSavings = base.filter((p) => p.monthlySavingsCop !== null);
  const pool = withSavings.length ? withSavings : base;
  const best = [...pool].sort((a, b) => Math.abs(Math.log(a.kwp / kwp)) - Math.abs(Math.log(b.kwp / kwp)))[0];
  if (!best) return null;
  const { slug, name, city, kwp: pk, monthlySavingsCop, paybackYears, model } = best;
  return { slug, name, city, kwp: pk, monthlySavingsCop, paybackYears, model };
}

// ---------- Orquestador ----------

export function computeQuote(input: QuoteInput, cfg: QuoteConfig = quoteConfig): QuoteResult {
  if (!(input.tariffCopKwh > 0)) throw new QuoteError("Ingresa la tarifa de energía ($/kWh).");

  const hsp = resolveHsp(input.departamento, input.municipio, cfg);
  const consumptionKwh = monthlyConsumption(input);
  const system = sizeSystem(consumptionKwh, hsp, input.areaM2, cfg);

  const generationKwhMonth = monthlyGeneration(system.kwp, hsp, cfg);
  const surplus = surplusShare(generationKwhMonth, consumptionKwh, cfg);
  const savingsMonth = monthlySavings(generationKwhMonth, surplus, input.tariffCopKwh, system.kwp, cfg);

  const copPerKwp = pricePerKwp(system.kwp, cfg);
  const subtotal = system.kwp * copPerKwp;
  const battery = input.batteries ? batteryBank(consumptionKwh, cfg) : { kwh: 0, costCop: 0 };
  const iva = (subtotal + battery.costCop) * cfg.pricing.ivaRate;
  const total = subtotal + battery.costCop + iva;

  const eligible = cfg.tax.eligibleClientTypes.includes(input.clientType);
  const deduction = (subtotal + battery.costCop) * cfg.tax.specialDeductionShare;
  const taxSaving = deduction * cfg.tax.incomeTaxRate;

  const cashFlow = projectCashFlow({
    totalInvestment: total,
    firstYearSavings: savingsMonth * 12,
    maintenanceYear1: system.kwp * cfg.pricing.maintenanceCopPerKwpYear,
    taxSaving: eligible ? taxSaving : 0,
    cfg,
  });
  const lifetimeSavings = cashFlow.slice(1).reduce((sum, p) => sum + p.flow, 0);
  const annualKwh = generationKwhMonth * 12;
  const co2TonYear = (annualKwh * cfg.environment.co2KgPerKwh) / 1000;

  return {
    version: cfg.version,
    hsp,
    consumptionKwh: Math.round(consumptionKwh),
    system,
    energy: {
      generationKwhMonth: Math.round(generationKwhMonth),
      coverage: round(Math.min(1, generationKwhMonth / consumptionKwh), 3),
      surplusShare: round(surplus, 4),
    },
    savings: { monthlyCop: Math.round(savingsMonth), yearlyCop: Math.round(savingsMonth * 12), lifetimeCop: Math.round(lifetimeSavings) },
    investment: {
      subtotalCop: Math.round(subtotal),
      ivaCop: Math.round(iva),
      batteriesCop: Math.round(battery.costCop),
      batteryKwh: battery.kwh,
      totalCop: Math.round(total),
      lowCop: roundTo(total * (1 - cfg.pricing.rangeSpread), 1_000_000),
      highCop: roundTo(total * (1 + cfg.pricing.rangeSpread), 1_000_000),
      copPerKwp,
    },
    tax: { eligible, deductionCop: Math.round(deduction), taxSavingCop: Math.round(taxSaving) },
    payback: { years: paybackYears(cashFlow, "cumulative"), yearsWithTax: eligible ? paybackYears(cashFlow, "cumulativeWithTax") : null },
    cashFlow,
    ppa: ppaOffer(generationKwhMonth, input.tariffCopKwh, system.kwp, cfg),
    environment: {
      co2TonYear: round(co2TonYear, 1),
      co2TonLifetime: Math.round(co2TonYear * cfg.solar.lifetimeYears),
      trees: Math.round(co2TonYear / cfg.environment.co2TonPerTreeYear),
    },
    similarProject: similarProject(input.clientType, system.kwp),
  };
}

// ---------- Gestión del lead ----------

export type LeadPriority = "alta" | "media" | "baja";

/** Puntaje 0–100 y prioridad para el equipo comercial. */
export function scoreLead(input: Pick<QuoteInput, "clientType" | "billCop" | "tariffCopKwh">, result: Pick<QuoteResult, "consumptionKwh" | "system">, cfg: QuoteConfig = quoteConfig) {
  const bill = input.billCop ?? result.consumptionKwh * input.tariffCopKwh;
  let score = 0;
  if (input.clientType !== "hogar") score += 30;
  if (bill >= cfg.leadScoring.highPriorityBillCop) score += 40;
  else if (bill >= cfg.leadScoring.mediumPriorityBillCop) score += 20;
  if (result.system.kwp >= 100) score += 20;
  else if (result.system.kwp >= 30) score += 10;
  score = Math.min(100, score + 10);
  const priority: LeadPriority =
    input.clientType !== "hogar" && bill >= cfg.leadScoring.highPriorityBillCop ? "alta" : score >= 40 ? "media" : "baja";
  return { score, priority };
}

// ---------- utilidades ----------

function round(value: number, decimals: number) {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}
