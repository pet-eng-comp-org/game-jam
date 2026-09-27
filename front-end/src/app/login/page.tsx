import { api } from "@/services/api";
import { isAxiosError } from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COOKIE_SESSAO, DURACAO_SESSAO_S } from "@/lib/sessao";

export default function Login() {

  async function handleLogin(formData: FormData) {
    "use server"

    const username = formData.get('username')
    const senha = formData.get('senha')
    if(username == '' || senha == '') return

    try {

      const response = await api.post('/sessao', {
        username,
        senha
      })

      if(!response.data.token) return

      // httpOnly: o JavaScript da pagina nao le o token (um script injetado nao
      // rouba a sessao); o painel fala com a API por app/api/painel.
      const cookieStore = await cookies()
      cookieStore.set(COOKIE_SESSAO, response.data.token, {
        maxAge: DURACAO_SESSAO_S,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
      })
    } 
    catch(err) {

      // So o status: o erro do axios carrega a requisicao inteira, com a senha
      // digitada, e ia parar no log do servidor a cada login errado.
      console.log("login recusado:", isAxiosError(err) ? err.response?.status ?? err.code : err)
      return
    }

    redirect("/admin")
  }

  return(
    
    <div className="h-screen flex flex-col justify-center items-center bg-blue-950">
        
        <img src="/marca/logo-pet-game-jam-vertical.svg" alt="Logo do PET Game Jam" className="md:h-52 h-36"/>

        <section className="mt-6 flex flex-col justify-center items-center gap-4 md:w-[600px] w-[90%]">

          <form action={handleLogin} className="flex w-[90%] flex-col gap-4 pb-4 text-lg">

            <input 
              type="text"
              name="username"
              placeholder="username"
              required
              className="h-10 px-4 rounded-lg border border-gray-100 bg-dark-900"
            />

            <input 
              type="password"
              name="senha"
              placeholder="senha"
              required
              className="h-10 px-4 rounded-lg border border-gray-100 bg-dark-900"
            />

            <button type="submit" className="h-10 bg-red-900 rounded-lg hover:scale-105 duration-500">
              Acessar
            </button>
          </form>

        </section>

    </div>
  )
}