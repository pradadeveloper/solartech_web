import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  // Sin banner de cookies ni GTM en las pruebas.
  await context.addInitScript(() => localStorage.setItem("st_consent_v1", JSON.stringify({ analytics: "denied", marketing: "denied" })));
  await context.route(/googletagmanager\.com/, (r) => r.abort());
});

async function events(page: Page) {
  return page.evaluate(() => (window.dataLayer ?? []).map((e) => (e as { event?: string }).event).filter(Boolean));
}

test("flujo completo: hero → cotizador → resultado", async ({ page }) => {
  await page.goto("/");
  const starter = page.locator("form", { has: page.getByText("Calcula cuánto ahorrarías") });
  await starter.getByText("Agro").click();
  await starter.getByLabel("Municipio").selectOption("Támesis");
  await starter.getByLabel("Factura de energía mensual").fill("8000000");
  await starter.getByRole("button", { name: "Calcular mi ahorro" }).click();

  // Llega al paso 2 con los datos del hero.
  await expect(page).toHaveURL(/\/cotizador\/\?tipo=agro/);
  await expect(page.getByText("Paso 2 de 4")).toBeVisible();
  await expect(page.getByLabel("Factura mensual promedio")).toHaveValue("8.000.000");
  await expect(page.getByText("Podrías ahorrar al mes")).toBeVisible();

  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Paso 3 de 4")).toBeVisible();
  await page.getByText("Lámina / metálico").click();
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page.getByText("Paso 4 de 4")).toBeVisible();
  // Validación: sin consentimiento no avanza.
  await page.getByLabel("Nombre completo").fill("Laura Gómez");
  await page.getByLabel("Correo electrónico").fill("laura@example.com");
  await page.getByLabel("Celular / WhatsApp").fill("310 555 1234");
  await page.getByRole("button", { name: "Ver mi pre-cotización" }).click();
  await expect(page.getByText("Debes autorizar el tratamiento de datos")).toBeVisible();

  await page.getByRole("checkbox", { name: /Autorizo a Solartech/ }).check();
  await page.getByRole("button", { name: "Ver mi pre-cotización" }).click();

  await expect(page.getByRole("heading", { name: /Laura, tu planta solar podría ahorrarte/ })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText("Inversión estimada")).toBeVisible();
  await expect(page.getByText("Flujo de caja acumulado")).toBeVisible();
  await expect(page.getByRole("link", { name: "Hablar con un asesor" })).toHaveAttribute("href", /wa\.me\/573102587657.*Laura/);

  const fired = await events(page);
  for (const e of ["quote_start", "quote_step_1", "quote_step_2", "quote_step_3", "quote_complete", "generate_lead"]) expect(fired).toContain(e);
});

test("valida la factura y el consumo mínimo", async ({ page }) => {
  await page.goto("/cotizador/");
  await page.getByText("Empresa", { exact: true }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Ingresa el valor de tu factura o tu consumo en kWh")).toBeVisible();

  await page.getByLabel("Factura mensual promedio").fill("20000");
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText(/muy bajos para un sistema solar/)).toBeVisible();
});

test("API rechaza datos inválidos y el honeypot no guarda", async ({ request }) => {
  const invalid = await request.post("/api/leads/", { multipart: { payload: JSON.stringify({ source: "cotizador", nombre: "x" }) } });
  expect(invalid.status()).toBe(422);

  const bot = await request.post("/api/leads/", { multipart: { payload: "{}", website: "spam" } });
  expect(bot.status()).toBe(200);
});
