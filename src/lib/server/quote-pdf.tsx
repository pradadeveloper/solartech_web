import "server-only";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import type { QuoteResult } from "@/lib/quote-engine";
import { site } from "@/content/site";
import { formatCOP, formatNumber } from "@/lib/utils";

const copper = "#A6563B";
const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: "#1D1512", fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `2 solid ${copper}`, paddingBottom: 12 },
  brand: { fontSize: 22, fontFamily: "Helvetica-Bold", color: copper },
  muted: { color: "#57504C" },
  h1: { fontSize: 18, fontFamily: "Helvetica-Bold", marginTop: 20 },
  h2: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 18, marginBottom: 8, color: copper },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
  card: { width: "33.33%", padding: 4 },
  cardInner: { border: "1 solid #E7E5E4", borderRadius: 6, padding: 10 },
  label: { fontSize: 8, color: "#57504C" },
  value: { fontSize: 13, fontFamily: "Helvetica-Bold", marginTop: 3 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, borderBottom: "1 solid #F1F1F1" },
  disclaimer: { marginTop: 24, padding: 10, backgroundColor: "#F1F1F1", borderRadius: 6, fontSize: 8, color: "#57504C" },
  footer: { position: "absolute", bottom: 28, left: 40, right: 40, fontSize: 8, color: "#78706B", flexDirection: "row", justifyContent: "space-between" },
});

type Props = { result: QuoteResult; name: string; city: string; date: Date };

function QuotePdf({ result: r, name, city, date }: Props) {
  const cards = [
    ["Sistema solar", `${formatNumber(r.system.kwp)} kWp`],
    ["Paneles", `${r.system.panels} × ${r.system.panelWp} W`],
    ["Área requerida", `${r.system.areaM2} m²`],
    ["Generación mensual", `${formatNumber(r.energy.generationKwhMonth, 0)} kWh`],
    ["Ahorro mensual", formatCOP(r.savings.monthlyCop)],
    ["Retorno", r.payback.years ? `${formatNumber(r.payback.years)} años` : "—"],
  ];
  return (
    <Document title={`Pre-cotización solar Solartech – ${name}`} author="Solartech">
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.brand}>SOLARTECH</Text>
          <Text style={s.muted}>{date.toLocaleDateString("es-CO", { dateStyle: "long" })}</Text>
        </View>
        <Text style={s.h1}>Pre-cotización de energía solar</Text>
        <Text style={[s.muted, { marginTop: 4 }]}>
          Preparada para {name} · {city}
        </Text>

        <Text style={s.h2}>Tu sistema</Text>
        <View style={s.grid}>
          {cards.map(([label, value]) => (
            <View key={label} style={s.card}>
              <View style={s.cardInner}>
                <Text style={s.label}>{label}</Text>
                <Text style={s.value}>{value}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={s.h2}>Inversión y retorno (compra EPC)</Text>
        <View style={s.row}>
          <Text>Inversión estimada (rango)</Text>
          <Text>
            {formatCOP(r.investment.lowCop)} – {formatCOP(r.investment.highCop)}
          </Text>
        </View>
        {r.investment.batteryKwh > 0 && (
          <View style={s.row}>
            <Text>Incluye banco de baterías</Text>
            <Text>{r.investment.batteryKwh} kWh</Text>
          </View>
        )}
        <View style={s.row}>
          <Text>Ahorro anual (año 1)</Text>
          <Text>{formatCOP(r.savings.yearlyCop)}</Text>
        </View>
        <View style={s.row}>
          <Text>Ahorro acumulado a 25 años</Text>
          <Text>{formatCOP(r.savings.lifetimeCop)}</Text>
        </View>
        {r.tax.eligible && (
          <View style={s.row}>
            <Text>Beneficio tributario estimado (Ley 1715)</Text>
            <Text>{formatCOP(r.tax.taxSavingCop)}</Text>
          </View>
        )}
        {r.payback.yearsWithTax && (
          <View style={s.row}>
            <Text>Retorno con beneficio tributario</Text>
            <Text>{formatNumber(r.payback.yearsWithTax)} años</Text>
          </View>
        )}

        {r.ppa.available && (
          <>
            <Text style={s.h2}>Alternativa sin inversión (PPA)</Text>
            <View style={s.row}>
              <Text>Precio de la energía solar</Text>
              <Text>
                {formatCOP(r.ppa.tariffCopKwh)}/kWh ({Math.round(r.ppa.discount * 100)} % menos que tu tarifa)
              </Text>
            </View>
            <View style={s.row}>
              <Text>Ahorro estimado durante {r.ppa.termYears} años</Text>
              <Text>{formatCOP(r.ppa.termSavingsCop)}</Text>
            </View>
          </>
        )}

        <Text style={s.h2}>Impacto ambiental</Text>
        <View style={s.row}>
          {/* Helvetica estándar (WinAnsi) no tiene el subíndice ₂. */}
          <Text>CO2 evitado por año</Text>
          <Text>{formatNumber(r.environment.co2TonYear)} toneladas · equivale a {formatNumber(r.environment.trees, 0)} árboles</Text>
        </View>

        <Text style={s.disclaimer}>
          Pre-cotización referencial generada con el cotizador web (parámetros {r.version}). La propuesta final requiere visita técnica y análisis de factura. El beneficio
          tributario es informativo, requiere certificación de la UPME y depende de la situación de cada declarante.
        </Text>

        <View style={s.footer} fixed>
          <Text>
            {site.name} · Parte del grupo {site.parent.name}
          </Text>
          <Text>
            {site.contact.phoneDisplay} · {site.contact.email}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export function renderQuotePdf(props: Props) {
  return renderToBuffer(<QuotePdf {...props} />);
}
