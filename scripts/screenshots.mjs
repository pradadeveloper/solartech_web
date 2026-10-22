// Capturas de página completa en tema oscuro/claro, escritorio/móvil.
// Uso: node scripts/screenshots.mjs <carpeta-salida> [ruta1 ruta2 ...] [--base=http://localhost:3100] [--only=desktop-dark,mobile-light]
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const out = args.find((a) => !a.startsWith("/") && !a.startsWith("--"));
const routes = args.filter((a) => a.startsWith("/"));
const base = args.find((a) => a.startsWith("--base="))?.slice(7) ?? "http://localhost:3100";
const only = args.find((a) => a.startsWith("--only="))?.slice(7).split(",");
if (!out) throw new Error("Falta la carpeta de salida");

const variants = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
].flatMap(([name, viewport]) => ["dark", "light"].map((theme) => ({ id: `${name}-${theme}`, viewport, theme })));

const browser = await chromium.launch();
for (const route of routes.length ? routes : ["/"]) {
  const slug = route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/\//g, "_");
  for (const v of variants.filter((v) => !only || only.includes(v.id))) {
    const ctx = await browser.newContext({ viewport: v.viewport });
    await ctx.addInitScript((t) => {
      localStorage.setItem("theme", t);
      localStorage.setItem("st_consent_v1", JSON.stringify({ analytics: "denied", marketing: "denied" }));
    }, v.theme);
    // GTM no se carga en capturas (y en la red corporativa falla el certificado).
    await ctx.route(/googletagmanager\.com/, (r) => r.abort());
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base + route, { waitUntil: "load" });
    // Recorre la página para disparar animaciones y carga diferida de imágenes.
    // Scroll real con la rueda: los IntersectionObserver necesitan ver cada tramo.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 500) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(80);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await page.screenshot({ path: `${out}/${slug}-${v.id}.png`, fullPage: true });
    if (errors.length || overflow > 0) console.log(route, v.id, { errors, horizontalOverflowPx: overflow });
    await ctx.close();
  }
}
await browser.close();
console.log("ok");
