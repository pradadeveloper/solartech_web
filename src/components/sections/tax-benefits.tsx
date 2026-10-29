import { Fragment } from "react";
import { taxBenefits } from "@/content/tax-benefits";
import { DeductionSimulator } from "@/components/sections/deduction-simulator";
import { RevealList } from "@/components/ui/reveal-list";

/** Los 4 incentivos + simulador de la deducción en renta. */
export function TaxBenefits({ exampleInvestment = 500_000_000 }: { exampleInvestment?: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <RevealList
        className="grid gap-4 sm:grid-cols-2"
        itemClassName="group rounded-3xl border border-border bg-surface p-6 transition-colors hover:border-copper/50"
        items={taxBenefits.map((b) => (
          // La lista viaja como prop al componente cliente: cada elemento necesita su key.
          <Fragment key={b.key}>
            <p className="origin-left font-mono text-3xl font-semibold text-copper-text tabular transition-transform duration-300 group-hover:scale-110">{b.value}</p>
            <h3 className="mt-3 text-lg font-bold">{b.title}</h3>
            <p className="mt-2 text-sm text-fg-muted">{b.text}</p>
            <p className="mt-4 font-mono text-[11px] text-fg-subtle">{b.article}</p>
          </Fragment>
        ))}
        keys={taxBenefits.map((b) => b.key)}
      />
      <DeductionSimulator initial={exampleInvestment} />
    </div>
  );
}
