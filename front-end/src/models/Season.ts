import { api } from "@/services/api"
import { painel } from "@/services/painel"
import { toast } from "sonner"
import type { JogoJson, SeasonComJogosJson, SeasonJson } from "./api"
import { Jogo } from "./Jogos"
import { isAxiosError } from "axios"

// Campos que o painel edita numa season (PUT /seasons).
export interface EdicaoSeason {
    numParticipantesPorEquipe?: number
    dataEvento?: string | null
    linguagens?: string | null
    local?: string | null
    regulamento?: string | null
    ano?: string | null
    tema?: string | null
    inscricoesAbrem?: string | null
    inscricoesFecham?: string | null
}

class Season {

    private id?: string
    private numero: number
    private capa: string
    private numParticipantesPorEquipe: number
    private atual: boolean
    private inscricoesAbertas: boolean
    private jogos: Jogo[]
    // A season inteira como veio da API (datas, linguagens, regulamento).
    private dados: SeasonJson | null = null

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

    get getDados() {
        return this.dados
    }

    static deJson(json: SeasonJson) {
        const season = new Season(parseInt(json.numero), json.capa, parseInt(json.numParticipantesPorEquipe), json.atual, json.inscricoesAbertas, json.id)
        season.dados = json
        return season
    }

    static async obtemTodos() {

        try {
            const response = await painel.get("/seasons")

            const seasonsJSON = response.data

            const seasons = seasonsJSON.map((seasonJSON: SeasonJson) => Season.deJson(seasonJSON))

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
                const season = Season.deJson(seasonJSON)

                const jogosJSON = seasonJSON.jogos
                jogosJSON.forEach((jogoJSON: JogoJson) => season.jogos.push(new Jogo(jogoJSON)))

                return season
            })

            return seasons
        }
        catch(err) {
            console.log(err)
        }
    }

    static async cadastrar(data: FormData) {

        try {
            await painel.post("/seasons", data)

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

        return Season.deJson(seasonJSON)
    }

    async tornaAtual() {

        try {
            await painel.put("/seasons/atual", {}, {
                params: {
                    id: this.id
                }
            })

            toast.success("Season Atual atualizada com sucesso!")
        }
        catch(err) {
            console.log(err)
        }
    }

    // Edita a season (numero por equipe, data, linguagens, regulamento e o
    // periodo de inscricao). Devolve true se salvou.
    async editar(dados: EdicaoSeason) {

        try {
            await painel.put("/seasons", dados, {
                params: { id: this.id }
            })

            toast.success("Season atualizada!")
            return true
        }
        catch(err) {
            console.log(err)
            toast.error(isAxiosError(err) ? err.response?.data?.error ?? "Não foi possível salvar." : "Não foi possível salvar.")
            return false
        }
    }

    // Apaga o CPF de todos os participantes desta season. O CPF so serve para o
    // certificado da PROEX; emitidos os certificados, ele nao deve ficar guardado.
    async apagaCpfs() {

        try {
            const response = await painel.put("/seasons/apagaCpfs", {}, {
                params: { id: this.id }
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

        try {
            await painel.delete("/seasons", {
                params: {
                    id: this.id
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