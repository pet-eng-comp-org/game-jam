import { test, expect } from "@playwright/test";
import { semErroDePagina } from "./ajuda";

// Desde o Game Jam 26 a inscricao e por e-mail (o formulario saiu): a pagina
// diz para quem escrever e o botao abre o e-mail ja preenchido.

test("a inscricao abre o e-mail pronto, com os dois enderecos a vista", async ({ page }) => {
  const confere = semErroDePagina(page);
  await page.goto("/inscricao");
  const botao = page.getByRole("link", { name: "Escrever o e-mail de inscrição" });
  const href = await botao.getAttribute("href");
  const u = new URL(href ?? "");
  expect(u.protocol).toBe("mailto:");
  expect(u.pathname).toBe("petgamejamufes@gmail.com");
  expect(u.searchParams.get("cc")).toBe("petengcomp@inf.ufes.br");
  expect(u.searchParams.get("subject")).toBe("Inscrição Game Jam 26");
  await expect(page.getByText("petgamejamufes@gmail.com", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("petengcomp@inf.ufes.br", { exact: true }).first()).toBeVisible();
  for (const sala of ["Sala do PET", "Lab 4", "Lab 2"]) await expect(page.getByText(sala, { exact: false }).first()).toBeVisible();
  confere();
});

test("o Inscreva-se da barra leva para a inscricao por e-mail", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Inscreva-se" }).first().click();
  await expect(page).toHaveURL(/\/inscricao$/);
  await expect(page.getByRole("link", { name: "Escrever o e-mail de inscrição" })).toBeVisible();
});
