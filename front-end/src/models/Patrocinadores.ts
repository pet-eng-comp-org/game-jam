import { api } from "@/services/api"
import { painel } from "@/services/painel"
import { toast } from "sonner"
import type { PatrocinadorJson } from "./api"

class Patrocinador {

    private id?: string
    private nome: string
    private logo: string
    private site: string | null

    constructor(nome: string, logo: string, id?: string, site: string | null = null) {

        this.id = id
        this.nome = nome
        this.logo = logo
        this.site = site
    }

    get getId() {
        return this.id
    }

    get getNome() {
        return this.nome
    }

    get getLogo() {
        return this.logo
    }

    get getSite() {
        return this.site
    }

    static async cadastrar(data: FormData) {

        try {
            await painel.post("/patrocinador", data, {
                headers: { 
                    "Content-Type": "multipart/form-data" 
                }
            })
            toast.success("Patrocinador cadastrado com sucesso!")
        }
        catch (err) {
            // A API diz o que esta errado (nome vazio, site sem http): mostrar isso.
            const motivo = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
            toast.warning(motivo ?? "Erro ao cadastrar patrocinador.")
            console.log(err)
        }
    }

    static async obtemTodosPatrocinadores(): Promise<Patrocinador[]> {

        // Leitura publica: o site mostra isto a qualquer visitante. Exigir o
        // cookie do painel escondia a lista de quem nao estava logado.
        try {
            const response = await api.get("/patrocinador")

            return response.data.map((p: PatrocinadorJson) =>
                new Patrocinador(p.nome, p.logo, p.id, p.site ?? null)
            )
        }
        catch (err) {
            console.log(err)
            return []
        }
    }

    async deletar() {

        try {
            await painel.delete("/patrocinador/remove", {
                params: { id: this.id }
            })
            toast.success("Patrocinador deletado com sucesso!")
        }
        catch (err) {
            console.log(err)
        }
    }
}

export { Patrocinador }
