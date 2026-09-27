import type { Season } from "@prisma/client";

// As inscricoes ficam abertas entre as duas datas da season. Sem as duas, fechadas.
export function inscricoesAbertas(s: Pick<Season, "inscricoesAbrem" | "inscricoesFecham">, agora = new Date()) {
  return !!s.inscricoesAbrem && !!s.inscricoesFecham && s.inscricoesAbrem <= agora && agora < s.inscricoesFecham;
}

// A season como a API devolve: com o "inscricoesAbertas" calculado, que o site
// e o painel usam sem precisar saber da regra das datas.
export function comSituacao<T extends Pick<Season, "inscricoesAbrem" | "inscricoesFecham">>(s: T) {
  return { ...s, inscricoesAbertas: inscricoesAbertas(s) };
}
