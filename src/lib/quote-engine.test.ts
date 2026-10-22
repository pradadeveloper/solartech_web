import { describe, expect, it } from "vitest";
import {
  computeQuote,
  monthlyGeneration,
  monthlySavings,
  paybackYears,
  pricePerKwp,
  projectCashFlow,
  QuoteError,
  resolveHsp,
  scoreLead,
  similarProject,
  sizeSystem,
  surplusShare,
  type QuoteInput,
} from "@/lib/quote-engine";
import { quoteConfig } from "@/config/quote-config";
import { projects } from "@/content/projects";

// Vector de referencia: hoja "DATOS ENTRADA (2)" del Excel = solartech_app/formulas.js.
// 1.000 kWh/mes, $800/kWh, 100 m², HSP 3,5, panel 620 W, $4,5M/kWp.
describe("paridad con el Excel / solartech_app", () => {
  const sys = sizeSystem(1000, 3.5, 100);
  const gen = monthlyGeneration(sys.kwp, 3.5);
  const surplus = surplusShare(gen, 1000);

  it("dimensiona 9,30 kWp con 15 paneles", () => {
    expect(sys.kwp).toBe(9.3);
    expect(sys.panels).toBe(15);
    expect(sys.acKw).toBeCloseTo(7.2, 1);
  });

  it("genera ≈990 kWh/mes con 48,3 % de excedentes", () => {
    expect(Math.round(gen)).toBe(990);
    expect(surplus).toBeCloseTo(0.4833, 3);
  });

  it("ahorra ≈$734.600 al mes", () => {
    expect(monthlySavings(gen, surplus, 800, sys.kwp)).toBeCloseTo(734_600, -3);
  });

  it("inversión total $43.942.500 con $4,5M/kWp e IVA 5 %", () => {
    const r = computeQuote({ clientType: "hogar", departamento: "Antioquia", municipio: "Medellín", consumptionKwh: 1000, tariffCopKwh: 800, areaM2: 100, batteries: false, modelInterest: "epc" });
    expect(r.investment.copPerKwp).toBe(4_500_000);
    expect(r.investment.totalCop).toBe(43_942_500);
  });
});

describe("dimensionamiento", () => {
  it("el área disponible limita el sistema", () => {
    const s = sizeSystem(20_000, 4, 200);
    expect(s.limitedBy).toBe("area");
    expect(s.areaM2).toBeLessThanOrEqual(200);
  });

  it("aplica el límite regulatorio de autogeneración (Excel F7)", () => {
    // 60.000 kWh/mes en Cartagena → ≈411 kWp por consumo; tope = max(135, 52 % del consumo).
    const s = sizeSystem(60_000, 4.8, undefined);
    expect(s.limitedBy).toBe("regulacion");
    expect(s.kwp).toBeLessThanOrEqual((60_000 * 12) / (4.8 * 365) * 0.52 + 0.62);
    expect(s.kwp).toBeGreaterThan(135);
  });

  it("rechaza consumos demasiado bajos", () => {
    expect(() => sizeSystem(30, 3.5, undefined)).toThrow(QuoteError);
  });

  it("calcula el consumo desde la factura", () => {
    const r = computeQuote({ clientType: "empresa", departamento: "Antioquia", municipio: "Medellín", billCop: 8_300_000, tariffCopKwh: 830, batteries: false, modelInterest: "no_se" });
    expect(r.consumptionKwh).toBe(10_000);
  });
});

describe("ubicación y precios", () => {
  it("resuelve HSP por municipio, luego departamento, luego valor por defecto", () => {
    expect(resolveHsp("Antioquia", "Rionegro")).toBe(3.8);
    expect(resolveHsp("Antioquia", "Municipio inexistente")).toBe(3.5);
    expect(resolveHsp("Departamento inexistente", "X")).toBe(quoteConfig.solar.defaultHsp);
  });

  it("el $/kWp baja con el tamaño", () => {
    expect(pricePerKwp(10)).toBeGreaterThan(pricePerKwp(100));
    expect(pricePerKwp(100)).toBeGreaterThan(pricePerKwp(1000));
  });
});

