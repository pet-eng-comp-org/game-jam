import { test, expect } from "@playwright/test";
import { semErroDePagina } from "./ajuda";

// Cada pagina publica abre sem erro e mostra o que vem da API. Materiais e
// patrocinadores ficavam vazios para quem nao estava logado no painel (o front
// exigia o cookie numa rota publica); o teste abre sem login, como o visitante.
const paginas: { caminho: string; mostra: (p: import("@playwright/test").Page) => import("@playwright/test").Locator }[] = [
  { caminho: "/", mostra: (p) => p.getByText("cada equipe recebe um jogo preparado especialmente", { exact: false }).first() },
  { caminho: "/regras", mostra: (p) => p.getByRole("heading", { name: "REGRAS" }) },
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
  // Data e hora vem do painel (no banco de teste, 15/11/2026, 09:00 em Vitoria).
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "A Season 4 começa em" })).toBeVisible();
  await expect(page.getByText("dias", { exact: true })).toBeVisible();
  await expect(page.getByText("Domingo, 15 de novembro, às 9h", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "CT 9, Ufes Goiabeiras" })).toBeVisible();
});

test("o inicio marca a competicao como evento para o Google", async ({ page }) => {
  await page.goto("/");
  const json = await page.locator('script[type="application/ld+json"]').textContent();
  const evento = JSON.parse(json ?? "{}");
  expect(evento["@type"]).toBe("Event");
  expect(evento.name).toBe("PET Game Jam · Season 4");
  expect(evento.startDate).toBe("2026-11-15T12:00:00.000Z");
  expect(evento.location.name).toBe("CT 9, Ufes Goiabeiras");
  expect(evento.location.address.addressLocality).toBe("Vitória");
  expect(evento.offers.price).toBe("0");
});

test("nenhuma pagina passa da tela no celular mais estreito (280px)", async ({ page }) => {
  // Galaxy Fold dobrado. Ja existiu uma largura minima de 320px no body, que
  // cortava a direita da pagina (e o botao do menu) em telas menores.
  await page.setViewportSize({ width: 280, height: 653 });
  for (const caminho of ["/", "/jogos", "/regras", "/materiais", "/inscricao", "/privacidade", "/apoio"]) {
    await page.goto(caminho);
    await page.waitForLoadState("networkidle");
    const fora = await page.evaluate(() => {
      const w = window.innerWidth;
      const vazando = [...document.querySelectorAll("body *")].filter((e) => {
        const b = e.getBoundingClientRect();
        return b.width > 0 && (b.right > w + 1 || b.left < -1) && getComputedStyle(e).visibility !== "hidden";
      });
      return { largura: document.documentElement.scrollWidth, w, vazando: vazando.slice(0, 3).map((e) => e.tagName + "." + String(e.className).slice(0, 50)) };
    });
    expect(fora.largura, `${caminho} mais larga que a tela`).toBeLessThanOrEqual(fora.w);
    expect(fora.vazando, `${caminho} com elemento fora da tela`).toEqual([]);
  }
});
