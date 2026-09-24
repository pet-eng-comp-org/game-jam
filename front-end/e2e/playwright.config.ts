import { defineConfig, devices } from "@playwright/test";
import { API_URL, FRONT_PORTA, FRONT_URL } from "./ambiente.mjs";

export default defineConfig({
  testDir: "./testes",
  // Os testes mexem no mesmo banco: um de cada vez, na ordem dos arquivos.
  workers: 1,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  // Sem nova tentativa: com banco compartilhado, a segunda falharia por outro
  // motivo e esconderia o erro de verdade.
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: FRONT_URL,
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "celular", use: { ...devices["Pixel 7"] } },
  ],
  webServer: [
    {
      command: "node sobe-api.mjs",
      url: `${API_URL}/seasons/atual`,
      timeout: 120_000,
      reuseExistingServer: false,
      stdout: "pipe",
    },
    {
      command: "./sobe-front.sh",
      url: `${FRONT_URL}/`,
      timeout: 600_000,
      reuseExistingServer: false,
      // NEXT_PUBLIC_API_URL e assada no build: o front de teste aponta para a
      // API de teste.
      env: { NEXT_PUBLIC_API_URL: API_URL, PORT: String(FRONT_PORTA), HOSTNAME: "127.0.0.1" },
    },
  ],
});
