import { api } from "@/services/api"
import { painel } from "@/services/painel"
import { toast } from "sonner"
import type { MaterialJson } from "./api"

class Material {

    private id?: string
    private nome: string
    private descricao: string
    private link: string

    constructor(nome: string, descricao: string, link: string, id?: string) {

        this.id = id
        this.nome = nome
        this.descricao = descricao
        this.link = link
    }

    get getId() {
        return this.id
    }

    get getNome() {
        return this.nome
    }

    get getDescricao() {
        return this.descricao
    }

    get getLink() {
        return this.link
    }

    static async cadastrar({ nome, descricao, link }: { nome: string; descricao: string; link: string }) {

        try {
            await painel.post("/material", { nome, descricao, link })

        toast.success("Material cadastrado com sucesso!")
        }
        catch (err) {
            toast.warning("Erro ao cadastrar Material.")
            console.log(err)
        }
    }

    static async obtemTodosMateriais(): Promise<Material[]> {

        // Leitura publica: o site mostra isto a qualquer visitante. Exigir o
        // cookie do painel escondia a lista de quem nao estava logado.
        try {
            const response = await api.get("/material")

            return response.data.map((m: MaterialJson) =>
                new Material(m.nome, m.descricao, m.link, m.id)
            )
        }
        catch (err) {
            console.log(err)
            return []
        }
    }

    async deletar() {

        try {
            await painel.delete("/material", {
                params: { id: this.id }
            })
            toast.success('Material deletado com sucesso!')
        }
        catch (err) {
            console.log(err)
        }
    }
}

export { Material }
