// Incentivos de la Ley 1715 de 2014, modificada por la Ley 2099 de 2021.
// Texto informativo: no constituye asesoría tributaria.

export const taxBenefits = [
  {
    key: "renta",
    title: "Deducción del 50 % en renta",
    value: "50 %",
    text: "Deduce de tu renta la mitad de la inversión, en un plazo de hasta 15 años desde la entrada en operación, sin superar el 50 % de la renta líquida de cada año.",
    article: "Art. 11 Ley 1715",
  },
  {
    key: "iva",
    title: "Exclusión de IVA",
    value: "0 %",
    text: "Los equipos, elementos y servicios destinados al proyecto, nacionales o importados, están excluidos de IVA.",
    article: "Art. 12 Ley 1715",
  },
  {
    key: "arancel",
    title: "Exención de aranceles",
    value: "0 %",
    text: "Maquinaria, equipos y materiales importados para el proyecto están exentos del gravamen arancelario.",
    article: "Art. 13 Ley 1715",
  },
  {
    key: "depreciacion",
    title: "Depreciación acelerada",
    value: "33,3 %",
    text: "Deprecia los activos del proyecto a una tasa anual de hasta 33,33 %, reduciendo la base gravable en los primeros años.",
    article: "Art. 14 Ley 1715",
  },
] as const;

/** Tarifa general del impuesto de renta para personas jurídicas (Art. 240 E.T.). */
export const CORPORATE_TAX_RATE = 0.35;

/** Ejemplo ilustrativo del beneficio por deducción en renta. */
export function deductionExample(investmentCop: number) {
  const deduction = investmentCop * 0.5;
  const taxSaving = deduction * CORPORATE_TAX_RATE;
  return { investmentCop, deduction, taxSaving, effectiveShare: taxSaving / investmentCop };
}

export const taxDisclaimer =
  "Información de referencia. Los incentivos requieren la certificación de la UPME y aplican a declarantes de renta según su situación particular. Consulta a tu asesor tributario.";
