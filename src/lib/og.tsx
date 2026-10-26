import "server-only";
import { ImageResponse } from "next/og";
import { getProject, portfolioStats, sectorLabels } from "@/content/projects";
import { getCategory } from "@/content/blog/taxonomy";
import { getPost } from "@/lib/blog";
import { formatCOPCompact, formatNumber } from "@/lib/utils";

// Imágenes Open Graph (1200×630) servidas en /og/<...>.png por src/app/og/[...path]/route.tsx.
// Se usan rutas con extensión .png para que trailingSlash no las redirija (308).
export const OG_SIZE = { width: 1200, height: 630 };

const colors = { bg: "#0c0a09", fg: "#f5f1ee", muted: "#d9d2cc", copper: "#B03A22", copperText: "#f28b72", positive: "#82de25", surface: "#151110", border: "#2a2320" };

function Glow() {
  return <div style={{ display: "flex", position: "absolute", top: -220, left: 260, width: 760, height: 520, borderRadius: 9999, background: "rgba(166,86,59,0.35)", filter: "blur(120px)" }} />;
}

function Brand() {
  return (
    <div style={{ display: "flex", fontWeight: 800, fontSize: 34 }}>
      SOLAR<span style={{ color: colors.copperText }}>TECH</span>
    </div>
  );
}

const frame = { width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: colors.bg, color: colors.fg } as const;

export function siteOg() {
  const stats = portfolioStats();
  const kpis = [
    [`${formatNumber(stats.kwp, 0)} kWp`, "en casos de éxito"],
    [formatCOPCompact(stats.monthlySavingsCop), "de ahorro mensual"],
    [`${formatNumber(stats.paybackMin)}–${formatNumber(stats.paybackMax)} años`, "de retorno"],
  ];
  return new ImageResponse(
    (
      <div style={frame}>
        <Glow />
        <Brand />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.08, maxWidth: 980 }}>Paneles solares para empresas que se pagan solos</div>
          <div style={{ display: "flex", gap: 48, marginTop: 40 }}>
            {kpis.map(([value, label]) => (
              <div key={label} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: colors.positive }}>{value}</div>
                <div style={{ display: "flex", fontSize: 22, color: colors.muted }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: colors.muted }}>Parte del grupo Ferragro · solartechenergy.co</div>
      </div>
    ),
    OG_SIZE,
  );
}

/** Post o categoría del blog. */
export function blogOg(slug: string) {
  const post = getPost(slug);
  const category = getCategory(post?.category ?? slug);
  if (!post && !category) return null;
  const title = post?.title ?? category!.name;
  const meta = post ? `${post.readingMinutes} min de lectura` : "Guías y artículos";
  return new ImageResponse(
    (
      <div style={frame}>
        <Glow />
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: colors.copperText, textTransform: "uppercase" }}>{category?.name ?? "Blog"}</div>
        <div style={{ display: "flex", fontSize: title.length > 70 ? 54 : 66, fontWeight: 800, lineHeight: 1.1, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: colors.muted }}>
          <Brand />
          <div style={{ display: "flex" }}>{meta} · solartechenergy.co</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

/** Caso de éxito con sus cifras. */
export function projectOg(slug: string) {
  const p = getProject(slug);
  if (!p) return null;
  const stats = [
    { label: "Potencia", value: `${formatNumber(p.kwp)} kWp` },
    p.monthlySavingsCop !== null
      ? { label: "Ahorro / mes", value: formatCOPCompact(p.monthlySavingsCop), positive: true }
      : { label: "Sector", value: sectorLabels[p.sector] },
    p.paybackYears ? { label: "Retorno", value: `${formatNumber(p.paybackYears)} años` } : { label: "Inversión", value: "$0 (PPA)" },
  ];
  return new ImageResponse(
    (
      <div style={frame}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 16, height: 16, borderRadius: 8, background: colors.positive }} />
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: colors.muted }}>{`CASO DE ÉXITO · ${p.model}`}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>{p.name}</div>
          <div style={{ display: "flex", fontSize: 34, color: colors.copperText, marginTop: 12 }}>{`${p.city}, ${p.department}`}</div>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", flex: 1, border: `2px solid ${colors.border}`, borderRadius: 24, padding: "24px 28px", background: colors.surface }}>
              <div style={{ display: "flex", fontSize: 22, color: colors.muted }}>{s.label}</div>
              <div style={{ display: "flex", fontSize: 46, fontWeight: 700, marginTop: 6, color: "positive" in s && s.positive ? colors.positive : colors.fg }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `3px solid ${colors.copper}`, paddingTop: 22, fontSize: 26 }}>
          <div style={{ display: "flex", fontWeight: 800, color: colors.copper, letterSpacing: 2 }}>SOLARTECH</div>
          <div style={{ display: "flex", color: colors.muted }}>Parte del grupo Ferragro</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
