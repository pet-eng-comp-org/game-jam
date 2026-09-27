import { test, expect } from "@playwright/test";
import { ORGANIZADOR } from "../ambiente.mjs";
import { banco } from "./ajuda";

test("painel sem login manda para o login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login$/);
});

test("senha errada nao entra", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("username").fill(ORGANIZADOR.usuario);
  await page.getByPlaceholder("senha").fill("senha-errada");
  await page.getByRole("button", { name: "Acessar" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login$/);
});

test("organizador entra no painel", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("username").fill(ORGANIZADOR.usuario);
  await page.getByPlaceholder("senha").fill(ORGANIZADOR.senha);
  await page.getByRole("button", { name: "Acessar" }).click();
  await expect(page).toHaveURL(/\/admin$/);
});

async function entra(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByPlaceholder("username").fill(ORGANIZADOR.usuario);
  await page.getByPlaceholder("senha").fill(ORGANIZADOR.senha);
  await page.getByRole("button", { name: "Acessar" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test("organizador ve os inscritos, baixa a planilha e apaga uma equipe", async ({ page }, info) => {
  const atual = await banco.season.findFirst({ where: { atual: true } });
  const nome = `Inscritos ${info.project.name} ${Date.now()}`;
  const equipe = await banco.equipe.create({
    data: {
      nome,
      seasonId: atual.id,
      participantes: { create: { nome: "Joana Inscrita", email: "joana@exemplo.com", genero: "feminino", ufes: true, cpf: "05299822472" } },
    },
  });

  await entra(page);
  await page.getByRole("link", { name: "Equipes" }).click();
  await expect(page.getByRole("heading", { name: nome })).toBeVisible();
  await expect(page.getByText("052.998.224-72")).toBeVisible();

  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Baixar planilha" }).click()]);
  const csv = await (await import("node:fs/promises")).readFile(await download.path(), "utf8");
  expect(csv).toContain(`"${nome}";"Joana Inscrita";"joana@exemplo.com";"052.998.224-72"`);

  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: `Apagar a equipe ${nome}` }).click();
  await expect(page.getByRole("heading", { name: nome })).toHaveCount(0);
  expect(await banco.equipe.count({ where: { id: equipe.id } })).toBe(0);
});

test("organizador apaga os CPFs da season pelo painel", async ({ page }) => {
  const atual = await banco.season.findFirst({ where: { atual: true } });
  const equipe = await banco.equipe.create({
    data: {
      nome: `CPF painel ${Date.now()}`,
      seasonId: atual.id,
      participantes: { create: { nome: "Com CPF", email: "cpf@exemplo.com", genero: "feminino", ufes: true, cpf: "39053344705" } },
    },
  });

  await entra(page);

  await page.goto("/admin/seasons");
  page.once("dialog", (d) => d.accept());
  await page.getByRole("row", { name: /^4 / }).getByRole("button", { name: "Apagar CPFs" }).click();
  await expect(page.getByText(/CPF\(s\) apagado\(s\)/)).toBeVisible();

  const participante = await banco.participante.findFirst({ where: { equipeId: equipe.id } });
  expect(participante.cpf).toBeNull();
});

test("organizador edita a season e o site mostra na hora", async ({ page }, info) => {
  const linguagem = `Linguagem${info.project.name}${Date.now() % 100000}`;
  await entra(page);
  await page.goto("/admin/seasons");
  await page.getByRole("row", { name: /^4 / }).getByRole("button", { name: "Editar" }).click();

  await page.getByLabel("Linguagens permitidas (uma por linha)").fill(`Rust\n${linguagem}`);
  await page.getByLabel(/^Regulamento/).fill("## Premiação\n\n1. Medalhas para o pódio.");
  await page.getByRole("button", { name: "Salvar" }).click();
  await expect(page.getByText("Season atualizada!")).toBeVisible();

  // As paginas publicas sao geradas no servidor e ficam em cache; salvar no
  // painel precisa refaze-las sem esperar os 5 minutos.
  await page.goto("/");
  await expect(page.getByText(`Rust, ${linguagem}`)).toBeVisible();
  await page.goto("/regras");
  await expect(page.getByRole("heading", { name: "Premiação" })).toBeVisible();
  await expect(page.getByText("Medalhas para o pódio.")).toBeVisible();
});