describe("proyección financiera", () => {
  it("payback interpolado y el beneficio tributario lo acorta", () => {
    const flows = projectCashFlow({ totalInvestment: 100, firstYearSavings: 25, maintenanceYear1: 0, taxSaving: 20 });
    const base = paybackYears(flows, "cumulative")!;
    const withTax = paybackYears(flows, "cumulativeWithTax")!;
    expect(base).toBeGreaterThan(3);
    expect(base).toBeLessThan(4);
    expect(withTax).toBeLessThan(base);
  });

  it("el beneficio tributario solo cuenta para empresa y agro", () => {
    const base: QuoteInput = { clientType: "hogar", departamento: "Antioquia", municipio: "Medellín", billCop: 1_500_000, tariffCopKwh: 830, batteries: false, modelInterest: "epc" };
    expect(computeQuote(base).payback.yearsWithTax).toBeNull();
    expect(computeQuote({ ...base, clientType: "empresa" }).payback.yearsWithTax).not.toBeNull();
  });

  it("deducción = 50 % de la inversión antes de IVA y ahorro de impuesto = deducción × 35 %", () => {
    const r = computeQuote({ clientType: "empresa", departamento: "Antioquia", municipio: "Medellín", billCop: 10_000_000, tariffCopKwh: 830, batteries: false, modelInterest: "epc" });
    expect(r.tax.deductionCop).toBe(Math.round(r.investment.subtotalCop * 0.5));
    expect(r.tax.taxSavingCop).toBeCloseTo(r.tax.deductionCop * 0.35, -1);
  });

  it("las baterías suben la inversión y alargan el retorno", () => {
    const base: QuoteInput = { clientType: "agro", departamento: "Antioquia", municipio: "Támesis", billCop: 5_000_000, tariffCopKwh: 830, batteries: false, modelInterest: "epc" };
    const a = computeQuote(base);
    const b = computeQuote({ ...base, batteries: true });
    expect(b.investment.batteriesCop).toBeGreaterThan(0);
    expect(b.investment.totalCop).toBeGreaterThan(a.investment.totalCop);
    expect(b.payback.years!).toBeGreaterThan(a.payback.years!);
  });
});

describe("validación de cordura contra proyectos reales", () => {
  // Los proyectos de Solartech de ~135 kWp recuperan la inversión en 3–3,8 años.
  it("una empresa de ~135 kWp en Medellín tiene retorno de 3 a 5 años", () => {
    const r = computeQuote({ clientType: "empresa", departamento: "Antioquia", municipio: "Medellín", billCop: 30_000_000, tariffCopKwh: 830, batteries: false, modelInterest: "epc" });
    expect(r.system.kwp).toBeGreaterThan(100);
    expect(r.payback.years!).toBeGreaterThanOrEqual(3);
    expect(r.payback.years!).toBeLessThanOrEqual(5);
  });

  it("muestra el caso de éxito más parecido por sector y tamaño", () => {
    expect(similarProject("agro", 130)?.slug).toBe("agricolas-unidas");
    expect(similarProject("empresa", 500)?.slug).toBe("absorbentes-de-colombia");
    // Hogares: casas y copropiedades; se prefiere el que tiene ahorro mensual documentado.
    const hogar = similarProject("hogar", 30, projects);
    expect(["residencial", "copropiedad"]).toContain(projects.find((p) => p.slug === hogar?.slug)?.sector);
    expect(hogar?.monthlySavingsCop).not.toBeNull();
  });
});

describe("PPA y lead scoring", () => {
  it("PPA: tarifa con 35 % de descuento y disponible desde 30 kWp", () => {
    const r = computeQuote({ clientType: "empresa", departamento: "Antioquia", municipio: "Medellín", billCop: 10_000_000, tariffCopKwh: 800, batteries: false, modelInterest: "ppa" });
    expect(r.ppa.tariffCopKwh).toBe(520);
    expect(r.ppa.available).toBe(true);
    expect(r.ppa.monthlySavingsCop).toBeGreaterThan(0);
  });

  it("empresa con factura > $5M es prioridad alta; hogar pequeño es baja", () => {
    const big = computeQuote({ clientType: "empresa", departamento: "Antioquia", municipio: "Medellín", billCop: 6_000_000, tariffCopKwh: 830, batteries: false, modelInterest: "epc" });
    expect(scoreLead({ clientType: "empresa", billCop: 6_000_000, tariffCopKwh: 830 }, big).priority).toBe("alta");
    const small = computeQuote({ clientType: "hogar", departamento: "Antioquia", municipio: "Medellín", billCop: 400_000, tariffCopKwh: 830, batteries: false, modelInterest: "epc" });
    expect(scoreLead({ clientType: "hogar", billCop: 400_000, tariffCopKwh: 830 }, small).priority).toBe("baja");
  });
});
