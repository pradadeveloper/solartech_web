import { ArrowRightLeft, Building2, ChevronRight, SolarPanel, UtilityPole, Zap } from "lucide-react";
import { generationExample } from "@/content/sales-deck";
import { formatCOP, formatNumber } from "@/lib/utils";

const flow = [
  { icon: SolarPanel, title: "Paneles solares", text: "Convierten la luz del sol en corriente continua (DC)." },
  { icon: Zap, title: "Inversor", text: "Transforma la energía DC en corriente alterna (AC) para tu instalación." },
  { icon: Building2, title: "Tu consumo", text: "La energía va primero a tus equipos: lo que consumes deja de comprarse a la red." },
  { icon: ArrowRightLeft, title: "Medidor bidireccional", text: "Registra lo que tomas de la red y los excedentes que le entregas." },
  { icon: UtilityPole, title: "Operador de red", text: "Recibe los excedentes y te los reconoce en tu factura (CREG 174)." },
];

// Curva del día (6 a. m. a 6 p. m.): generación en campana y consumo plano. El nivel del consumo
// se calcula para que el autoconsumo sea exactamente la fracción del ejemplo de la presentación.
const HOURS = { start: 6, end: 18 };
const gen = (t: number) => (t <= HOURS.start || t >= HOURS.end ? 0 : Math.exp(-(((t - 12) / 2.6) ** 2)));
const SAMPLES = Array.from({ length: 121 }, (_, i) => HOURS.start + (i * (HOURS.end - HOURS.start)) / 120);

