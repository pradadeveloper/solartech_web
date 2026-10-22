import { regulationRefs, surplusRules } from "@/content/sales-deck";

/** Venta de excedentes según el tamaño del sistema (CREG 174 de 2021). */
export function SurplusTable() {
  return (
    <div>
      <div className="overflow-x-auto rounded-3xl border border-border bg-surface">
        <table className="w-full min-w-[620px] text-left text-sm">
          <caption className="sr-only">Venta de excedentes de energía solar según el tamaño del sistema, Resolución CREG 174 de 2021</caption>
          <thead className="bg-surface-2 text-xs text-fg-muted">
            <tr>
              <th scope="col" className="px-5 py-4 font-semibold">Tamaño del sistema</th>
              <th scope="col" className="px-5 py-4 font-semibold">Pago de los excedentes</th>
              <th scope="col" className="px-5 py-4 font-semibold">Referencia</th>
              <th scope="col" className="px-5 py-4 font-semibold">Requisitos extra</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {surplusRules.map((r) => (
              <tr key={r.range}>
                <th scope="row" className="px-5 py-4 text-left font-mono font-semibold whitespace-nowrap tabular">
                  {r.range}
                </th>
                <td className="px-5 py-4 text-fg-muted">{r.price}</td>
                <td className="px-5 py-4 font-mono whitespace-nowrap tabular">{r.example}</td>
                <td className="px-5 py-4 text-fg-muted">{r.extras}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-fg-subtle">
        Valores de referencia. La liquidación real de los excedentes depende de tu operador de red y de las condiciones del mercado.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {regulationRefs.map((ref) => (
          <li key={ref} className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-fg-muted">
            {ref}
          </li>
        ))}
      </ul>
    </div>
  );
}
