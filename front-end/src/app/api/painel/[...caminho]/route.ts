import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { TAG_CONTEUDO } from "@/lib/conteudo";
import { COOKIE_SESSAO } from "@/lib/sessao";

// Todas as chamadas do painel passam por aqui: o token fica num cookie
// httpOnly, que o JavaScript da pagina nao le (um script injetado nao consegue
// roubar a sessao), e e este servidor que o poe no Authorization da API.
//
// Depois de uma escrita que deu certo, as paginas publicas (geradas no
// servidor, em cache) se refazem na proxima visita, sem esperar os 5 minutos.

function hostDe(origem: string | null) {
  try {
    return origem ? new URL(origem).host : null;
  } catch {
    return null;
  }
}

const base = () => process.env.API_URL_INTERNA || process.env.NEXT_PUBLIC_API_URL;

async function repassa(req: NextRequest, { params }: { params: Promise<{ caminho: string[] }> }) {
  const escrita = req.method !== "GET";

  // O cookie e SameSite=Lax, que ja barra POST de outro site; a origem
  // conferida aqui fecha o resto (um subdominio, um navegador antigo). Compara
  // com o Host da requisicao, que o Traefik preserva: o endereco que o proprio
  // servidor enxerga (req.nextUrl) e o interno, nao o que o navegador usou.
  if (escrita && hostDe(req.headers.get("origin")) !== req.headers.get("host")) {
    return NextResponse.json({ error: "Origem não permitida." }, { status: 403 });
  }

  const token = req.cookies.get(COOKIE_SESSAO)?.value;
  if (!token) return NextResponse.json({ error: "Sem sessão." }, { status: 401 });

  const { caminho } = await params;
  const cabecalhos: HeadersInit = { Authorization: `Bearer ${token}` };
  const tipo = req.headers.get("content-type");
  if (tipo) cabecalhos["content-type"] = tipo;

  const destino = `${base()}/${caminho.map(encodeURIComponent).join("/")}${req.nextUrl.search}`;
  const resposta = await fetch(destino, {
    method: req.method,
    headers: cabecalhos,
    body: escrita ? await req.arrayBuffer() : undefined,
    cache: "no-store",
  }).catch(() => null);
  if (!resposta) return NextResponse.json({ error: "API fora do ar." }, { status: 502 });

  if (escrita && resposta.ok) revalidateTag(TAG_CONTEUDO, { expire: 0 });

  return new NextResponse(resposta.body, {
    status: resposta.status,
    headers: { "content-type": resposta.headers.get("content-type") ?? "application/json" },
  });
}

export { repassa as GET, repassa as POST, repassa as PUT, repassa as DELETE };
