// O Game Jam Season 4 por extenso (src/lib/edicao.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { DIAS, EMAIL_DE_INSCRICAO, horario, linguagensPorExtenso, NOME, periodo, quando, salasPorDia } from "../src/lib/edicao.ts";

test("os dias saem como se fala, no fuso de Vitoria", () => {
  assert.equal(NOME, "Game Jam Season 4");
  assert.equal(DIAS[0].atividade, "Campeonato de Super Smash Bros. Ultimate");
  assert.deepEqual(DIAS.map(quando), ["terça, 1 de dezembro", "quarta, 2 de dezembro", "quinta, 3 de dezembro"]);
  assert.equal(horario(DIAS[0]), "a partir das 14h, sem hora fixa para acabar");
  assert.equal(horario(DIAS[1]), "das 14h às 17h");
  assert.equal(linguagensPorExtenso(), "Python, C, C++ ou Java");
  assert.equal(periodo(), "1 a 3 de dezembro, a partir das 14h");
  assert.equal(salasPorDia(), "Sala do PET no Dia 1, Lab 4 (laboratório novo) no Dia 2 e Lab 2 no Dia 3");
  // Meia hora nao some: "14h30", e nao "14h".
  assert.equal(horario({ ...DIAS[1], inicio: "2026-12-02T14:30:00-03:00" }), "das 14h30 às 17h");
});

test("o e-mail de inscricao abre endereçado, com copia, assunto e o que preencher", () => {
  const u = new URL(EMAIL_DE_INSCRICAO);
  assert.equal(u.protocol, "mailto:");
  assert.equal(u.pathname, "petgamejamufes@gmail.com");
  assert.equal(u.searchParams.get("cc"), "petengcomp@inf.ufes.br");
  assert.equal(u.searchParams.get("subject"), "Inscrição Game Jam Season 4");
  // Quebra de linha como %0D%0A (RFC 6068): com so %0A, alguns clientes
  // juntam tudo numa linha.
  assert.equal(u.searchParams.get("body"), "Nome:\r\nDias:\r\n");
  // Espaco como %20, e nao "+": o Outlook e o Mail do iPhone mostram o "+".
  assert.doesNotMatch(EMAIL_DE_INSCRICAO, /\+/);
});

test("o botao da barra leva ao BOCA so nos dias de workshop, no dia de Vitoria", async (t) => {
  const { diaDeWorkshop } = await import("../src/lib/edicao.ts");
  const em = (iso: string) => { t.mock.timers.enable({ apis: ["Date"], now: new Date(iso) }); const r = diaDeWorkshop(); t.mock.timers.reset(); return r; };
  assert.equal(em("2026-12-01T20:00:00-03:00"), false); // Dia 1, Super Smash Bros. Ultimate
  assert.equal(em("2026-12-02T00:00:00-03:00"), true);  // Dia 2 desde a meia-noite
  assert.equal(em("2026-12-03T23:59:00-03:00"), true);
  // 22h do Dia 3 em Vitoria ja e dia 4 em UTC: vale o calendario de Vitoria.
  assert.equal(em("2026-12-04T01:00:00Z"), true);
  assert.equal(em("2026-12-04T00:00:00-03:00"), false);
});
