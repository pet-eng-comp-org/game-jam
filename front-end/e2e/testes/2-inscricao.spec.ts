import { test, expect, type Page } from "@playwright/test";
import { banco, emailNovo, semErroDePagina, unico } from "./ajuda";

// A inscricao e o unico fluxo publico que grava dado. Ficou quebrada de
// 10/09/2026 ate 24/09/2026 sem ninguem notar: a declaracao (que depois saiu)
// virou um campo so e a validacao continuou exigindo um por participante.
//
// Desde 10/2026 o formulario tem tres etapas: a equipe (nome e tamanho), os
// participantes e a revisao antes de enviar.

const TAMANHO = ["Só eu", "2 pessoas", "3 pessoas"];

// Etapa 1: nome e tamanho da equipe, e segue para os participantes.
async function equipe(page: Page, nome: string, quantos = 1) {
  await page.getByRole("textbox", { name: "Nome da equipe" }).fill(nome);
  await page.getByRole("radio", { name: TAMANHO[quantos - 1] }).check();
  await continua(page);
  await expect(page.getByRole("textbox", { name: "Nome do participante 1", exact: true })).toBeVisible();
}

async function preenche(page: Page, i: number, dados: { nome?: string; email?: string; ufes?: boolean; instituicao?: string }) {
  if (dados.nome) await page.getByRole("textbox", { name: `Nome do participante ${i}`, exact: true }).fill(dados.nome);
  if (dados.email) await page.getByRole("textbox", { name: `E-mail do participante ${i}`, exact: true }).fill(dados.email);
  if (dados.ufes !== undefined) {
    await ufes(page, i).getByRole("radio", { name: dados.ufes ? "Sim" : "Não" }).check();
  }
  if (dados.instituicao) await page.getByRole("textbox", { name: `Instituição de ensino do participante ${i}` }).fill(dados.instituicao);
}

const ufes = (page: Page, i: number) => page.getByRole("group", { name: `O participante ${i} estuda na Ufes?` });
const continua = (page: Page) => page.getByRole("button", { name: "Continuar" }).click();
const envia = (page: Page) => page.getByRole("button", { name: "Enviar inscrição" });

test.beforeEach(async ({ page }) => {
  await page.goto("/inscricao");
  await expect(page.getByRole("textbox", { name: "Nome da equipe" })).toBeVisible();
});

test("inscreve a equipe e grava cada participante", async ({ page }, info) => {
  const confere = semErroDePagina(page);
  const nome = unico("Equipe", info.project.name);
  const [ana, bruno] = [emailNovo("ana"), emailNovo("bruno")];

  await equipe(page, nome, 2);
  await preenche(page, 1, { nome: "Ana Teste", email: ana, ufes: true });
  await preenche(page, 2, { nome: "Bruno Teste", email: bruno, ufes: false, instituicao: "IFES" });
  await continua(page);

  // A revisao mostra o que vai ser gravado antes de enviar.
  await expect(page.getByText(nome, { exact: true })).toBeVisible();
  await expect(page.getByText(bruno, { exact: true })).toBeVisible();
  await envia(page).click();

  await expect(page.getByRole("heading", { name: "Inscrição recebida!" })).toBeVisible();
  confere();

  const gravada = await banco.equipe.findFirst({
    where: { nome },
    include: { participantes: { orderBy: { nome: "asc" } }, season: true },
  });
  expect(gravada).not.toBeNull();
  expect(gravada.aprovada).toBe(false);
  expect(gravada.season.atual).toBe(true);
  expect(gravada.participantes.map((p: { nome: string; email: string; ufes: boolean; instituicao: string | null }) => [p.nome, p.email, p.ufes, p.instituicao])).toEqual([
    ["Ana Teste", ana, true, null],
    ["Bruno Teste", bruno, false, "IFES"],
  ]);
  expect(gravada.participantes.every((p: object) => !("cpf" in p)), "sem coluna de CPF").toBe(true);
});

test("sem nome da equipe nao sai da primeira etapa", async ({ page }) => {
  await continua(page);
  await expect(page.getByRole("textbox", { name: "Nome da equipe" })).toBeFocused();
  await expect(page.getByRole("textbox", { name: "Nome da equipe" })).toHaveAccessibleDescription("Informe o nome da equipe.");
});

test("participante escolhido e deixado em branco avisa em vez de sumir", async ({ page }, info) => {
  const nome = unico("Metade", info.project.name);
  await equipe(page, nome, 3);
  await preenche(page, 1, { nome: "Ana Teste", email: emailNovo("ana"), ufes: true });
  await preenche(page, 3, { nome: "Caio Sem Email", ufes: true });
  await continua(page);

  // O erro aparece embaixo de cada campo que falta, e o foco vai para o primeiro.
  await expect(page.getByRole("textbox", { name: "Nome do participante 2", exact: true })).toBeFocused();
  await expect(page.getByRole("textbox", { name: "E-mail do participante 3", exact: true })).toHaveAccessibleDescription("Informe o e-mail.");
  await expect(envia(page)).toHaveCount(0);
  expect(await banco.equipe.count({ where: { nome } })).toBe(0);
});