function consumptionLevel(selfShare: number) {
  const total = SAMPLES.reduce((s, t) => s + gen(t), 0);
  let lo = 0;
  let hi = 1;
  for (let k = 0; k < 40; k++) {
    const mid = (lo + hi) / 2;
    const self = SAMPLES.reduce((s, t) => s + Math.min(gen(t), mid), 0) / total;
    if (self < selfShare) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const W = 600;
const H = 260;
const PAD = { l: 16, r: 16, t: 20, b: 34 };
const x = (t: number) => PAD.l + ((t - HOURS.start) / (HOURS.end - HOURS.start)) * (W - PAD.l - PAD.r);
const y = (v: number) => H - PAD.b - v * (H - PAD.t - PAD.b);

function GenerationCurve() {
  const level = consumptionLevel(generationExample.selfConsumptionShare);
  const genLine = SAMPLES.map((t, i) => `${i ? "L" : "M"}${x(t).toFixed(1)},${y(gen(t)).toFixed(1)}`).join(" ");
  const selfArea = `M${x(HOURS.start)},${y(0)} ` + SAMPLES.map((t) => `L${x(t).toFixed(1)},${y(Math.min(gen(t), level)).toFixed(1)}`).join(" ") + ` L${x(HOURS.end)},${y(0)} Z`;
  const surplusArea =
    SAMPLES.map((t, i) => `${i ? "L" : "M"}${x(t).toFixed(1)},${y(Math.max(gen(t), level)).toFixed(1)}`).join(" ") +
    " " +
    [...SAMPLES].reverse().map((t) => `L${x(t).toFixed(1)},${y(level).toFixed(1)}`).join(" ") +
    " Z";
  const selfPct = Math.round(generationExample.selfConsumptionShare * 100);
  const surplusPct = Math.round(generationExample.surplusShare * 100);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Curva de generación solar de 6 a. m. a 6 p. m.: ${selfPct} % se consume directamente y ${surplusPct} % se entrega a la red como excedente`}>
      <path d={selfArea} fill="var(--positive)" opacity={0.22} />
      <path d={surplusArea} fill="var(--copper)" opacity={0.3} />
      <line x1={x(HOURS.start)} x2={x(HOURS.end)} y1={y(level)} y2={y(level)} stroke="var(--fg-muted)" strokeDasharray="6 6" strokeWidth={1.5} />
      <path d={genLine} fill="none" stroke="var(--copper-text)" strokeWidth={3} strokeLinecap="round" />
      <line x1={PAD.l} x2={W - PAD.r} y1={y(0)} y2={y(0)} stroke="var(--border-strong)" />
      <text x={x(12)} y={y(0.78)} textAnchor="middle" fill="var(--fg)" fontSize={14} fontWeight={700}>
        Excedentes · {surplusPct} %
      </text>
      <text x={x(12)} y={y(level / 2) + 5} textAnchor="middle" fill="var(--fg)" fontSize={14} fontWeight={700}>
        Autoconsumo · {selfPct} %
      </text>
      <text x={x(HOURS.end) - 4} y={y(level) - 8} textAnchor="end" fill="var(--fg-muted)" fontSize={12}>
        Tu consumo
      </text>
      {[6, 9, 12, 15, 18].map((t) => (
        // Los extremos se anclan hacia adentro para que no se corten en el borde del SVG.
        <text key={t} x={x(t)} y={H - 10} textAnchor={t === HOURS.start ? "start" : t === HOURS.end ? "end" : "middle"} fill="var(--fg-subtle)" fontSize={12}>
          {t < 12 ? `${t} a. m.` : t === 12 ? "12 m." : `${t - 12} p. m.`}
        </text>
      ))}
    </svg>
  );
}

/** ¿Cómo funciona un sistema solar? Flujo de la energía + curva del día con un ejemplo de ahorro. */
export function HowItWorks() {
  const ex = generationExample;
  const selfKwh = ex.generationKwhMonth * ex.selfConsumptionShare;
  const surplusKwh = ex.generationKwhMonth * ex.surplusShare;
  const selfCop = selfKwh * ex.tariffCopKwh;
  const surplusCop = surplusKwh * ex.surplusCopKwh;

  return (
    <div className="space-y-6">
      <ol className="grid gap-3 md:grid-cols-5">
        {flow.map((step, i) => (
          <li key={step.title} className="relative flex gap-4 rounded-3xl border border-border bg-surface p-5 md:flex-col md:gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-copper-soft text-copper-text">
              <step.icon aria-hidden className="size-5" />
            </span>
            <span>
              <span className="block font-bold">{step.title}</span>
              <span className="mt-1 block text-sm text-fg-muted">{step.text}</span>
            </span>
            {i < flow.length - 1 && (
              <span aria-hidden className="absolute top-1/2 -right-3 z-10 hidden size-6 -translate-y-1/2 place-items-center rounded-full border border-border bg-bg text-fg-subtle md:grid">
                <ChevronRight className="size-3.5" />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <h3 className="text-lg font-bold">Un día de tu planta solar</h3>
          <p className="mt-1 text-sm text-fg-muted">
            Lo que generas mientras consumes se descuenta directo de tu factura; lo que sobra se entrega a la red como excedente. Cada kWp produce de {ex.kwhPerKwpDay} kWh al día según
            la región.
          </p>
          <div className="mt-6">
            <GenerationCurve />
          </div>
        </div>

        <div className="flex flex-col rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Ejemplo ilustrativo</p>
          <h3 className="mt-3 text-lg font-bold">Así se traduce en tu factura</h3>
          <dl className="mt-5 divide-y divide-border text-sm">
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-fg-muted">Generación del mes</dt>
              <dd className="font-mono font-semibold tabular">{formatNumber(ex.generationKwhMonth, 0)} kWh</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-fg-muted">
                Autoconsumo {Math.round(ex.selfConsumptionShare * 100)} % × {formatCOP(ex.tariffCopKwh)}/kWh
              </dt>
              <dd className="font-mono font-semibold tabular">{formatCOP(selfCop)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-fg-muted">
                Excedentes {Math.round(ex.surplusShare * 100)} % × {formatCOP(ex.surplusCopKwh)}/kWh
              </dt>
              <dd className="font-mono font-semibold tabular">{formatCOP(surplusCop)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="font-semibold">Ahorro del mes</dt>
              <dd className="font-mono text-xl font-semibold text-positive tabular">{formatCOP(selfCop + surplusCop)}</dd>
            </div>
          </dl>
          <p className="mt-auto pt-4 text-xs text-fg-subtle">
            Valores de referencia. La tarifa y el precio de los excedentes dependen de tu operador de red y del tamaño del sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
