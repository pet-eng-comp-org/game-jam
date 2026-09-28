// Campos de um material (Materiais do site), vindos do painel. Devolve os
// dados limpos ou a mensagem de erro. O link vira um href na pagina publica:
// so http(s), para nao entrar um "javascript:".
export interface DadosMaterial {
  nome: string;
  descricao: string;
  link: string;
}

const texto = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function dadosDoMaterial(corpo: any): DadosMaterial | string {
  const nome = texto(corpo?.nome);
  const descricao = texto(corpo?.descricao);
  const link = texto(corpo?.link);
  if (!nome) return "Informe o nome do material.";
  if (nome.length > 120) return "Nome grande demais (até 120 caracteres).";
  if (descricao.length > 1000) return "Descrição grande demais (até 1000 caracteres).";
  if (!/^https?:\/\/\S+$/.test(link)) return "O link precisa começar com http:// ou https://.";
  return { nome, descricao, link };
}
