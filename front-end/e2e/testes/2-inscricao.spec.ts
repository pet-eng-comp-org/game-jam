import { test, expect, type Page } from "@playwright/test";
import { banco, semErroDePagina, unico } from "./ajuda";

// A inscricao e o unico fluxo publico que grava dado. Ficou quebrada de
// 10/09/2026 ate 24/09/2026 sem ninguem notar: a declaracao virou um campo so e
// a validacao continuou exigindo um por participante.

async function preenche(page: Page, i: number, dados: { nome?: string; email?: string; cpf?: string }) {
  if (dados.nome) await page.getByPlaceholder("Nome").nth(i - 1).fill(dados.nome);
  if (dados.email) await page.getByPlaceholder("Email").nth(i - 1).fill(dados.email);
  if (dados.cpf) await page.getByPlaceholder("CPF").nth(i - 1).fill(dados.cpf);
}

// Cada participante tem dois selects: genero e "E estudante da Ufes?".
const ufesDo = (page: Page, i: number) => page.locator("select").nth((i - 1) * 2 + 1);

test.beforeEach(async ({ page }) => {
  await page.goto("/inscricao");
  await expect(page.getByText("Qual o nome da sua equipe?")).toBeVisible();
});

test("inscreve a equipe e grava cada participante", async ({ page }, info) => {
  const confere = semErroDePagina(page);
  const equipe = unico("Equipe", info.project.name);

  await page.locator("input[type=text]").first().fill(equipe);
  await preenche(page, 1, { nome: "Ana Teste", email: "ana@exemplo.com", cpf: "11122233344" });
  await preenche(page, 2, { nome: "Bruno Teste", email: "bruno@exemplo.com", cpf: "55566677788" });
  await ufesDo(page, 2).selectOption("nao");
  await page.getByPlaceholder("Instituição de Ensino").fill("IFES");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Solicitar inscrição" }).click();

  await expect(page.getByText("Inscrição solicitada com sucesso!")).toBeVisible();
  confere();

  const gravada = await banco.equipe.findFirst({
    where: { nome: equipe },
    include: { participantes: { orderBy: { nome: "asc" } }, season: true },
  });
  expect(gravada).not.toBeNull();
  expect(gravada.aprovada).toBe(false);
  expect(gravada.season.atual).toBe(true);
  expect(gravada.participantes.map((p: any) => [p.nome, p.email, p.cpf, p.ufes, p.instituicao])).toEqual([
    ["Ana Teste", "ana@exemplo.com", "11122233344", true, null],
    ["Bruno Teste", "bruno@exemplo.com", "55566677788", false, "IFES"],
  ]);
});

test("sem a declaracao, avisa e nao grava nada", async ({ page }, info) => {
  const equipe = unico("Sem termo", info.project.name);
  await page.locator("input[type=text]").first().fill(equipe);
  await preenche(page, 1, { nome: "Ana Teste", email: "ana@exemplo.com", cpf: "11122233344" });
  await page.getByRole("button", { name: "Solicitar inscrição" }).click();

  await expect(page.getByText("Você deve aceitar o termo para realizar a inscrição!")).toBeVisible();
  expect(await banco.equipe.count({ where: { nome: equipe } })).toBe(0);
});

test("participante preenchido pela metade avisa em vez de sumir", async ({ page }, info) => {
  const equipe = unico("Metade", info.project.name);
  await page.locator("input[type=text]").first().fill(equipe);
  await preenche(page, 1, { nome: "Ana Teste", email: "ana@exemplo.com", cpf: "11122233344" });
  await preenche(page, 3, { nome: "Caio Sem Email" });
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Solicitar inscrição" }).click();

  await expect(page.getByText("Participante 3: Nome, CPF e Email são obrigatórios!")).toBeVisible();
  expect(await banco.equipe.count({ where: { nome: equipe } })).toBe(0);
});
