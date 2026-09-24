// O PacFont tem 85 glifos e NENHUM acentuado (conferido no arquivo): com
// acento, so a letra acentuada cai na fonte seguinte e aparece solida no meio
// das outras. O texto certo, acentuado, continua sendo a fonte de verdade; so
// o que aparece na tela vai sem acento, e o acentuado fica para o leitor de
// tela. O mockup usa uma "PacFont PTBR" com acentos, que so existe na maquina
// da designer: com o arquivo dela, isto deixa de ser necessario.
export function semAcento(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C");
}
