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
export function diaEHora(iso: string, comSemana = false) {
  const [h, m] = new Date(iso)
    .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: fuso })
    .split(":");
  return `${dia(iso, comSemana)}, às\u00a0${Number(h)}h${m === "00" ? "" : m}`;
}
