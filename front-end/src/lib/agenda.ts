// "Salvar na agenda": os tres dias do Game Jam 26 no calendario do celular.
// Dois caminhos, porque nenhum serve para todo mundo: o link do Google Agenda
// (o app do Android nao importa arquivo .ics), um por dia, porque o link so
// leva um evento; e o arquivo .ics com os tres (iPhone, Outlook e o resto).
import { DIAS, horario, LOCAL, NOME, type Dia } from "./edicao.ts";

const SITE = "https://gamejam.pet.inf.ufes.br";

const titulo = (d: Dia) => `${NOME} · Dia ${d.numero}: ${d.atividade}`;

function descricao(d: Dia) {
  const h = horario(d);
  return `${h.charAt(0).toUpperCase() + h.slice(1)}. ${d.sala}, ${LOCAL}. Organizado pelo PET Engenharia de Computação da Ufes. Programação: ${SITE}/regras`;
}

const ondeFica = (d: Dia) => `${d.sala}, ${LOCAL}`;

// 2026-12-01T14:00:00-03:00 -> 20261201T170000Z
const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function linkGoogleAgenda(d: Dia) {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: titulo(d),
    dates: `${utc(d.inicio)}/${utc(d.fim)}`,
    details: descricao(d),
    location: ondeFica(d),
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

// Texto de iCalendar (RFC 5545): virgula, ponto e virgula, barra e quebra de
// linha escapados, e linhas de ate 75 bytes dobradas com um espaco.
const escapa = (t: string) => t.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\r?\n/g, "\\n");

function dobra(linha: string) {
  const bytes = new TextEncoder().encode(linha);
  if (bytes.length <= 75) return linha;
  const partes: string[] = [];
  let atual = "";
  for (const c of linha) {
    const limite = partes.length === 0 ? 75 : 74; // continuacao comeca com espaco
    if (new TextEncoder().encode(atual + c).length > limite) { partes.push(atual); atual = ""; }
    atual += c;
  }
  partes.push(atual);
  return partes.join("\r\n ");
}

export function icsDaEdicao(agora = new Date()) {
  const linhas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PET Engenharia de Computacao Ufes//Game Jam//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...DIAS.flatMap((d) => [
      "BEGIN:VEVENT",
      `UID:game-jam-26-dia-${d.numero}@gamejam.pet.inf.ufes.br`,
      `DTSTAMP:${utc(agora.toISOString())}`,
      `DTSTART:${utc(d.inicio)}`,
      `DTEND:${utc(d.fim)}`,
      `SUMMARY:${escapa(titulo(d))}`,
      `LOCATION:${escapa(ondeFica(d))}`,
      `DESCRIPTION:${escapa(descricao(d))}`,
      `URL:${SITE}`,
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  return linhas.map(dobra).join("\r\n") + "\r\n";
}
