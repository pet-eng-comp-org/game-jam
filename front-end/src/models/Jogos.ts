import { getCookieClient } from "@/lib/cookieClient"
import { api } from "@/services/api"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import { revalidaSite } from "@/lib/revalida"
import type { JogoJson } from "./api"

// Campos que o painel edita. A capa so entra no cadastro.
export type EdicaoJogo = Pick<JogoJson, "equipe" | "descricao" | "link" | "ordem"> & { nome: string, integrantes: string }

class Jogo {

    private dados: JogoJson

    constructor(dados: JogoJson) {
        this.dados = dados
    }

    get getDados() {
        return this.dados
    }

    get getId() {
        return this.dados.id
    }

    get getNome() {
        return this.dados.nome
    }

    get getCapa() {
        return this.dados.capa
    }

    get getDescricao() {
        return this.dados.descricao
    }

    get getLink() {
        return this.dados.link
    }

    static async cadastrar(data: FormData) {

        const token = getCookieClient()

        if(!token) return false

        try {
            await api.post("/jogos", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            // Espera o site se refazer antes de dizer que salvou.
            await revalidaSite()

            toast.success('Jogo cadastrado com sucesso!')
            return true
        }
        catch(err) {
            toast.warning(isAxiosError(err) ? err.response?.data?.error ?? 'Erro ao cadastrar Jogo.' : 'Erro ao cadastrar Jogo.')
            return false
        }
    }

    async editar(dados: EdicaoJogo) {

        const token = getCookieClient()

        if(!token) return false

        try {
            await api.put("/jogos", dados, {
                params: { id: this.dados.id },
                headers: { Authorization: `Bearer ${token}` },
            })
            await revalidaSite()
            toast.success('Jogo salvo!')
            return true
        }
        catch(err) {
            toast.warning(isAxiosError(err) ? err.response?.data?.error ?? 'Erro ao salvar o jogo.' : 'Erro ao salvar o jogo.')
            return false
        }
    }

    async deletar() {

        const token = getCookieClient()

        if(!token) return

        try {
            await api.delete("/jogos", {
                params: {
                    id: this.dados.id
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // Espera o site se refazer antes de dizer que salvou.
            await revalidaSite()
            toast.success('Jogo deletado com sucesso!')
        }
        catch(err) {
            console.log(err)
            return
        }
    }
}

export { Jogo }
