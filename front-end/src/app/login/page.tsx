import { api } from "@/services/api";
import { isAxiosError } from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { COOKIE_SESSAO, DURACAO_SESSAO_S } from "@/lib/sessao";

// O login do painel nao aparece em busca.
export const metadata: Metadata = { title: "Entrar", robots: { index: false, follow: false } };

// Motivo da ultima tentativa, vindo do redirect (?erro=): antes a senha errada
// so recarregava a tela, e a pessoa nao sabia o que tinha acontecido.
const ERROS: Record<string, string> = {
  senha: "Usuário ou senha incorretos.",
  limite: "Muitas tentativas. Espere alguns minutos e tente de novo.",
  servidor: "Não foi possível entrar agora. Tente de novo em alguns minutos.",
};

export default async function Login({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {

  const { erro } = await searchParams
  const mensagem = erro ? ERROS[erro] : undefined

  async function handleLogin(formData: FormData) {
    "use server"

    const username = formData.get('username')
    const senha = formData.get('senha')
    if(username == '' || senha == '') redirect("/login?erro=senha")

    // O redirect do Next funciona lancando uma excecao: fica fora do try, senao
    // o catch o pegava e trocava "senha incorreta" por "erro no servidor".
    let token: string | undefined
    try {
      const response = await api.post('/sessao', { username, senha })
      token = response.data.token
    }
    catch(err) {

      // So o status: o erro do axios carrega a requisicao inteira, com a senha
      // digitada, e ia parar no log do servidor a cada login errado.
      const status = isAxiosError(err) ? err.response?.status : undefined
      console.log("login recusado:", status ?? (isAxiosError(err) ? err.code : err))
      redirect(`/login?erro=${status === 429 ? "limite" : status && status < 500 ? "senha" : "servidor"}`)
    }

    if(!token) redirect("/login?erro=senha")

    // httpOnly: o JavaScript da pagina nao le o token (um script injetado nao
    // rouba a sessao); o painel fala com a API por app/api/painel.
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_SESSAO, token, {
      maxAge: DURACAO_SESSAO_S,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    })

    redirect("/admin")
  }

  return(

    <main className="flex min-h-screen flex-col items-center justify-center bg-fundo px-6 py-12">

        <img src="/marca/logo-pet-game-jam-vertical.svg" alt="PET Game Jam" className="h-36 md:h-52"/>

        <form action={handleLogin} className="mt-8 flex w-full max-w-sm flex-col gap-4">

          <h1 className="text-center font-secao text-4xl uppercase leading-none text-destaque">Painel da organização</h1>

          {mensagem && (
            <p role="alert" className="rounded-lg bg-[#FFB4A8]/15 px-4 py-3 text-center text-[#FFB4A8]">{mensagem}</p>
          )}

          <label className="flex flex-col gap-1.5 font-bold text-destaque-claro">
            Usuário
            <input type="text" name="username" autoComplete="username" required
              className="h-11 rounded-lg border border-white/30 bg-white/10 px-4 font-normal text-white outline-none focus:border-destaque" />
          </label>

          <label className="flex flex-col gap-1.5 font-bold text-destaque-claro">
            Senha
            <input type="password" name="senha" autoComplete="current-password" required
              className="h-11 rounded-lg border border-white/30 bg-white/10 px-4 font-normal text-white outline-none focus:border-destaque" />
          </label>

          <button type="submit" className="mt-2 h-11 rounded-full bg-destaque font-bold text-barra transition-opacity hover:opacity-90">
            Entrar
          </button>

          <Link href="/" className="text-center text-destaque-claro underline underline-offset-4">Voltar para o site</Link>
        </form>

    </main>
  )
}
