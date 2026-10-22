// Auditoría SEO básica contra un servidor corriendo.
// Uso: node scripts/seo-audit.mjs [baseUrl]   (por defecto http://localhost:3100)
const base = process.argv[2] ?? "http://localhost:3100";
const extra = ["/politica-de-privacidad/", "/terminos/"];

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).concat(extra);

const linkStatus = new Map();
async function check(href) {
  if (!linkStatus.has(href)) linkStatus.set(href, fetch(base + href, { redirect: "manual" }).then((r) => r.status));
  return linkStatus.get(href);
}

let problems = 0;
for (const path of paths) {
  const res = await fetch(base + path);
  const html = await res.text();
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  const imgsNoAlt = [...html.matchAll(/<img\b[^>]*>/g)].filter((m) => !/\balt="/.test(m[0]) && !/aria-hidden="true"/.test(m[0])).length;
  const types = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap((m) => {
    const d = JSON.parse(m[1]);
    return (d["@graph"] ?? [d]).map((x) => [x["@type"]].flat().join("+"));
  });
  const hrefs = [...new Set([...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]).filter((h) => !h.startsWith("/_next")))];
  const broken = [];
  for (const h of hrefs) {
    const s = await check(h);
    if (s >= 400) broken.push(`${h} (${s})`);
  }

  const issues = [];
  if (res.status !== 200) issues.push(`status ${res.status}`);
  if (h1 !== 1) issues.push(`${h1} h1`);
  if (title.replace(/&amp;/g, "&").length > 60) issues.push(`title ${title.length}`);
  if (!desc || desc.length > 160) issues.push(`description ${desc.length}`);
  if (!canonical.endsWith(path)) issues.push(`canonical ${canonical}`);
  if (imgsNoAlt) issues.push(`${imgsNoAlt} img sin alt`);
  if (broken.length) issues.push(`enlaces rotos: ${broken.join(", ")}`);
  problems += issues.length;

  console.log(`${issues.length ? "✗" : "✓"} ${path}`);
  console.log(`    ${title}  [${title.length}]`);
  console.log(`    desc ${desc.length} · schema: ${types.join(", ")}`);
  for (const i of issues) console.log(`    ! ${i}`);
}
console.log(problems ? `\n${problems} problemas` : "\nSin problemas");
