// Prepara o banco dos testes de ponta a ponta (front-end/e2e): APAGA o banco de
// DATABASE_URL, recria pelas migrations e semeia dados ficticios. Chamado pelo
// front-end/e2e/sobe-api.mjs antes de subir a API.
//
// Trava: so aceita banco cujo nome termine em _e2e, para nunca apagar um de
// verdade por engano.

const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { hash } = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
// Compilado: o sobe-api.mjs so chama este script depois de conferir o build.
const { adapterDoBanco } = require("../dist/prisma/adapter");

const RAIZ = path.join(__dirname, "..");
const URL_BANCO = process.env.DATABASE_URL;
const NOME_BANCO = URL_BANCO ? new URL(URL_BANCO).pathname.slice(1) : "";

if (!NOME_BANCO.endsWith("_e2e")) {
  console.error(`recuso apagar o banco "${NOME_BANCO}": o nome precisa terminar em _e2e`);
  process.exit(1);
}

function prismaCli(args, entrada, erros = "inherit") {
  execFileSync(process.execPath, [require.resolve("prisma/build/index.js"), ...args], {
    cwd: RAIZ,
    env: process.env,
    input: entrada,
    stdio: ["pipe", "ignore", erros],
  });
}

async function main() {
  // Mesmo caminho do test/api.test.js: na primeira execucao o banco nao existe,
  // a conexao falha e o migrate deploy cria.
  try {
    prismaCli(["db", "execute", "--stdin"],
      `DROP DATABASE \`${NOME_BANCO}\`; CREATE DATABASE \`${NOME_BANCO}\`;`, "ignore");
  } catch {}
  prismaCli(["migrate", "deploy"]);

  const prisma = new PrismaClient({ adapter: adapterDoBanco(URL_BANCO) });
  try {
    await prisma.user.create({
      data: { username: process.env.E2E_USUARIO, senha: await hash(process.env.E2E_SENHA, 8) },
    });
    await prisma.season.create({
      data: {
        numero: "4", capa: "capa.png", numParticipantesPorEquipe: "3", atual: true,
        // Inscricoes abertas: de ontem a daqui a 30 dias.
        inscricoesAbrem: new Date(Date.now() - 86400000), inscricoesFecham: new Date(Date.now() + 30 * 86400000),
        dataEvento: new Date("2026-11-15T12:00:00Z"), linguagens: "C\nC++\nPython",
        regulamento: "## O formato\n\n1. A competição acontece em um único dia.\n2. Cada equipe recebe um jogo preparado para o evento.",
      },
    });
    // Os jogos sao os de verdade, que a migration traz para as seasons 1 a 3.
    await prisma.patrocinador.create({ data: { nome: "Patrocinador E2E", logo: "logo.png" } });
    await prisma.material.create({ data: { nome: "Material E2E", link: "https://exemplo.com/material", descricao: "Descricao do material" } });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
