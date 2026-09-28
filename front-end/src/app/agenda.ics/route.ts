import { seasonAtual } from "@/lib/conteudo";
import { icsDoEvento } from "@/lib/agenda";

// /agenda.ics: o evento da season atual para o calendario (iPhone, Outlook e
// outros; o Android usa o link do Google Agenda, em src/lib/agenda.ts).
export async function GET() {
  const s = await seasonAtual().catch(() => null);
  if (!s?.dataEvento) {
    return new Response("A data do evento ainda não foi definida.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(icsDoEvento({ numero: s.numero, dataEvento: s.dataEvento, local: s.local }), {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `attachment; filename="game-jam-season-${s.numero}.ics"`,
      "cache-control": "public, max-age=300",
    },
  });
}
