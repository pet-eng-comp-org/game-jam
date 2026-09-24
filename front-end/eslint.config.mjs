// Montado peca por peca, e nao pelo eslint-config-next: ele arrasta
// eslint-plugin-react, eslint-plugin-jsx-a11y e eslint-plugin-import, parados
// desde 2024/2025 e sem suporte ao ESLint 10 -- e o ESLint 9, unico que eles
// aceitam, chegou ao fim da vida em 06/08/2026. Cada peca aqui e mantida:
//   regras do Next     @next/eslint-plugin-next (o mesmo que o eslint-config-next usa)
//   React              @eslint-react/eslint-plugin, no lugar do eslint-plugin-react
//   hooks              eslint-plugin-react-hooks (do time do React)
//   acessibilidade     eslint-plugin-jsx-a11y-x, fork mantido do jsx-a11y
//   TypeScript         typescript-eslint
// O eslint-plugin-import ficou de fora: o TypeScript ja confere os imports.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintReact from "@eslint-react/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import jsxA11y from "eslint-plugin-jsx-a11y-x";
import globals from "globals";

const config = tseslint.config(
  {
    ignores: [
      ".next/**", ".next-e2e/**", "node_modules/**", "next-env.d.ts",
      "e2e/node_modules/**", "e2e/playwright-report/**", "e2e/test-results/**",
    ],
  },

  js.configs.recommended,
  tseslint.configs.recommended,
  eslintReact.configs["recommended-typescript"],
  reactHooks.configs.flat.recommended,
  jsxA11y.configs.recommended,
  {
    plugins: { "@next/next": nextPlugin },
    rules: { ...nextPlugin.configs.recommended.rules, ...nextPlugin.configs["core-web-vitals"].rules },
  },

  // Os scripts .mjs do e2e rodam no Node, nao no navegador.
  {
    files: ["**/*.mjs"],
    languageOptions: { globals: globals.node },
  },

  {
    rules: {
      // O projeto inteiro busca dados assim: useEffect(() => { carrega() }, []),
      // e carrega() faz setState. A regra e legitima -- sao renders em cascata --
      // mas trocar isso e refatorar o carregamento de dados de sete telas, nao
      // arrumacao. Fica como aviso para aparecer na lista sem travar o comando.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
);

export default config;
