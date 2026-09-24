import { test, expect } from "@playwright/test";
import { ORGANIZADOR } from "../ambiente.mjs";

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
