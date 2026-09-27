import { api } from "@/services/api"
import { painel } from "@/services/painel"
import { toast } from "sonner"
import type { PatrocinadorJson } from "./api"

class Patrocinador {

    private id?: string
    private nome: string
    private logo: string

    constructor(nome: string, logo: string, id?: string) {

        this.id = id
        this.nome = nome
        this.logo = logo
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
            toast.warning("Erro ao cadastrar patrocinador.")
            console.log(err)
        }
    }

    static async obtemTodosPatrocinadores(): Promise<Patrocinador[]> {

        // Leitura publica: o site mostra isto a qualquer visitante. Exigir o
        // cookie do painel escondia a lista de quem nao estava logado.
        try {
            const response = await api.get("/patrocinador")

            return response.data.map((p: PatrocinadorJson) =>
                new Patrocinador(p.nome, p.logo, p.id)
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
