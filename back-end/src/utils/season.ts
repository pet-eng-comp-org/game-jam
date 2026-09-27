import type { Season } from "@prisma/client";

// As inscricoes ficam abertas entre as duas datas da season. Sem as duas, fechadas.
export function inscricoesAbertas(s: Pick<Season, "inscricoesAbrem" | "inscricoesFecham">, agora = new Date()) {
  return !!s.inscricoesAbrem && !!s.inscricoesFecham && s.inscricoesAbrem <= agora && agora < s.inscricoesFecham;
}

// Em que pe estao as inscricoes: sem data, antes de abrir, abertas ou
// encerradas.
export function situacaoInscricoes(s: Pick<Season, "inscricoesAbrem" | "inscricoesFecham">, agora = new Date()) {
  if (!s.inscricoesAbrem || !s.inscricoesFecham) return "sem-data" as const;
  if (agora < s.inscricoesAbrem) return "antes" as const;
  return agora < s.inscricoesFecham ? "abertas" as const : "encerradas" as const;
}

// A season como a API devolve: com "inscricoesAbertas" e "situacaoInscricoes"
// calculados, que o site e o painel usam sem precisar saber da regra das datas.
export function comSituacao<T extends Pick<Season, "inscricoesAbrem" | "inscricoesFecham">>(s: T) {
  return { ...s, inscricoesAbertas: inscricoesAbertas(s), situacaoInscricoes: situacaoInscricoes(s) };
}
