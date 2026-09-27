// Campos de texto de um jogo, vindos do painel (JSON ou multipart). Devolve os
// dados limpos ou a mensagem de erro.
export interface DadosJogo {
  nome: string | null;
  equipe: string;
  integrantes: string | null;
  descricao: string;
  link: string;
  ordem: number;
}

const texto = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function dadosDoJogo(corpo: any): DadosJogo | string {
  const equipe = texto(corpo?.equipe);
  const link = texto(corpo?.link);
  const descricao = texto(corpo?.descricao);
  if (!equipe) return "Informe a equipe.";
  if (!/^https?:\/\//.test(link)) return "O link do jogo precisa começar com http:// ou https://.";
  const ordem = corpo?.ordem === undefined || corpo?.ordem === "" ? 0 : Number(corpo.ordem);
  if (!Number.isInteger(ordem)) return "Ordem inválida.";
  return {
    nome: texto(corpo?.nome) || null,
    equipe,
    integrantes: texto(corpo?.integrantes) || null,
    descricao,
    link,
    ordem,
  };
}
