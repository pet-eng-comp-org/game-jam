// "Salvar na agenda": o evento da season atual para o calendario do celular.
// Dois caminhos, porque nenhum serve para todo mundo: o link do Google Agenda
// (o app do Android nao importa arquivo .ics) e o arquivo .ics (iPhone,
// Outlook e o resto). Sem hora de fim definida, o evento marca so o inicio.

export interface EventoAgenda {
  numero: string;
  dataEvento: string; // ISO
  local: string | null;
}

const SITE = "https://gamejam.pet.inf.ufes.br";
const titulo = (e: EventoAgenda) => `PET Game Jam · Season ${e.numero}`;
const descricao = `Competição de programação em equipes, organizada pelo PET Engenharia de Computação da Ufes. Presencial, num laboratório com computadores. Regras: ${SITE}/regras`;

// 2026-11-28T15:00:00.000Z -> 20261128T150000Z
const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function linkGoogleAgenda(e: EventoAgenda) {
  const quando = utc(e.dataEvento);
  const q = new URLSearchParams({ action: "TEMPLATE", text: titulo(e), dates: `${quando}/${quando}`, details: descricao });
  if (e.local) q.set("location", e.local);
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

export function icsDoEvento(e: EventoAgenda, agora = new Date()) {
  const linhas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PET Engenharia de Computacao Ufes//Game Jam//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:game-jam-season-${e.numero}@gamejam.pet.inf.ufes.br`,
    `DTSTAMP:${utc(agora.toISOString())}`,
    `DTSTART:${utc(e.dataEvento)}`,
    `SUMMARY:${escapa(titulo(e))}`,
    ...(e.local ? [`LOCATION:${escapa(e.local)}`] : []),
    `DESCRIPTION:${escapa(descricao)}`,
    `URL:${SITE}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return linhas.map(dobra).join("\r\n") + "\r\n";
}
