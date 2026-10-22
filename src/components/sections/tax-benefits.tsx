import { deductionExample, taxBenefits, taxDisclaimer, CORPORATE_TAX_RATE } from "@/content/tax-benefits";
import { formatCOPCompact } from "@/lib/utils";

/** Los 4 incentivos + ejemplo numérico de la deducción en renta. */
export function TaxBenefits({ exampleInvestment = 500_000_000 }: { exampleInvestment?: number }) {
  const ex = deductionExample(exampleInvestment);
  const rows = [
    { label: "Inversión del proyecto", value: formatCOPCompact(ex.investmentCop) },
    { label: "Deducción en renta (50 %)", value: formatCOPCompact(ex.deduction) },
    { label: `Menor impuesto (tarifa ${CORPORATE_TAX_RATE * 100} %)`, value: formatCOPCompact(ex.taxSaving), positive: true },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <ul className="grid gap-4 sm:grid-cols-2">
        {taxBenefits.map((b) => (
          <li key={b.key} className="rounded-3xl border border-border bg-surface p-6">
            <p className="font-mono text-3xl font-semibold text-copper-text tabular">{b.value}</p>
            <h3 className="mt-3 text-lg font-bold">{b.title}</h3>
            <p className="mt-2 text-sm text-fg-muted">{b.text}</p>
            <p className="mt-4 font-mono text-[11px] text-fg-subtle">{b.article}</p>
          </li>
        ))}
      </ul>

      <div className="flex flex-col rounded-3xl border border-copper/40 bg-surface p-6 sm:p-8">
        <p className="font-mono text-[11px] tracking-[0.12em] text-fg-subtle uppercase">Ejemplo ilustrativo</p>
        <p className="mt-3 text-lg font-bold">¿Cuánto vale la deducción en renta?</p>
        <dl className="mt-6 divide-y divide-border">
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-sm text-fg-muted">{r.label}</dt>
              <dd className={`font-mono text-lg font-semibold tabular ${r.positive ? "text-positive" : ""}`}>{r.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 rounded-2xl bg-positive-soft p-4">
          <p className="text-sm">
            Recuperas hasta <strong className="font-mono text-positive tabular">{Math.round(ex.effectiveShare * 100)} %</strong> de la inversión solo en impuestos, además del
            ahorro en tu factura.
          </p>
        </div>
        <p className="mt-auto pt-6 text-xs text-fg-subtle">{taxDisclaimer}</p>
      </div>
    </div>
  );
}
