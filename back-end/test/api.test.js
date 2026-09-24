// Testes de cenario da API: sobem o servidor compilado (dist/, o mesmo codigo da
// imagem) contra um MySQL de verdade e conversam com ele por HTTP, como o site e
// o painel fazem.
//
// O foco e o que nao pode quebrar sem ninguem ver: quem escreve e quem le dado de
// participante (nome, e-mail e CPF), o login do painel e o caminho da inscricao.
// Cada teste de acesso aqui corresponde a uma falha que ja existiu e foi
// corrigida — o teste e o que impede a volta dela.
//
// Rodar: `npm test` com um MySQL acessivel. O banco de DATABASE_URL_TESTE (padrao
// abaixo) e APAGADO e recriado a cada execucao, pelas migrations — o mesmo
// `prisma migrate deploy` que o container roda ao subir.

const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { spawn, execFileSync } = require("node:child_process");
const jwt = require("jsonwebtoken");
const { hash } = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { adapterDoBanco } = require("../dist/prisma/adapter");

const RAIZ = path.join(__dirname, "..");
const URL_BANCO = process.env.DATABASE_URL_TESTE || "mysql://root:teste@127.0.0.1:3306/game_jam_teste";
const NOME_BANCO = new URL(URL_BANCO).pathname.slice(1);
const JWT_SECRET = "segredo-de-teste";
const ADMIN = { username: "admin.teste", senha: "senha-do-admin" };
const PORTA = 34_568;
const BASE = `http://127.0.0.1:${PORTA}`;

// Dado pessoal semeado direto no banco. Nenhuma resposta publica pode conter isto.
const PESSOAL = { nome: "Participante Semeado", email: "semeado@exemplo.com", cpf: "12345678909" };

let prisma;
let servidor;
let season; // a temporada atual

function prismaCli(args, entrada, erros = "inherit") {
  execFileSync(process.execPath, [require.resolve("prisma/build/index.js"), ...args], {
    cwd: RAIZ,
    env: { ...process.env, DATABASE_URL: URL_BANCO },
    input: entrada,
    stdio: ["pipe", "ignore", erros],
  });
}

async function preparaBanco() {
  // Trava contra apontar para um banco de verdade por engano: ele seria apagado.
  if (!/teste/.test(NOME_BANCO)) throw new Error(`recuso apagar o banco "${NOME_BANCO}": o nome precisa conter "teste"`);
  // Recria o banco conectado nele mesmo (o Prisma recusa o banco de sistema
  // `mysql`). Na primeira execucao ele ainda nao existe e a conexao falha — tudo
  // bem: o migrate deploy cria o banco que faltar.
  try {
    prismaCli(["db", "execute", "--stdin"],
      `DROP DATABASE \`${NOME_BANCO}\`; CREATE DATABASE \`${NOME_BANCO}\`;`, "ignore");
  } catch {}
  prismaCli(["migrate", "deploy"]);

  prisma = new PrismaClient({ adapter: adapterDoBanco(URL_BANCO) });
  await prisma.user.create({ data: { username: ADMIN.username, senha: await hash(ADMIN.senha, 8) } });
  season = await prisma.season.create({
    data: { numero: "4", capa: "capa.png", numParticipantesPorEquipe: "2", atual: true, inscricoesAbertas: false },
  });
  const antiga = await prisma.season.create({ data: { numero: "3", capa: "capa3.png", numParticipantesPorEquipe: "4" } });
  await prisma.jogo.create({ data: { nome: "Jogo", capa: "j.png", descricao: "d", link: "https://exemplo.com", seasonId: antiga.id } });
  const equipe = await prisma.equipe.create({ data: { nome: "Equipe Semeada", seasonId: antiga.id } });
  await prisma.participante.create({ data: { ...PESSOAL, genero: "outro", ufes: true, equipeId: equipe.id } });
  await prisma.patrocinador.create({ data: { nome: "Patrocinador", logo: "logo.png" } });
  await prisma.material.create({ data: { nome: "Material", link: "https://exemplo.com", descricao: "d" } });
}

