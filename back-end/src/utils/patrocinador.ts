// Campos de um patrocinador, vindos do painel. Devolve os dados limpos ou a
// mensagem de erro. O site vira um href na pagina publica: so http(s), para nao
// entrar um "javascript:", e opcional.
export interface DadosPatrocinador {
  nome: string;
  site: string | null;
}

const texto = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function dadosDoPatrocinador(corpo: any): DadosPatrocinador | string {
  const nome = texto(corpo?.nome);
  const site = texto(corpo?.site);
  if (!nome) return "Informe o nome do patrocinador.";
  if (nome.length > 120) return "Nome grande demais (até 120 caracteres).";
  if (site && !/^https?:\/\/\S+$/.test(site)) return "O site precisa começar com http:// ou https://.";
  if (site.length > 191) return "Endereço do site grande demais (até 191 caracteres).";
  return { nome, site: site || null };
}
