import next from "eslint-config-next";

const config = [
  ...next,

  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },

  {
    rules: {
      // O projeto inteiro busca dados assim: useEffect(() => { carrega() }, []),
      // e carrega() faz setState. A regra e legitima — sao renders em cascata —
      // mas trocar isso e refatorar o carregamento de dados de sete telas, nao
      // arrumacao. Fica como aviso para aparecer na lista sem travar o comando.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
