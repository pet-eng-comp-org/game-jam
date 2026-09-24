import { test, expect } from "@playwright/test";
import { semErroDePagina } from "./ajuda";

// Cada pagina publica abre sem erro e mostra o que vem da API. Materiais e
// patrocinadores ficavam vazios para quem nao estava logado no painel (o front
// exigia o cookie numa rota publica); o teste abre sem login, como o visitante.
const paginas: { caminho: string; mostra: (p: import("@playwright/test").Page) => import("@playwright/test").Locator }[] = [
  { caminho: "/", mostra: (p) => p.getByText("nos mesmos moldes do TOPCOM", { exact: false }).first() },
  { caminho: "/regras", mostra: (p) => p.getByText("REGRAS").first() },
  { caminho: "/materiais", mostra: (p) => p.getByText("Material E2E").first() },
  { caminho: "/apoio", mostra: (p) => p.getByAltText("Patrocinador E2E").first() },
  { caminho: "/inscricao", mostra: (p) => p.getByText("Qual o nome da sua equipe?") },
];

for (const { caminho, mostra } of paginas) {
  test(`${caminho} abre e mostra o conteudo`, async ({ page }) => {
    const confere = semErroDePagina(page);
    const resposta = await page.goto(caminho);
    expect(resposta?.status()).toBe(200);
    await expect(mostra(page)).toBeVisible();
    confere();
  });
}

test("/jogos abre a lista de uma season", async ({ page }) => {
  const confere = semErroDePagina(page);
  await page.goto("/jogos");
  await page.getByRole("button", { name: /Season 1/ }).click();
  await expect(page.getByText("A Lenda de Gabe").first()).toBeVisible();
  confere();
});

test("a barra do site nao tem botao de login", async ({ page }) => {
  // So a organizacao entra no painel, pelo endereco /login.
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Inscreva-se" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Login" })).toHaveCount(0);
});