function sobeServidor() {
  return new Promise((resolve, reject) => {
    const s = spawn(process.execPath, ["dist/server.js"], {
      cwd: RAIZ,
      env: { PATH: process.env.PATH, NODE_ENV: "production", PORT: String(PORTA), DATABASE_URL: URL_BANCO, JWT_SECRET },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let saida = "";
    const desiste = setTimeout(() => reject(new Error(`servidor nao subiu:\n${saida}`)), 30_000);
    const le = (pedaco) => {
      saida += pedaco;
      if (saida.includes("Server Online!")) {
        clearTimeout(desiste);
        resolve(s);
      }
    };
    s.stdout.on("data", le);
    s.stderr.on("data", le);
    s.on("exit", (codigo) => reject(new Error(`servidor saiu (${codigo}):\n${saida}`)));
  });
}

function api(metodo, caminho, { token, corpo, headers = {} } = {}) {
  const h = { ...headers };
  if (token) h.authorization = `Bearer ${token}`;
  if (corpo !== undefined) h["content-type"] = "application/json";
  return fetch(BASE + caminho, { method: metodo, headers: h, body: corpo === undefined ? undefined : JSON.stringify(corpo) });
}

async function entra() {
  const r = await api("POST", "/sessao", { corpo: ADMIN });
  assert.equal(r.status, 200, "login do admin semeado");
  return (await r.json()).token;
}

before(async () => {
  await preparaBanco();
  servidor = await sobeServidor();
});

after(async () => {
  servidor?.kill();
  await prisma?.$disconnect();
});

describe("login do painel", () => {
  // Toda rota que cria, apaga ou le dado do painel. Criar e apagar patrocinador e
  // material ja estiveram abertas.
  const PROTEGIDAS = [
    ["POST", "/users"],
    ["GET", "/eu"],
    ["GET", "/users"],
    ["DELETE", "/users"],
    ["PUT", "/users"],
    ["POST", "/seasons"],
    ["DELETE", "/seasons"],
    ["GET", "/seasons"],
    ["PUT", "/seasons/atual"],
    ["PUT", "/seasons/abreInscricao"],
    ["PUT", "/seasons/fechaInscricao"],
    ["PUT", "/seasons/apagaCpfs"],
    ["GET", "/equipes"],
    ["DELETE", "/equipe"],
    ["POST", "/jogos"],
    ["DELETE", "/jogos"],
    ["POST", "/patrocinador"],
    ["DELETE", "/patrocinador/remove"],
    ["POST", "/material"],
    ["DELETE", "/material"],
  ];

  const TOKENS_RUINS = {
    "sem token": undefined,
    "token que nao e JWT": "lixo",
    "assinado com outro segredo": jwt.sign({ username: "x" }, "outro-segredo", { subject: "x" }),
    vencido: jwt.sign({ username: "x", exp: Math.floor(Date.now() / 1000) - 60 }, JWT_SECRET, { subject: "x" }),
  };

  for (const [metodo, caminho] of PROTEGIDAS) {
    it(`${metodo} ${caminho} exige login`, async () => {
      for (const [caso, token] of Object.entries(TOKENS_RUINS)) {
        const r = await api(metodo, caminho, { token });
        assert.equal(r.status, 401, caso);
      }
    });
  }

  it("o login abre o painel e nao devolve hash de senha", async () => {
    const token = await entra();
    for (const caminho of ["/eu", "/users", "/seasons"]) {
      const r = await api("GET", caminho, { token });
      assert.equal(r.status, 200, caminho);
      assert.ok(!(await r.text()).includes("$2"), `${caminho} devolveu hash bcrypt`);
    }
  });

  it("login sem usuario ou senha e recusado, sem erro interno", async () => {
    for (const corpo of [undefined, {}, { username: ADMIN.username }, { username: ["x"], senha: "y" }]) {
      const r = await api("POST", "/sessao", { corpo });
      assert.equal(r.status, 400, JSON.stringify(corpo));
    }
  });

  it("senha errada e usuario inexistente dao a mesma resposta", async () => {
    const errada = await api("POST", "/sessao", { corpo: { ...ADMIN, senha: "errada" } });
    const inexistente = await api("POST", "/sessao", { corpo: { username: "ninguem", senha: "qualquer" } });
    assert.equal(errada.status, 400);
    assert.equal(inexistente.status, 400);
    assert.deepEqual(await errada.json(), await inexistente.json());
  });
});

describe("rotas publicas", () => {
  // O site le temporadas, jogos, patrocinadores e materiais sem login. Nenhuma
  // dessas leituras pode trazer equipe ou participante — por isso a comissao ve os
  // inscritos so pelo painel do banco.
  for (const caminho of ["/seasons/atual", "/seasonsComJogos", "/patrocinador", "/material"]) {
    it(`${caminho} nao expoe dado de participante`, async () => {
      const r = await api("GET", caminho);
      assert.equal(r.status, 200);
      const corpo = await r.text();
      for (const valor of Object.values(PESSOAL)) assert.ok(!corpo.includes(valor), `${caminho} vazou ${valor}`);
      for (const chave of ['"participantes"', '"equipes"', '"senha"']) assert.ok(!corpo.includes(chave), `${caminho} traz ${chave}`);
    });
  }

  // cors() sem argumento aceitava qualquer origem: qualquer site conseguia chamar
  // a API pelo navegador de um visitante.
  it("CORS so libera as origens do site", async () => {
    const estranha = await api("GET", "/material", { headers: { origin: "https://site-estranho.exemplo" } });
    assert.equal(estranha.headers.get("access-control-allow-origin"), null);
    const site = await api("GET", "/material", { headers: { origin: "https://gamejam.pet.inf.ufes.br" } });
    assert.equal(site.headers.get("access-control-allow-origin"), "https://gamejam.pet.inf.ufes.br");
  });

  // Erro do Prisma carrega caminho de arquivo, trecho da query e nome de coluna.
  it("erro do banco nao vaza detalhe", async () => {
    const r = await api("DELETE", "/seasons?id=nao-existe", { token: await entra() });
    assert.equal(r.status, 500);
    const corpo = await r.text();
    assert.ok(!/prisma|invocation|where|seasons/i.test(corpo), corpo);
  });
});

describe("inscricao", () => {
  // A equipe e todos os participantes chegam juntos em POST /inscricao e sao
  // gravados numa transacao: ou entra tudo, ou nada.
  const participante = (extra = {}) => ({
    nome: "Participante Novo",
    email: "novo@exemplo.com",
    genero: "feminino",
    ufes: true,
    cpf: "98765432100",
    curso: "Engenharia de Computacao",
    ...extra,
  });
  const inscreve = (equipe, participantes) => api("POST", "/inscricao", { corpo: { equipe, participantes } });
  const equipesChamadas = (nome) => prisma.equipe.count({ where: { nome } });

  it("fechada, recusa", async () => {
    const r = await inscreve("Cedo Demais", [participante()]);
    assert.equal(r.status, 403);
    assert.equal(await equipesChamadas("Cedo Demais"), 0);
  });

  it("aberta pelo painel, grava a equipe com os participantes na temporada atual", async () => {
    const abre = await api("PUT", `/seasons/abreInscricao?id=${season.id}`, { token: await entra() });
    assert.equal(abre.status, 200);

    const r = await inscreve("Equipe Nova", [
      participante({ email: "a@exemplo.com" }),
      participante({ email: "b@exemplo.com", ufes: false, instituicao: "IFES" }),
    ]);
    assert.equal(r.status, 201);
    const corpo = await r.json();
    assert.deepEqual(Object.keys(corpo).sort(), ["id", "nome", "participantes"], "resposta sem dado pessoal");

    const equipe = await prisma.equipe.findUnique({ where: { id: corpo.id }, include: { participantes: true } });
    assert.equal(equipe.seasonId, season.id);
    assert.equal(equipe.aprovada, false, "equipe nasce aprovada");
    const porEmail = Object.fromEntries(equipe.participantes.map((p) => [p.email, p]));
    assert.deepEqual(Object.keys(porEmail).sort(), ["a@exemplo.com", "b@exemplo.com"]);
    assert.ok(equipe.participantes.every((p) => p.cpf === "98765432100"), "CPF gravado");
    assert.equal(porEmail["a@exemplo.com"].instituicao, null);
    assert.equal(porEmail["b@exemplo.com"].instituicao, "IFES");
  });

  it("recusa equipe acima do limite da temporada, sem gravar nada", async () => {
    const r = await inscreve("Grande Demais", ["a", "b", "c"].map((x) => participante({ email: `${x}@exemplo.com` })));
    assert.equal(r.status, 409);
    assert.equal(await equipesChamadas("Grande Demais"), 0);
  });

  it("participante invalido recusa a inscricao inteira", async () => {
    // O primeiro e valido: antes, ele e a equipe ficavam gravados sozinhos.
    for (const [nome, invalido] of [
      ["Sem Nome", participante({ nome: "" })],
      ["Externo", participante({ ufes: false })],
      ["Ufes Texto", participante({ ufes: "sim" })],
      ["Sem CPF", participante({ cpf: undefined })],
      ["CPF Errado", participante({ cpf: "98765432101" })],
      ["CPF Repetido", participante({ cpf: "111.111.111-11" })],
    ]) {
      const r = await inscreve(nome, [participante(), invalido]);
      assert.equal(r.status, 400, nome);
      assert.equal(await equipesChamadas(nome), 0, nome);
    }
    assert.equal((await inscreve("", [participante()])).status, 400);
    assert.equal((await inscreve("Vazia", [])).status, 400);
  });

  it("grava o CPF so com os digitos", async () => {
    const r = await inscreve("CPF Pontuado", [participante({ email: "pontuado@exemplo.com", cpf: "529.982.247-25" })]);
    assert.equal(r.status, 201);
    const gravado = await prisma.participante.findFirst({ where: { email: "pontuado@exemplo.com" } });
    assert.equal(gravado.cpf, "52998224725");
  });

  it("ignora campos que o cliente nao deveria mandar", async () => {
    const outra = await prisma.equipe.findFirst({ where: { nome: "Equipe Semeada" } });
    const r = await inscreve("Campos Extras", [participante({ id: "id-forjado", equipeId: outra.id, email: "x@exemplo.com" })]);
    assert.equal(r.status, 201);
    const gravado = await prisma.participante.findFirst({ where: { email: "x@exemplo.com" } });
    assert.notEqual(gravado.id, "id-forjado");
    assert.notEqual(gravado.equipeId, outra.id);
  });

  it("o painel lista as equipes da season com os participantes", async () => {
    const r = await api("GET", `/equipes?seasonId=${season.id}`, { token: await entra() });
    assert.equal(r.status, 200);
    const equipes = await r.json();
    const nova = equipes.find((e) => e.nome === "Equipe Nova");
    assert.ok(nova, "equipe inscrita aparece");
    assert.deepEqual(nova.participantes.map((p) => p.email).sort(), ["a@exemplo.com", "b@exemplo.com"]);
    assert.equal(nova.participantes[0].cpf, "98765432100", "o painel ve o CPF, para o certificado");
    assert.ok(equipes.every((e) => e.nome !== "Equipe Semeada"), "so a season pedida");
  });

  it("o painel apaga a equipe inteira", async () => {
    const alvo = await prisma.equipe.findFirst({ where: { nome: "CPF Pontuado" } });
    const r = await api("DELETE", `/equipe?id=${alvo.id}`, { token: await entra() });
    assert.equal(r.status, 200);
    assert.equal((await r.json()).participantesApagados, 1);
    assert.equal(await prisma.equipe.count({ where: { id: alvo.id } }), 0);
    assert.equal(await prisma.participante.count({ where: { equipeId: alvo.id } }), 0);
  });

  it("apagar os CPFs de uma season nao mexe nas outras", async () => {
    const semeado = await prisma.participante.findFirst({ where: { email: PESSOAL.email } });
    assert.equal(semeado.cpf, PESSOAL.cpf, "CPF da season antiga antes");

    const r = await api("PUT", `/seasons/apagaCpfs?id=${season.id}`, { token: await entra() });
    assert.equal(r.status, 200);
    assert.ok((await r.json()).apagados > 0);

    const daAtual = await prisma.participante.count({ where: { equipe: { seasonId: season.id }, cpf: { not: null } } });
    assert.equal(daAtual, 0);
    const outro = await prisma.participante.findFirst({ where: { email: PESSOAL.email } });
    assert.equal(outro.cpf, PESSOAL.cpf, "CPF de outra season intacto");
  });

  it("fechada de novo, recusa", async () => {
    const fecha = await api("PUT", `/seasons/fechaInscricao?id=${season.id}`, { token: await entra() });
    assert.equal(fecha.status, 200);
    const r = await inscreve("Tarde Demais", [participante()]);
    assert.equal(r.status, 403);
  });
});

describe("forca bruta no login", () => {
  it("bloqueia depois de 5 tentativas erradas", async () => {
    let ultimo;
    for (let i = 0; i < 6; i++) {
      ultimo = await api("POST", "/sessao", { corpo: { ...ADMIN, senha: `errada-${i}` } });
    }
    assert.equal(ultimo.status, 429);
    assert.ok(ultimo.headers.get("ratelimit"), "cabecalho RateLimit");
  });
});
