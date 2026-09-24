// Prepara o banco de teste (APAGA e semeia com dados ficticios) e sobe a API
// compilada do back-end. E chamado pelo Playwright antes dos testes (webServer
// em playwright.config.ts) e fica rodando ate eles terminarem.
//
// Precisa de: MySQL acessivel por E2E_DATABASE_URL e do back-end compilado
// (`npm ci && npm run build` em back-end/).

import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { API_PORTA, DATABASE_URL, FRONT_URL, ORGANIZADOR } from "./ambiente.mjs";

const BACK = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "back-end");

if (!existsSync(path.join(BACK, "dist", "server.js"))) {
  console.error("back-end sem build: rode `npm ci && npm run build` em back-end/");
  process.exit(1);
}

const env = { ...process.env, DATABASE_URL };

const semeia = spawnSync(process.execPath, ["scripts/banco-e2e.js"], {
  cwd: BACK,
  env: { ...env, E2E_USUARIO: ORGANIZADOR.usuario, E2E_SENHA: ORGANIZADOR.senha },
  stdio: "inherit",
});
if (semeia.status !== 0) process.exit(semeia.status ?? 1);

const api = spawn(process.execPath, ["dist/server.js"], {
  cwd: BACK,
  env: {
    ...env,
    NODE_ENV: "production",
    PORT: String(API_PORTA),
    JWT_SECRET: "segredo-e2e",
    CORS_ORIGENS: FRONT_URL,
  },
  stdio: "inherit",
});

for (const sinal of ["SIGINT", "SIGTERM"]) process.on(sinal, () => api.kill(sinal));
api.on("exit", (codigo) => process.exit(codigo ?? 0));
