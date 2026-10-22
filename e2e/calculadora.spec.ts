import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => localStorage.setItem("st_consent_v1", JSON.stringify({ analytics: "denied", marketing: "denied" })));
  await context.route(/googletagmanager\.com/, (r) => r.abort());
});

test("calculadora: factura → ahorro en vivo → cotizador con los datos", async ({ page }) => {
  await page.goto("/calculadora-ahorro/");
  const result = page.getByRole("region", { name: "Tu ahorro estimado" });
  await expect(result.getByText("Podrías ahorrar cada mes")).toBeVisible();

  await page.getByText("Agro", { exact: true }).click();
  await page.getByLabel("Departamento").selectOption("Bolívar");
  await page.getByLabel("Tu factura de energía mensual").fill("20000000");
  await expect(result.getByText(/kWp/)).toBeVisible();

  // Factura muy baja: mensaje claro, sin resultados.
  await page.getByLabel("Tu factura de energía mensual").fill("20000");
  await expect(result.getByText(/muy bajos para un sistema solar/)).toBeVisible();

  await page.getByRole("button", { name: "$15M" }).click();
  await page.getByRole("link", { name: "Ver inversión y retorno" }).click();
  await expect(page).toHaveURL(/\/cotizador\/\?tipo=agro&dep=Bol%C3%ADvar.*factura=15000000/);
  await expect(page.getByText("Paso 2 de 4")).toBeVisible();
});
