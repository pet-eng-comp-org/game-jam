import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { TAG_CONTEUDO } from "@/lib/conteudo";

// O painel chama isto depois de salvar: as paginas publicas (geradas no
// servidor, em cache) se refazem na proxima visita, sem esperar os 5 minutos.
// So organizador logado: o token do cookie e conferido na propria API.
export async function POST(req: NextRequest) {
  const token = req.cookies.get("sessao")?.value;
  if (!token) return NextResponse.json({ error: "Sem sessão." }, { status: 401 });

  const base = process.env.API_URL_INTERNA || process.env.NEXT_PUBLIC_API_URL;
  const eu = await fetch(`${base}/eu`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }).catch(() => null);
  if (!eu?.ok) return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });

  revalidateTag(TAG_CONTEUDO, { expire: 0 });
  return NextResponse.json({ ok: true });
}
