import { test, expect } from "@playwright/test";
import { semErroDePagina } from "./ajuda";

// Cada pagina publica abre sem erro e mostra o que vem da API. Materiais e
// patrocinadores ficavam vazios para quem nao estava logado no painel (o front
// exigia o cookie numa rota publica); o teste abre sem login, como o visitante.
const paginas: { caminho: string; mostra: (p: import("@playwright/test").Page) => import("@playwright/test").Locator }[] = [
  { caminho: "/", mostra: (p) => p.getByText("cada equipe recebe um jogo preparado especialmente", { exact: false }).first() },
  { caminho: "/regras", mostra: (p) => p.getByText("REGRAS").first() },
  { caminho: "/materiais", mostra: (p) => p.getByText("Material E2E").first() },
  { caminho: "/apoio", mostra: (p) => p.getByAltText("Patrocinador E2E").first() },
  { caminho: "/inscricao", mostra: (p) => p.getByRole("textbox", { name: "Nome da equipe" }) },
  { caminho: "/privacidade", mostra: (p) => p.getByText("O CPF é apagado", { exact: false }).first() },
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
  const barra = page.getByRole("navigation").first();
  await expect(barra.getByRole("link", { name: "Inscreva-se" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Login" })).toHaveCount(0);
});

test("o site manda os cabecalhos de seguranca", async ({ page }) => {
  // O painel mostra CPF: nao pode ser carregado dentro de pagina de terceiros.
  for (const caminho of ["/", "/login", "/admin/equipes"]) {
    const r = await page.request.get(caminho, { maxRedirects: 0 });
    const h = r.headers();
    expect(h["x-frame-options"], caminho).toBe("DENY");
    expect(h["content-security-policy"], caminho).toContain("frame-ancestors 'none'");
    expect(h["strict-transport-security"], caminho).toContain("max-age=");
    expect(h["x-powered-by"], caminho).toBeUndefined();
  }
});

test("o inicio mostra a contagem ate a competicao", async ({ page }) => {
  // A data vem do painel (no banco de teste, 15/11/2026).
  await page.goto("/");
  await expect(page.getByText("A competição começa em")).toBeVisible();
  await expect(page.getByText("A competição começa em 15 de novembro.")).toBeAttached();
  await expect(page.getByText("dias", { exact: true })).toBeVisible();
});
