import { test } from "node:test";
import assert from "node:assert/strict";
import { planilhaDeInscritos, type EquipeInscrita } from "../src/lib/planilha.ts";

const equipes: EquipeInscrita[] = [{
  id: "e1",
  nome: 'Equipe "Aspas"; e ponto e virgula',
  aprovada: true,
  createdAt: null,
  participantes: [
    { id: "p1", nome: "Ana", email: "ana@exemplo.com", curso: null, genero: "feminino", ufes: true, instituicao: null },
    { id: "p2", nome: "=HYPERLINK(\"x\")", email: "b@exemplo.com", curso: "ADS", genero: "outros", ufes: false, instituicao: "IFES" },
  ],
}];

test("uma linha por participante, com cabecalho, BOM e separador ;", () => {
  const csv = planilhaDeInscritos(equipes);
  assert.ok(csv.startsWith("﻿"));
  const linhas = csv.slice(1).trimEnd().split("\r\n");
  assert.equal(linhas.length, 3);
  assert.equal(linhas[0], '"Equipe";"Aprovada";"Nome";"E-mail";"Curso";"Instituição";"Gênero"');
  assert.equal(linhas[1], '"Equipe ""Aspas""; e ponto e virgula";"Sim";"Ana";"ana@exemplo.com";"";"Ufes";"Feminino"');
});

test("texto que o Excel executaria como formula vira texto", () => {
  const linha = planilhaDeInscritos(equipes).split("\r\n")[2];
  assert.ok(linha.includes(`"'=HYPERLINK(""x"")"`), linha);
  assert.ok(linha.includes('"IFES"'));
});

test("tabulacao e quebra de linha no inicio tambem viram texto", () => {
  const csv = planilhaDeInscritos([{ id: "e", nome: "\t=1+1", aprovada: false, createdAt: null, participantes: [
    { id: "p", nome: "\r=2", email: "x@exemplo.com", curso: null, genero: "outros", ufes: true, instituicao: null },
  ] }]);
  assert.ok(csv.includes(`"'\t=1+1";"Não";"'\r=2"`), csv);
});
