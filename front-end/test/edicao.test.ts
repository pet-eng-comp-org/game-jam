// O Game Jam 26 por extenso (src/lib/edicao.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { DIAS, EMAIL_DE_INSCRICAO, horario, linguagensPorExtenso, quando } from "../src/lib/edicao.ts";

test("os dias saem como se fala, no fuso de Vitoria", () => {
  assert.deepEqual(DIAS.map(quando), ["terça, 1 de dezembro", "quarta, 2 de dezembro", "quinta, 3 de dezembro"]);
  assert.equal(horario(DIAS[0]), "a partir das 14h, sem hora fixa para acabar");
  assert.equal(horario(DIAS[1]), "das 14h às 17h");
  assert.equal(linguagensPorExtenso(), "Python, C, C++ ou Java");
});

test("o e-mail de inscricao abre endereçado, com copia, assunto e o que preencher", () => {
  const u = new URL(EMAIL_DE_INSCRICAO);
  assert.equal(u.protocol, "mailto:");
  assert.equal(u.pathname, "petgamejamufes@gmail.com");
  assert.equal(u.searchParams.get("cc"), "petengcomp@inf.ufes.br");
  assert.equal(u.searchParams.get("subject"), "Inscrição Game Jam 26");
  assert.equal(u.searchParams.get("body"), "Nome:\nDias:\n");
  // Espaco como %20, e nao "+": o Outlook e o Mail do iPhone mostram o "+".
  assert.doesNotMatch(EMAIL_DE_INSCRICAO, /\+/);
});
