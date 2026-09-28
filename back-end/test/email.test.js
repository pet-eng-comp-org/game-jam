// Texto do e-mail de confirmacao (src/utils/email.ts), sem servidor: roda o
// codigo compilado em dist/, como o api.test.js.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { textoDaConfirmacao } = require("../dist/utils/email.js");

const base = {
  equipe: "Os Fantasmas",
  season: { numero: "4", dataEvento: new Date("2026-11-28T15:00:00.000Z"), local: "CT 9, Ufes Goiabeiras" },
  participantes: [{ nome: "Ana", email: "a@x.com" }, { nome: "Bia", email: "b@x.com" }, { nome: "Caio", email: "c@x.com" }],
};

test("diz quando, onde e que nao precisa levar notebook, como a tela de sucesso", () => {
  const { assunto, texto } = textoDaConfirmacao(base);
  assert.equal(assunto, "Inscrição recebida: Os Fantasmas (Game Jam Season 4)");
  assert.match(texto, /^Olá, Ana, Bia e Caio!/);
  assert.match(texto, /Quando: sábado, 28 de novembro, às 12h\./);
  assert.match(texto, /Onde: CT 9, Ufes Goiabeiras\./);
  assert.match(texto, /não precisa levar notebook/);
  assert.match(texto, /https:\/\/gamejam\.pet\.inf\.ufes\.br\/regras/);
});

test("sem data nem local, nao inventa", () => {
  const { texto } = textoDaConfirmacao({ ...base, season: { numero: "4", dataEvento: null, local: null } });
  assert.doesNotMatch(texto, /Quando:|Onde:/);
});

test("nome digitado com quebra de linha nao vira paragrafo no e-mail", () => {
  const { assunto, texto } = textoDaConfirmacao({ ...base, equipe: "Equipe\nFalsa\r\nBcc: x@y" });
  assert.doesNotMatch(assunto, /[\r\n]/);
  assert.match(texto, /"Equipe Falsa Bcc: x@y"/);
});
