// O que a organizacao ainda vai definir para a Season 4 (o rascunho de
// divulgacao do Bernardo, lider do Game Jam, veio com "XX" nesses campos).
// Vazio aparece no site como "em breve": quando sair, basta preencher aqui.
export const EDICAO = {
  // Ex.: "15/11/2026"
  data: "",
  // Ex.: ["C", "C++", "Python"]
  linguagens: [] as string[],
};

export const dataDaEdicao = () => EDICAO.data || "em breve";

export const linguagensDaEdicao = () =>
  EDICAO.linguagens.length ? EDICAO.linguagens.join(", ") : "em breve";
