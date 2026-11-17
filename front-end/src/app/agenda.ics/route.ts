import { icsDaEdicao } from "@/lib/agenda";

// /agenda.ics: os tres dias do Game Jam 26 para o calendario (iPhone, Outlook
// e outros; o Android usa os links do Google Agenda, em src/lib/agenda.ts).
export function GET() {
  return new Response(icsDaEdicao(), {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": 'attachment; filename="game-jam-26.ics"',
      "cache-control": "public, max-age=300",
    },
  });
}
