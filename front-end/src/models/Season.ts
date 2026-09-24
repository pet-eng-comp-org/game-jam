import { getCookieClient } from "@/lib/cookieClient"
import { api } from "@/services/api"
import { toast } from "sonner"
import type { JogoJson, SeasonComJogosJson, SeasonJson } from "./api"
import { Jogo } from "./Jogos"

class Season {

    private id?: string
    private numero: number
    private capa: string
    private numParticipantesPorEquipe: number
    private atual: boolean
    private inscricoesAbertas: boolean
    private jogos: Jogo[]

    constructor(numero: number, capa: string, numParticipantesPorEquipe: number, atual: boolean, inscricoesAbertas: boolean, id?: string) {

        this.id = id
        this.numero = numero
        this.capa = capa
        this.numParticipantesPorEquipe = numParticipantesPorEquipe
        this.atual = atual
        this.inscricoesAbertas = inscricoesAbertas
        this.jogos = []
    }

    get getId() {
        return this.id
    }

    get getNumero() {
        return this.numero
    }

    get getCapa() {
        return this.capa
    }

    get getNumParticipantesPorEquipe() {
        return this.numParticipantesPorEquipe
    }

    get getAtual() {
        return this.atual
    }

    get getJogos() {
        return this.jogos
    }

    get getInscricoesAbertas() {
        return this.inscricoesAbertas
    }

    static async obtemTodos() {

        const token = getCookieClient()
                
        if(!token) return

        try {
            const response = await api.get("/seasons", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const seasonsJSON = response.data

            const seasons = seasonsJSON.map((seasonJSON: SeasonJson) => new Season(
                parseInt(seasonJSON.numero),
                seasonJSON.capa,
                parseInt(seasonJSON.numParticipantesPorEquipe),
                seasonJSON.atual,
                seasonJSON.inscricoesAbertas,
                seasonJSON.id
            ))

            return seasons
        }
        catch(err) {
            console.log(err)
        }
    }

    static async obtemTodosComJogos() {

        // Rota publica: nao depende do cookie do painel (o mesmo defeito escondia
        // materiais e patrocinadores de quem nao estava logado).
        try {
            const response = await api.get("/seasonsComJogos")

            const seasonsJSON = response.data

            const seasons = seasonsJSON.map((seasonJSON: SeasonComJogosJson) => {
                const season = new Season(
                    parseInt(seasonJSON.numero),
                    seasonJSON.capa,
                    parseInt(seasonJSON.numParticipantesPorEquipe),
                    seasonJSON.atual,
                    seasonJSON.inscricoesAbertas,
                    seasonJSON.id
                )

                const jogosJSON = seasonJSON.jogos
                jogosJSON.forEach((jogoJSON: JogoJson) => {
                    const jogo = new Jogo(
                        jogoJSON.nome,
                        jogoJSON.capa,
                        jogoJSON.descricao,
                        jogoJSON.link,
                        jogoJSON.id
                    )

                    season.jogos.push(jogo)
                })

                return season
            })

            return seasons
        }
        catch(err) {
            console.log(err)
        }
    }

    static async cadastrar(data: FormData) {

        const token = getCookieClient()
        
        if(!token) return

        try {
            await api.post("/seasons", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            toast.success('Season cadastrada com sucesso!')
        }
        catch(err) {
            toast.warning('Erro ao cadastrar Season.')
            console.log(err)
            return
        }
    }

    // null quando nao ha season atual; erro de rede sobe para quem chamou, que
    // assim distingue "sem season" de "API fora do ar".
    static async obtemAtual(): Promise<Season | null> {

        const response = await api.get<SeasonJson | null>("/seasons/atual")
        const seasonJSON = response.data

        if (!seasonJSON) return null

        return new Season(
            parseInt(seasonJSON.numero),
            seasonJSON.capa,
            parseInt(seasonJSON.numParticipantesPorEquipe),
            seasonJSON.atual,
            seasonJSON.inscricoesAbertas,
            seasonJSON.id
        )
    }

    async tornaAtual() {

        const token = getCookieClient()
                
        if(!token) return

        try {
            await api.put("/seasons/atual", {}, {
                params: {
                    id: this.id
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            toast.success("Season Atual atualizada com sucesso!")
        }
        catch(err) {
            console.log(err)
        }
    }

    async abreInscricoes() {

        const token = getCookieClient()
                
        if(!token) return

        try {
            await api.put("/seasons/abreInscricao", {}, {
                params: {
                    id: this.id
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            toast.success("Incrições abertas!")
        }
        catch(err) {
            console.log(err)
        }
    }

    async fechaInscricoes() {

        const token = getCookieClient()
                
        if(!token) return

        try {
            await api.put("/seasons/fechaInscricao", {}, {
                params: {
                    id: this.id
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            toast.success("Incrições fechadas!")
        }
        catch(err) {
            console.log(err)
        }
    }

    // Apaga o CPF de todos os participantes desta season. O CPF so serve para o
    // certificado da PROEX; emitidos os certificados, ele nao deve ficar guardado.
    async apagaCpfs() {

        const token = getCookieClient()

        if(!token) return

        try {
            const response = await api.put("/seasons/apagaCpfs", {}, {
                params: { id: this.id },
                headers: { Authorization: `Bearer ${token}` }
            })

            const apagados: number = response.data.apagados
            toast.success(apagados ? `${apagados} CPF(s) apagado(s).` : "Não havia CPF guardado nesta season.")
        }
        catch(err) {
            console.log(err)
            toast.error("Não foi possível apagar os CPFs.")
        }
    }

    async deletar() {

        const token = getCookieClient()
        
        if(!token) return

        try {
            await api.delete("/seasons", {
                params: {
                    id: this.id
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success('Season deletada com sucesso!')
        }
        catch(err) {
            console.log(err)
            return
        }
    }
}

export { Season }