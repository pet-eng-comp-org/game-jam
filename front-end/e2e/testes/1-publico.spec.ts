import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
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

test("/jogos mostra os jogos de todas as seasons, com link para jogar", async ({ page }) => {
  const confere = semErroDePagina(page);
  await page.goto("/jogos");
  await expect(page.getByRole("heading", { name: "Season 1" })).toBeVisible();
  const jogo = page.getByRole("link", { name: /^A Lenda de Gabe/ });
  await expect(jogo).toBeVisible();
  await expect(jogo).toHaveAttribute("target", "_blank");
  // Capa antiga (public/jogos) otimizada: WebP no tamanho da tela, nao o JPG
  // de 800x600.
  const capa = page.getByRole("listitem").filter({ has: jogo }).locator("img");
  await expect(capa).toHaveAttribute("srcset", /_next\/image\?url=%2Fjogos%2F/);
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
  expect(evento.isAccessibleForFree).toBe(true);
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

test("a barra de cima nao sobrepoe logo, links e botao em nenhuma largura", async ({ page }) => {
  // Em 768px a barra de desktop ja aparecia com os links por cima da logo e do
  // "Inscreva-se": ela so cabe a partir de 1024px. /apoio tem os cinco links.
  for (const largura of [412, 768, 1023, 1024, 1280, 1440]) {
    await page.setViewportSize({ width: largura, height: 800 });
    await page.goto("/apoio");
    const caixas = await page.evaluate(() =>
      [...document.querySelectorAll("nav a")]
        .map((a) => ({ nome: a.textContent?.trim() || a.getAttribute("aria-label"), b: a.getBoundingClientRect() }))
        .filter(({ b }) => b.width > 0 && b.height > 0)
        .map(({ nome, b }) => ({ nome, x0: b.left, x1: b.right, y0: b.top, y1: b.bottom })),
    );
    for (let i = 0; i < caixas.length; i++) {
      for (let j = i + 1; j < caixas.length; j++) {
        const [a, b] = [caixas[i], caixas[j]];
        const encostam = a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
        expect(encostam, `${largura}px: "${a.nome}" sobre "${b.nome}"`).toBe(false);
      }
    }
  }
});

test("endereco que nao existe mostra a 404 do site, com volta ao inicio", async ({ page }) => {
  // Antes caia na tela padrao do Next, em branco e em ingles.
  const resposta = await page.goto("/pagina-que-nao-existe");
  expect(resposta?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Essa página não existe" })).toBeVisible();
  await page.getByRole("link", { name: "Ir para o início" }).click();
  await expect(page).toHaveURL(/\/$/);
});

// Um ponto do canvas bem acima do comeco do Pac-Man (meio de baixo).
async function acimaDoPacman(canvas: import("@playwright/test").Locator) {
  const c = (await canvas.boundingBox())!;
  return { x: c.width / 2, y: c.height * 0.3 };
}

test("o jogo do Inicio comeca sozinho ao aparecer, anda e conta pontos, e as setas nao rolam a pagina", async ({ page }, info) => {
  const confere = semErroDePagina(page);
  await page.goto("/");
  // O jogo so carrega quando a pessoa rola ate perto dele.
  await expect(page.getByRole("img", { name: /labirinto do Pac-Man/ })).toHaveCount(0);
  await page.getByRole("heading", { name: "Enquanto a Season não começa" }).scrollIntoViewIfNeeded();
  const jogo = page.getByRole("img", { name: /labirinto do Pac-Man/ });
  await jogo.scrollIntoViewIfNeeded();
  // Como o Doodle do Google: sem botao, a abertura ("PRONTO!") e a partida.
  await expect(jogo).toHaveAttribute("data-fase", "pronto");
  await expect(page.getByRole("button", { name: "Jogar" })).toHaveCount(0);
  await expect(jogo).toHaveAttribute("data-fase", "jogando", { timeout: 8000 });
  const rolagem = await page.evaluate(() => scrollY);
  // No celular, sem direcional: toca no labirinto acima do Pac-Man (ele sai
  // do meio de baixo), e ele vai para cima.
  if (info.project.name === "celular") await jogo.tap({ position: await acimaDoPacman(jogo) });
  else await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(800);
  // O placar e desenhado no quadro; o texto para leitor de tela acompanha.
  await expect(page.getByText(/^Pontos: \d+\./)).not.toHaveText(/^Pontos: 0\./);
  // Setas do teclado (no celular o toque no direcional nao rola nada; quem
  // rola ali e o proprio Playwright, trazendo o botao para a tela).
  if (info.project.name !== "celular") expect(await page.evaluate(() => scrollY), "a seta virou o Pac-Man, e nao rolou a pagina").toBe(rolagem);
  confere();
});

test.describe("com animacao reduzida", () => {
  test.use({ reducedMotion: "reduce" });
  test("o jogo nao comeca sozinho: espera o Jogar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("heading", { name: "Enquanto a Season não começa" }).scrollIntoViewIfNeeded();
    const jogo = page.getByRole("img", { name: /labirinto do Pac-Man/ });
    await jogo.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await expect(jogo).toHaveAttribute("data-fase", "espera");
    await page.getByRole("button", { name: "Jogar" }).click();
    await expect(jogo).toHaveAttribute("data-fase", "pronto");
  });
});

test("nenhuma pagina publica tem problema de acessibilidade que o axe acha", async ({ page }) => {
  // axe-core: contraste, rotulos, nomes de botao e link, hierarquia de
  // titulos, landmarks. Zerado em 28/09/2026; um teste quebrando aqui e uma
  // regressao.
  for (const caminho of ["/", "/jogos", "/regras", "/materiais", "/inscricao", "/apoio", "/privacidade", "/nao-existe", "/login"]) {
    await page.goto(caminho);
    await page.waitForLoadState("networkidle");
    const r = await new AxeBuilder({ page }).analyze();
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`), caminho).toEqual([]);
  }
});

test("salvar na agenda: link do Google Agenda e arquivo .ics do evento", async ({ page, request }) => {
  await page.goto("/");
  const google = page.getByRole("link", { name: "Google Agenda" });
  await expect(google).toHaveAttribute("href", /^https:\/\/calendar\.google\.com\/calendar\/render\?action=TEMPLATE/);
  await expect(page.getByRole("link", { name: "outros calendários" })).toHaveAttribute("href", "/agenda.ics");
  const ics = await request.get("/agenda.ics");
  expect(ics.status()).toBe(200);
  expect(ics.headers()["content-type"]).toContain("text/calendar");
  expect(await ics.text()).toMatch(/BEGIN:VEVENT[\s\S]*DTSTART:\d{8}T\d{6}Z/);
});

test("no celular, deitar o aparelho com o jogo na tela abre a tela cheia, e Sair volta", async ({ page }, info) => {
  test.skip(info.project.name !== "celular", "so em aparelho de toque");
  await page.goto("/");
  await page.getByRole("heading", { name: "Enquanto a Season não começa" }).scrollIntoViewIfNeeded();
  await page.getByRole("img", { name: /labirinto do Pac-Man/ }).scrollIntoViewIfNeeded();
  // Em pe: a dica de virar o celular.
  await expect(page.getByText("Vire o celular para jogar em tela cheia")).toBeVisible();
  const labirinto = page.getByRole("img", { name: /labirinto do Pac-Man/ });
  await expect(labirinto).toHaveAttribute("data-fase", /pronto|jogando/);
  await labirinto.tap({ position: await acimaDoPacman(labirinto) });
  const tamanho = page.viewportSize()!;
  await page.setViewportSize({ width: tamanho.height, height: tamanho.width });
  const cheia = page.getByRole("dialog", { name: "Jogo em tela cheia" });
  await expect(cheia).toBeVisible();
  // O labirinto cresce e cabe na altura da tela.
  const caixa = (await page.getByRole("img", { name: /labirinto do Pac-Man/ }).boundingBox())!;
  expect(caixa.height).toBeLessThanOrEqual(tamanho.width);
  expect(caixa.width).toBeGreaterThan(tamanho.width);
  await page.getByRole("button", { name: "Sair" }).tap();
  await expect(cheia).toHaveCount(0);
});
