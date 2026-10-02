import type { UsuarioJson } from "./api"
import { painel } from "@/services/painel"
import { toast } from "sonner"

class Usuario {

    private id?: string
    private username: string
    private senha?: string

    constructor(username: string, id?: string, senha?: string) {

        this.id = id
        this.username = username
        this.senha = senha
    }

    get getId() {
        return this.id
    }

    get getUsername() {
        return this.username
    }

    static fromJson(json: UsuarioJson): Usuario {
        return new Usuario(json.username, json.id)
    }

    static async obtemTodos() {

        try {
            const response = await painel.get("/users")

            return response.data
        }
        catch(err) {
            console.log(err)
        }
    }

    static async detalhesUsuarioLogado() {

        try {
            const response = await painel.get("/eu")

            return new Usuario(response.data.username, response.data.id)
        }
        catch(err) {
            console.log(err)
        }
    }

    async cadastrar() {

        try {
            await painel.post("/users", {
                username: this.username,
                senha: this.senha
            })

            toast.success('Usuário cadastrado com sucesso!')
        }
        catch(err) {
            toast.warning('Erro ao cadastrar usuário.')
            console.log(err)
            return
        }
    }

    async deletar() {

        try {
            await painel.delete("/users", {
                params: {
                    id: this.id
                }
            })
            toast.success('Usuário deletado com sucesso!')
        }
        catch(err) {
            console.log(err)
            return
        }
    }

    async alterarSenha(senha: string) {

        try {
            await painel.put("/users", {
                id: this.id,
                senha
            })
            toast.success('Senha alterada com sucesso!')
        }
        catch(err) {
            console.log(err)
            return
        }
    }
}

export { Usuario }