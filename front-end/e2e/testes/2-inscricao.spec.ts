import { test, expect, type Page } from "@playwright/test";
import { banco, semErroDePagina, unico } from "./ajuda";

// A inscricao e o unico fluxo publico que grava dado. Ficou quebrada de
// 10/09/2026 ate 24/09/2026 sem ninguem notar: a declaracao virou um campo so e
// a validacao continuou exigindo um por participante.

async function preenche(page: Page, i: number, dados: { nome?: string; email?: string; cpf?: string }) {
  if (dados.nome) await page.getByRole("textbox", { name: `Nome do participante ${i}`, exact: true }).fill(dados.nome);
  if (dados.email) await page.getByRole("textbox", { name: `E-mail do participante ${i}`, exact: true }).fill(dados.email);
  if (dados.cpf) await page.getByRole("textbox", { name: `CPF do participante ${i}, para o certificado` }).fill(dados.cpf);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/inscricao");
  await expect(page.getByRole("textbox", { name: "Nome da equipe" })).toBeVisible();
});

test("inscreve a equipe e grava cada participante", async ({ page }, info) => {
  const confere = semErroDePagina(page);
  const equipe = unico("Equipe", info.project.name);

  await page.getByRole("textbox", { name: "Nome da equipe" }).fill(equipe);
  await preenche(page, 1, { nome: "Ana Teste", email: "ana@exemplo.com", cpf: "111.444.777-35" });
  await preenche(page, 2, { nome: "Bruno Teste", email: "bruno@exemplo.com", cpf: "16899535009" });
  await page.getByRole("combobox", { name: "O participante 2 estuda na Ufes?" }).selectOption("nao");
  await page.getByRole("textbox", { name: "Instituição de ensino do participante 2" }).fill("IFES");
  await page.getByLabel(/Declaro que há pelo menos alguém/).check();
  await page.getByRole("button", { name: "inscrever-se" }).click();

  await expect(page.getByText("Inscrição solicitada com sucesso!")).toBeVisible();
  confere();

  const gravada = await banco.equipe.findFirst({
    where: { nome: equipe },
    include: { participantes: { orderBy: { nome: "asc" } }, season: true },
  });
  expect(gravada).not.toBeNull();
  expect(gravada.aprovada).toBe(false);
  expect(gravada.season.atual).toBe(true);
  expect(gravada.participantes.map((p: { nome: string; email: string; cpf: string | null; ufes: boolean; instituicao: string | null }) => [p.nome, p.email, p.cpf, p.ufes, p.instituicao])).toEqual([
    ["Ana Teste", "ana@exemplo.com", "11144477735", true, null],
    ["Bruno Teste", "bruno@exemplo.com", "16899535009", false, "IFES"],
  ]);
});

test("sem a declaracao, avisa e nao grava nada", async ({ page }, info) => {
  const equipe = unico("Sem termo", info.project.name);
  await page.getByRole("textbox", { name: "Nome da equipe" }).fill(equipe);
  await preenche(page, 1, { nome: "Ana Teste", email: "ana@exemplo.com", cpf: "52998224725" });
  await page.getByRole("button", { name: "inscrever-se" }).click();

  await expect(page.getByText("Você deve aceitar o termo para realizar a inscrição!")).toBeVisible();
  expect(await banco.equipe.count({ where: { nome: equipe } })).toBe(0);
});

test("participante preenchido pela metade avisa em vez de sumir", async ({ page }, info) => {
  const equipe = unico("Metade", info.project.name);
  await page.getByRole("textbox", { name: "Nome da equipe" }).fill(equipe);
  await preenche(page, 1, { nome: "Ana Teste", email: "ana@exemplo.com", cpf: "52998224725" });
  await preenche(page, 3, { nome: "Caio Sem Email" });
  await page.getByLabel(/Declaro que há pelo menos alguém/).check();
  await page.getByRole("button", { name: "inscrever-se" }).click();

  await expect(page.getByText("Participante 3: Nome, CPF e Email são obrigatórios!")).toBeVisible();
  expect(await banco.equipe.count({ where: { nome: equipe } })).toBe(0);
});

test("toque duplo no botao grava a equipe uma vez so", async ({ page }, info) => {
  const equipe = unico("Duplo", info.project.name);
  await page.getByRole("textbox", { name: "Nome da equipe" }).fill(equipe);
  await preenche(page, 1, { nome: "Ana Teste", email: "ana@exemplo.com", cpf: "52998224725" });
  await page.getByLabel(/Declaro que há pelo menos alguém/).check();
  await page.getByRole("button", { name: "inscrever-se" }).dblclick();

  await expect(page.getByText("Inscrição solicitada com sucesso!")).toBeVisible();
  expect(await banco.equipe.count({ where: { nome: equipe } })).toBe(1);
});

test("CPF com digito errado avisa e nao grava nada", async ({ page }, info) => {
  const equipe = unico("CPF errado", info.project.name);
  await page.getByRole("textbox", { name: "Nome da equipe" }).fill(equipe);
  await preenche(page, 1, { nome: "Ana Teste", email: "ana@exemplo.com", cpf: "52998224724" });
  await page.getByLabel(/Declaro que há pelo menos alguém/).check();
  await page.getByRole("button", { name: "inscrever-se" }).click();

  await expect(page.getByText("Participante 1: CPF inválido. Confira os números.")).toBeVisible();
  expect(await banco.equipe.count({ where: { nome: equipe } })).toBe(0);
});
