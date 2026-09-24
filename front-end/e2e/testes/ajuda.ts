import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, type Page } from "@playwright/test";
import { DATABASE_URL } from "../ambiente.mjs";

// O Prisma do back-end, para conferir no banco o que o site gravou. O cliente
// e gerado no npm ci do back-end, que o sobe-api.mjs ja exige.
const doBack = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "back-end", "package.json"));
const { PrismaClient } = doBack("@prisma/client");
const { adapterDoBanco } = doBack("./dist/prisma/adapter");

export const banco = new PrismaClient({ adapter: adapterDoBanco(DATABASE_URL) });

// Falha o teste se a pagina lancar erro de JavaScript (tela branca, componente
// quebrado). Imagem que nao carrega nao conta: o banco de teste nao tem arquivos.
export function semErroDePagina(page: Page) {
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(e.message));
  return () => expect(erros, "erros de JavaScript na pagina").toEqual([]);
}

// Nome unico por execucao e por projeto (desktop, celular), para os dois nao
// se confundirem no mesmo banco.
export function unico(prefixo: string, projeto: string) {
  return `${prefixo} ${projeto} ${Date.now()}`;
}
