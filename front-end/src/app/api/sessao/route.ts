import { NextResponse } from "next/server";
import { COOKIE_SESSAO } from "@/lib/sessao";

// Sair do painel. O cookie e httpOnly: so o servidor consegue apagar.
export async function DELETE() {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.delete(COOKIE_SESSAO);
  return resposta;
}
