import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineConfig, devices } from "@playwright/test";

// E2E contra el build de producción en modo de prueba (sin Supabase ni Turnstile).
// Requiere `npm run build` antes. Uso: npm run test:e2e
export default defineConfig({
  testDir: "e2e",
  // En local la carpeta del proyecto está en OneDrive, que bloquea el borrado de test-results.
  outputDir: process.env.CI ? "test-results" : join(tmpdir(), "solartech-test-results"),
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: "http://localhost:3200", trace: "retain-on-failure" },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npx next start -p 3200",
    url: "http://localhost:3200",
    reuseExistingServer: !process.env.CI,
    env: { LEADS_DRY_RUN: "1" },
  },
});
