// Configuracao da CLI do Prisma (migrate, generate). Desde o Prisma 7 a URL do
// banco mora aqui, e nao mais no schema.prisma; a API em execucao recebe a
// mesma DATABASE_URL pelo adapter, em src/prisma/index.ts.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // process.env e nao env(): o generate roda no build da imagem, sem banco nem
  // variavel, e env() recusa variavel ausente.
  datasource: { url: process.env.DATABASE_URL ?? "" },
});
