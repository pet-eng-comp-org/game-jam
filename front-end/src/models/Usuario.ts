import { getCookieClient } from "@/lib/cookieClient"
import type { UsuarioJson } from "./api"
import { api } from "@/services/api"
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

        const token = getCookieClient()
        
        if(!token) return

        try {
            const response = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return response.data
        }
        catch(err) {
            console.log(err)
        }
    }

    static async detalhesUsuarioLogado() {

        const token = getCookieClient()

        if(!token) return

        try {
            const response = await api.get("/eu", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return new Usuario(response.data.username, response.data.id)
        }
        catch(err) {
            console.log(err)
        }
    }

    async cadastrar() {

        const token = getCookieClient()
        
        if(!token) return

        try {
            await api.post("/users", {
                username: this.username,
                senha: this.senha
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
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

        const token = getCookieClient()
        
        if(!token) return

        try {
            await api.delete("/users", {
                params: {
                    id: this.id
                },
                headers: {
                    Authorization: `Bearer ${token}`
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

        const token = getCookieClient()
        
        if(!token) return

        try {
            await api.put("/users", {
                id: this.id,
                senha
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
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