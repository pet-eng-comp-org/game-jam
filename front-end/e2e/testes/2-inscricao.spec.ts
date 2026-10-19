import { test, expect, type Page } from "@playwright/test";
import { banco, emailNovo, semErroDePagina, unico } from "./ajuda";

// A inscricao e o unico fluxo publico que grava dado. Ficou quebrada de
// 10/09/2026 ate 24/09/2026 sem ninguem notar: a declaracao (que depois saiu)
// virou um campo so e a validacao continuou exigindo um por participante.

async function preenche(page: Page, i: number, dados: { nome?: string; email?: string }) {
  // O formulario comeca com um participante; os outros entram pelo botao.
  while (!(await page.getByRole("textbox", { name: `Nome do participante ${i}`, exact: true }).isVisible())) {
    await page.getByRole("button", { name: /adicionar participante/i }).click();
  }
  if (dados.nome) await page.getByRole("textbox", { name: `Nome do participante ${i}`, exact: true }).fill(dados.nome);
  if (dados.email) await page.getByRole("textbox", { name: `E-mail do participante ${i}`, exact: true }).fill(dados.email);
  // "Estuda na Ufes" comeca sem resposta: quem preenche o participante responde.
  if (dados.nome) await page.getByRole("combobox", { name: `O participante ${i} estuda na Ufes?` }).selectOption("sim");
}

test.beforeEach(async ({ page }) => {
  await page.goto("/inscricao");
  await expect(page.getByRole("textbox", { name: "Nome da equipe" })).toBeVisible();
});

test("inscreve a equipe e grava cada participante", async ({ page }, info) => {
  const confere = semErroDePagina(page);
  const equipe = unico("Equipe", info.project.name);

  await page.getByRole("textbox", { name: "Nome da equipe" }).fill(equipe);
  const [ana, bruno] = [emailNovo("ana"), emailNovo("bruno")];
  await preenche(page, 1, { nome: "Ana Teste", email: ana });
  await preenche(page, 2, { nome: "Bruno Teste", email: bruno });
  await page.getByRole("combobox", { name: "O participante 2 estuda na Ufes?" }).selectOption("nao");
  await page.getByRole("textbox", { name: "Instituição de ensino do participante 2" }).fill("IFES");
  await page.getByRole("button", { name: "inscrever-se" }).click();

  await expect(page.getByRole("heading", { name: "Inscrição recebida!" })).toBeVisible();
  confere();

  const gravada = await banco.equipe.findFirst({
    where: { nome: equipe },
    include: { participantes: { orderBy: { nome: "asc" } }, season: true },
  });
  expect(gravada).not.toBeNull();
  expect(gravada.aprovada).toBe(false);
  expect(gravada.season.atual).toBe(true);
  expect(gravada.participantes.map((p: { nome: string; email: string; ufes: boolean; instituicao: string | null }) => [p.nome, p.email, p.ufes, p.instituicao])).toEqual([
    ["Ana Teste", ana, true, null],
    ["Bruno Teste", bruno, false, "IFES"],
  ]);
  expect(gravada.participantes.every((p: { cpf?: string | null }) => p.cpf == null), "sem CPF no banco").toBe(true);
});

test("participante preenchido pela metade avisa em vez de sumir", async ({ page }, info) => {
  const equipe = unico("Metade", info.project.name);
  await page.getByRole("textbox", { name: "Nome da equipe" }).fill(equipe);
  await preenche(page, 1, { nome: "Ana Teste", email: emailNovo("ana") });
  await preenche(page, 3, { nome: "Caio Sem Email" });
  await page.getByRole("button", { name: "inscrever-se" }).click();

  // O erro aparece embaixo de cada campo que falta, e o foco vai para o primeiro.
  await expect(page.getByRole("textbox", { name: "E-mail do participante 3", exact: true })).toBeFocused();
  await expect(page.getByRole("textbox", { name: "E-mail do participante 3", exact: true })).toHaveAccessibleDescription("Informe o e-mail.");
  expect(await banco.equipe.count({ where: { nome: equipe } })).toBe(0);
});

test("toque duplo no botao grava a equipe uma vez so", async ({ page }, info) => {
  const equipe = unico("Duplo", info.project.name);
  await page.getByRole("textbox", { name: "Nome da equipe" }).fill(equipe);
  await preenche(page, 1, { nome: "Ana Teste", email: emailNovo("ana") });
  await page.getByRole("button", { name: "inscrever-se" }).dblclick();

  await expect(page.getByRole("heading", { name: "Inscrição recebida!" })).toBeVisible();
  expect(await banco.equipe.count({ where: { nome: equipe } })).toBe(1);
});

test("o formulario nao pede CPF", async ({ page }) => {
  await expect(page.getByText("CPF")).toHaveCount(0);
});

test("e-mail ja inscrito na season fica marcado no campo", async ({ page }, info) => {
  const email = emailNovo("bia");
  for (const [n, equipe] of [unico("Primeira", info.project.name), unico("Segunda", info.project.name)].entries()) {
    await page.goto("/inscricao");
    await page.getByRole("textbox", { name: "Nome da equipe" }).fill(equipe);
    await preenche(page, 1, { nome: "Ana Teste", email: emailNovo("ana") });
    await preenche(page, 2, { nome: "Bia Teste", email });
    await page.getByRole("button", { name: "inscrever-se" }).click();
    if (n === 0) await expect(page.getByRole("heading", { name: "Inscrição recebida!" })).toBeVisible();
  }
  await expect(page.getByRole("textbox", { name: "E-mail do participante 2", exact: true }))
    .toHaveAccessibleDescription("este e-mail já está inscrito nesta season.");
  expect(await banco.participante.count({ where: { email } })).toBe(1);
});

test("adiciona e remove participante, ate o limite da season", async ({ page }) => {
  const adiciona = page.getByRole("button", { name: /adicionar participante/i });
  await expect(page.getByRole("textbox", { name: "Nome do participante 2", exact: true })).toHaveCount(0);
  await adiciona.click();
  await adiciona.click();
  await expect(page.getByRole("textbox", { name: "Nome do participante 3", exact: true })).toBeVisible();
  await expect(adiciona, "a season 4 aceita 3 por equipe").toHaveCount(0);
  await page.getByRole("button", { name: "Remover participante 3" }).click();
  await expect(page.getByRole("textbox", { name: "Nome do participante 3", exact: true })).toHaveCount(0);
  await expect(adiciona).toBeVisible();
});

test("estuda na Ufes comeca sem resposta e e exigido", async ({ page }, info) => {
  const equipe = unico("Sem Ufes", info.project.name);
  const ufes = page.getByRole("combobox", { name: "O participante 1 estuda na Ufes?" });
  await expect(ufes).toHaveValue("");
  await page.getByRole("textbox", { name: "Nome da equipe" }).fill(equipe);
  await page.getByRole("textbox", { name: "Nome do participante 1", exact: true }).fill("Ana Teste");
  await page.getByRole("textbox", { name: "E-mail do participante 1", exact: true }).fill("ana@exemplo.com");
  await page.getByRole("button", { name: "inscrever-se" }).click();
  await expect(ufes).toHaveAccessibleDescription("Informe se estuda na Ufes.");
  expect(await banco.equipe.count({ where: { nome: equipe } })).toBe(0);
});
