// Roda com `npm test` (node:test; o Node 24 executa TypeScript direto).
import { test } from "node:test";
import assert from "node:assert/strict";
import { montaInscricao, type EstadoFormulario } from "../src/lib/inscricao.ts";

const todosUfes = { 1: true, 2: true, 3: true };

const valido: EstadoFormulario = {
  equipe: "Equipe Teste",
  nome1: "Ana",
  email1: "ana@exemplo.com",
};

const erros = (r: ReturnType<typeof montaInscricao>) => (r.ok ? {} : r.erros);

test("aceita a inscrição preenchida", () => {
  const r = montaInscricao(valido, todosUfes, 3);
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.equipe, "Equipe Teste");
  assert.equal(r.participantes.length, 1);
  assert.equal(r.participantes[0].genero, "nao-informado", "sem escolha, o gênero não é presumido");
});

test("aponta todos os campos com problema de uma vez", () => {
  const r = montaInscricao({ nome1: "Ana" }, todosUfes, 3);
  assert.deepEqual(erros(r), { equipe: "Informe o nome da equipe.", email1: "Informe o e-mail." });
});

test("confere o formato do e-mail", () => {
  const r = montaInscricao({ ...valido, email1: "ana@" }, todosUfes, 3);
  assert.deepEqual(erros(r), { email1: "E-mail inválido." });
});

test("ignora participante opcional em branco", () => {
  const r = montaInscricao({ ...valido, genero2: "masculino" }, todosUfes, 3);
  assert.equal(r.ok && r.participantes.length, 1);
});

test("recusa participante opcional preenchido pela metade", () => {
  const r = montaInscricao({ ...valido, nome2: "Bruno" }, todosUfes, 3);
  assert.deepEqual(erros(r), { email2: "Informe o e-mail." });
});

test("recusa o mesmo e-mail duas vezes na equipe", () => {
  const r = montaInscricao({ ...valido, nome2: "Bruno", email2: "ANA@exemplo.com" }, todosUfes, 3);
  assert.deepEqual(erros(r), { email2: "E-mail repetido na equipe." });
  const acento = montaInscricao({ ...valido, nome2: "Bruno", email2: "anã@exemplo.com" }, todosUfes, 3);
  assert.deepEqual(erros(acento), { email2: "E-mail repetido na equipe." }, "sem acento, como o banco compara");
});

test("so considera os participantes mostrados", () => {
  // O formulário começa com um participante; os outros entram pelo botão.
  const r = montaInscricao({ ...valido, nome3: "Caio" }, todosUfes, 1);
  assert.equal(r.ok, true);
});

test("inclui os participantes opcionais completos", () => {
  const r = montaInscricao(
    { ...valido, nome3: "Caio", email3: "caio@exemplo.com", curso3: "Eng. Comp." },
    todosUfes,
    3,
  );
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.deepEqual(r.participantes.map(p => p.nome), ["Ana", "Caio"]);
  assert.equal(r.participantes[1].curso, "Eng. Comp.");
});

test("exige instituição de quem não é da Ufes, como o back-end", () => {
  const r = montaInscricao(valido, { ...todosUfes, 1: false }, 3);
  assert.deepEqual(erros(r), { instituicao1: "Informe a instituição de ensino." });

  const ok = montaInscricao({ ...valido, instituicao1: "IFES" }, { ...todosUfes, 1: false }, 3);
  assert.equal(ok.ok && ok.participantes[0].instituicao, "IFES");
});

test("exige responder se estuda na Ufes, sem presumir", () => {
  // Pré-marcado "Sim", quem era de fora e não reparava virava aluno da Ufes.
  assert.deepEqual(erros(montaInscricao(valido, {}, 3)), { ufes1: "Informe se estuda na Ufes." });
});

test("descarta instituição digitada por quem é da Ufes", () => {
  const r = montaInscricao({ ...valido, instituicao1: "IFES" }, todosUfes, 3);
  assert.equal(r.ok && r.participantes[0].instituicao, undefined);
});
