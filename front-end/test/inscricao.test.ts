// Roda com `npm test` (node:test; o Node 24 executa TypeScript direto).
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpfNormalizado, montaInscricao, type EstadoFormulario } from "../src/lib/inscricao.ts";

const todosUfes = { 1: true, 2: true, 3: true };

const valido: EstadoFormulario = {
  equipe: "Equipe Teste",
  termo: true,
  nome1: "Ana",
  email1: "ana@exemplo.com",
  cpf1: "529.982.247-25",
};

test("aceita a inscrição com a declaração única marcada", () => {
  // Regressão do PR #108: a declaração virou um campo só ("termo"), mas a
  // validação ainda exigia "termo1" e recusava toda inscrição.
  const r = montaInscricao(valido, todosUfes, 3);
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.equipe, "Equipe Teste");
  assert.equal(r.participantes.length, 1);
  assert.equal(r.participantes[0].nome, "Ana");
});

test("recusa sem a declaração", () => {
  const r = montaInscricao({ ...valido, termo: false }, todosUfes, 3);
  assert.deepEqual(r, { ok: false, erro: "Você deve aceitar o termo para realizar a inscrição!" });
});

test("recusa sem nome de equipe", () => {
  const r = montaInscricao({ ...valido, equipe: "   " }, todosUfes, 3);
  assert.equal(r.ok, false);
});

test("exige nome, e-mail e CPF do participante 1", () => {
  const r = montaInscricao({ ...valido, cpf1: "" }, todosUfes, 3);
  assert.deepEqual(r, { ok: false, erro: "Participante 1: Nome, CPF e Email são obrigatórios!" });
});

test("ignora participante opcional em branco", () => {
  const r = montaInscricao({ ...valido, genero2: "masculino" }, todosUfes, 3);
  assert.equal(r.ok && r.participantes.length, 1);
});

test("recusa participante opcional preenchido pela metade", () => {
  const r = montaInscricao({ ...valido, nome2: "Bruno" }, todosUfes, 3);
  assert.deepEqual(r, { ok: false, erro: "Participante 2: Nome, CPF e Email são obrigatórios!" });
});

test("inclui os participantes opcionais completos", () => {
  const r = montaInscricao(
    { ...valido, nome3: "Caio", email3: "caio@exemplo.com", cpf3: "16899535009", curso3: "Eng. Comp." },
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
  assert.deepEqual(r, { ok: false, erro: "Participante 1: informe a instituição de ensino." });

  const ok = montaInscricao({ ...valido, instituicao1: "IFES" }, { ...todosUfes, 1: false }, 3);
  assert.equal(ok.ok && ok.participantes[0].instituicao, "IFES");
});

test("descarta instituição digitada por quem é da Ufes", () => {
  const r = montaInscricao({ ...valido, instituicao1: "IFES" }, todosUfes, 3);
  assert.equal(r.ok && r.participantes[0].instituicao, undefined);
});

test("CPF vai so com os digitos, e so se for valido", () => {
  const r = montaInscricao(valido, todosUfes, 3);
  assert.equal(r.ok && r.participantes[0].cpf, "52998224725");

  for (const errado of ["52998224724", "111.111.111-11", "123", "abc"]) {
    const recusa = montaInscricao({ ...valido, cpf1: errado }, todosUfes, 3);
    assert.deepEqual(recusa, { ok: false, erro: "Participante 1: CPF inválido. Confira os números." }, errado);
  }
});

test("cpfNormalizado confere os dois digitos verificadores", () => {
  assert.equal(cpfNormalizado("168.995.350-09"), "16899535009");
  assert.equal(cpfNormalizado("16899535019"), null);
  assert.equal(cpfNormalizado("16899535000"), null);
});