test("toque duplo no botao grava a equipe uma vez so", async ({ page }, info) => {
  const nome = unico("Duplo", info.project.name);
  await equipe(page, nome);
  await preenche(page, 1, { nome: "Ana Teste", email: emailNovo("ana"), ufes: true });
  await continua(page);
  await envia(page).dblclick();

  await expect(page.getByRole("heading", { name: "Inscrição recebida!" })).toBeVisible();
  expect(await banco.equipe.count({ where: { nome } })).toBe(1);
});

test("o formulario nao pede CPF", async ({ page }) => {
  await expect(page.getByText("CPF")).toHaveCount(0);
  await equipe(page, "Qualquer", 3);
  await expect(page.getByText("CPF")).toHaveCount(0);
});

test("e-mail ja inscrito na season volta ao campo dele", async ({ page }, info) => {
  const email = emailNovo("bia");
  for (const [n, nome] of [unico("Primeira", info.project.name), unico("Segunda", info.project.name)].entries()) {
    await page.goto("/inscricao");
    await equipe(page, nome, 2);
    await preenche(page, 1, { nome: "Ana Teste", email: emailNovo("ana"), ufes: true });
    await preenche(page, 2, { nome: "Bia Teste", email, ufes: true });
    await continua(page);
    await envia(page).click();
    if (n === 0) await expect(page.getByRole("heading", { name: "Inscrição recebida!" })).toBeVisible();
  }
  // A API recusa e o formulario volta para a etapa dos participantes, no campo.
  await expect(page.getByRole("textbox", { name: "E-mail do participante 2", exact: true }))
    .toHaveAccessibleDescription("este e-mail já está inscrito nesta season.");
  expect(await banco.participante.count({ where: { email } })).toBe(1);
});

test("o tamanho da equipe vai ate o limite da season e diminuir apaga os que sairam", async ({ page }) => {
  await expect(page.getByRole("radio"), "a season 4 aceita 3 por equipe").toHaveCount(3);
  await equipe(page, "Tamanho", 3);
  await preenche(page, 3, { nome: "Caio Teste" });
  await page.getByRole("button", { name: "Voltar" }).click();
  await page.getByRole("radio", { name: "Só eu" }).check();
  await page.getByRole("radio", { name: "3 pessoas" }).check();
  await continua(page);
  // Continuar valida: o participante 2 esta em branco. O 3 voltou vazio.
  await expect(page.getByRole("textbox", { name: "Nome do participante 3", exact: true })).toHaveValue("");
});

test("estuda na Ufes comeca sem resposta e e exigido", async ({ page }, info) => {
  const nome = unico("Sem Ufes", info.project.name);
  await equipe(page, nome);
  await expect(ufes(page, 1).getByRole("radio", { checked: true })).toHaveCount(0);
  await preenche(page, 1, { nome: "Ana Teste", email: "ana@exemplo.com" });
  await continua(page);
  await expect(ufes(page, 1)).toHaveAccessibleDescription("Informe se estuda na Ufes.");
  expect(await banco.equipe.count({ where: { nome } })).toBe(0);
});

test("a revisao deixa voltar e corrigir", async ({ page }) => {
  await equipe(page, "Revisao");
  await preenche(page, 1, { nome: "Ana Teste", email: "ana@exemplo.com", ufes: true });
  await continua(page);
  await page.getByRole("button", { name: "Editar você" }).click();
  await preenche(page, 1, { email: "ana.certo@exemplo.com" });
  await continua(page);
  await expect(page.getByText("ana.certo@exemplo.com", { exact: true })).toBeVisible();
});

test("erro do envio que nao e de um campo fica parado perto do botao", async ({ page }) => {
  // Antes era um aviso que sumia em segundos: quem nao viu nao sabia por que
  // a inscricao nao foi.
  await page.route("**/inscricao", (rota) =>
    rota.request().method() === "POST"
      ? rota.fulfill({ status: 403, contentType: "application/json", body: JSON.stringify({ error: "As inscrições não estão abertas." }) })
      : rota.fallback(),
  );
  await equipe(page, "Fechada");
  await preenche(page, 1, { nome: "Ana Teste", email: "ana@exemplo.com", ufes: true });
  await continua(page);
  await envia(page).click();

  // O Next tem o proprio role=alert (o anunciador de rota), vazio.
  const alerta = page.getByRole("alert").filter({ hasText: "As inscrições não estão abertas." });
  await expect(alerta).toBeVisible();
  await page.waitForTimeout(6000);
  await expect(alerta).toBeVisible();
});
