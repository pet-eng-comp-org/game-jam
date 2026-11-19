// Datas escritas como se fala, no fuso de Vitoria: "26 de outubro, às 23h".
// Um formato so para o site inteiro; antes cada pagina tinha o seu
// ("26/10/2026 às 23:00", "26/10 às 23:00", "26 de outubro de 2026").
// Sem ano: as datas sao sempre da edicao atual.

const fuso = "America/Sao_Paulo";

// "25 de setembro"; com semana, "sábado, 28 de novembro".
export function dia(iso: string, comSemana = false) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    ...(comSemana ? { weekday: "long" as const } : {}),
    day: "numeric",
    month: "long",
    timeZone: fuso,
  });
}

// "26 de outubro, às 23h" ou "às 9h30". O espaco inseparavel antes da hora
// impede que ela quebre sozinha para a linha de baixo.
// "14h" ou "9h30".
export function hora(iso: string) {
  const [h, m] = new Date(iso)
    .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: fuso })
    .split(":");
  return `${Number(h)}h${m === "00" ? "" : m}`;
}

export function diaEHora(iso: string, comSemana = false) {
  return `${dia(iso, comSemana)}, às\u00a0${hora(iso)}`;
}

// Se o momento ja passou (no relogio do servidor, na hora de gerar a pagina).
export const jaPassou = (iso: string) => Date.now() >= new Date(iso).getTime();

// Se agora e o mesmo dia do calendario de Vitoria que o momento dado.
export const ehHoje = (iso: string) =>
  new Date().toLocaleDateString("en-CA", { timeZone: fuso }) === new Date(iso).toLocaleDateString("en-CA", { timeZone: fuso });
