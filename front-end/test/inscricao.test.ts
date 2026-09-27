// Roda com `npm test` (node:test; o Node 24 executa TypeScript direto).
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpfValido, formataCpf, montaInscricao, type EstadoFormulario } from "../src/lib/inscricao.ts";

const todosUfes = { 1: true, 2: true, 3: true };

const valido: EstadoFormulario = {
  equipe: "Equipe Teste",
  termo: true,
  nome1: "Ana",
  email1: "ana@exemplo.com",
  cpf1: "529.982.247-25",
};

const erros = (r: ReturnType<typeof montaInscricao>) => (r.ok ? {} : r.erros);

test("aceita a inscrição com a declaração única marcada", () => {
  // Regressão do PR #108: a declaração virou um campo só ("termo"), mas a
  // validação ainda exigia "termo1" e recusava toda inscrição.
  const r = montaInscricao(valido, todosUfes, 3);
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.equipe, "Equipe Teste");
  assert.equal(r.participantes.length, 1);
  assert.equal(r.participantes[0].cpf, "52998224725", "o CPF vai só com os dígitos");
  assert.equal(r.participantes[0].genero, "nao-informado", "sem escolha, o gênero não é presumido");
});

test("recusa sem a declaração", () => {
  assert.deepEqual(erros(montaInscricao({ ...valido, termo: false }, todosUfes, 3)), { termo: "Marque a declaração para se inscrever." });
});

test("aponta todos os campos com problema de uma vez", () => {
  const r = montaInscricao({ termo: true, nome1: "Ana" }, todosUfes, 3);
  assert.deepEqual(erros(r), { equipe: "Informe o nome da equipe.", email1: "Informe o e-mail.", cpf1: "Informe o CPF." });
});

test("confere o formato do e-mail e os dígitos do CPF", () => {
  const r = montaInscricao({ ...valido, email1: "ana@", cpf1: "529.982.247-24" }, todosUfes, 3);
  assert.deepEqual(erros(r), { email1: "E-mail inválido.", cpf1: "CPF inválido. Confira os números." });
});

test("ignora participante opcional em branco", () => {
  const r = montaInscricao({ ...valido, genero2: "masculino" }, todosUfes, 3);
  assert.equal(r.ok && r.participantes.length, 1);
});

test("recusa participante opcional preenchido pela metade", () => {
  const r = montaInscricao({ ...valido, nome2: "Bruno" }, todosUfes, 3);
  assert.deepEqual(erros(r), { email2: "Informe o e-mail.", cpf2: "Informe o CPF." });
});

test("recusa o mesmo CPF duas vezes na equipe", () => {
  const r = montaInscricao({ ...valido, nome2: "Bruno", email2: "b@exemplo.com", cpf2: "52998224725" }, todosUfes, 3);
  assert.deepEqual(erros(r), { cpf2: "CPF repetido na equipe." });
});

test("so considera os participantes mostrados", () => {
  // O formulário começa com um participante; os outros entram pelo botão.
  const r = montaInscricao({ ...valido, nome3: "Caio" }, todosUfes, 1);
  assert.equal(r.ok, true);
});

test("inclui os participantes opcionais completos", () => {
  const r = montaInscricao(
    { ...valido, nome3: "Caio", email3: "caio@exemplo.com", cpf3: "11144477735", curso3: "Eng. Comp." },
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

test("descarta instituição digitada por quem é da Ufes", () => {
  const r = montaInscricao({ ...valido, instituicao1: "IFES" }, todosUfes, 3);
  assert.equal(r.ok && r.participantes[0].instituicao, undefined);
});

test("máscara do CPF", () => {
  assert.equal(formataCpf("529"), "529");
  assert.equal(formataCpf("5299"), "529.9");
  assert.equal(formataCpf("5299822"), "529.982.2");
  assert.equal(formataCpf("52998224725"), "529.982.247-25");
  assert.equal(formataCpf("529.982.247-2599"), "529.982.247-25", "corta o que passa de 11 dígitos");
  assert.equal(formataCpf("abc"), "");
});

test("CPF válido", () => {
  assert.equal(cpfValido("529.982.247-25"), true);
  assert.equal(cpfValido("111.111.111-11"), false);
});
