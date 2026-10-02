"use client"

import { useState, useEffect } from "react"
import { Season } from "@/models/Season"
import Layout from "../components/Layout"
import { Jogo, type EdicaoJogo } from "@/models/Jogos"
import JogoComponente from "../components/JogoComponente"
import FormJogo from "../components/FormJogo"
import Botao from "../components/Botao"

export default function Jogos() {

    const [seasons, setSeasons] = useState<Season[]>()
    const [seasonSelecionada, setSeasonSelecionada] = useState<Season>()
    const [jogos, setJogos] = useState<Jogo[]>()
    const [exibeFormCadastro, setExibeFormCadastro] = useState(false)
    const [emEdicao, setEmEdicao] = useState<Jogo>()

    function selecionaSeason(id: string) {

        const seasonSelected = seasons?.find(season => season.getId === id)

        setSeasonSelecionada(seasonSelected)
        setJogos(seasonSelected?.getJogos)
    }

    async function cadastrarJogo(dados: EdicaoJogo, capa: File) {

        const data = new FormData()
        for (const [campo, valor] of Object.entries(dados)) data.append(campo, String(valor))
        data.append("file", capa)
        data.append("seasonId", seasonSelecionada?.getId ?? '')

        return Jogo.cadastrar(data)
    }

    function fechaForm() {

        setExibeFormCadastro(false)
        setEmEdicao(undefined)
    }

    // Recarrega mantendo a season que estava escolhida.
    async function carregaSeasons() {

        const response: Season[] = (await Season.obtemTodosComJogos()) ?? []
        setSeasons(response)
        const escolhida = response.find(s => s.getId === seasonSelecionada?.getId) ?? response[0]
        setSeasonSelecionada(escolhida)
        setJogos(escolhida?.getJogos)
    }

    async function deletaJogo(jogo: Jogo) {

        if (!confirm(`Apagar ${jogo.getNome ?? jogo.getDados.equipe}?`)) return

        await jogo.deletar()

        carregaSeasons()
    }

    useEffect(() => {
        carregaSeasons()
    }, [])

    return (

        <Layout 
        titulo="Jogos"
        form={exibeFormCadastro || emEdicao
            ? <FormJogo jogo={emEdicao} cadastrar={cadastrarJogo} fechar={fechaForm} salvo={() => { fechaForm(); carregaSeasons() }}/>
            : false}
        >

            <select 
            className={`
              flex w-max border-b border-gray-800 text-2xl focus:outline-0
              font-semibold mb-10
            `}
            value={seasonSelecionada?.getId ?? ''}
            onChange={(e) => selecionaSeason(e.target.value)}>
                {
                    seasons?.map((season) => {

                        return <option className="text-lg" key={season.getId} value={season.getId}>Season {season.getNumero}</option>
                    })
                }
            </select>

            <Botao nome="Cadastrar Jogo" onClick={() => setExibeFormCadastro(true)} className="mb-5"/>

            <ul className="flex flex-col gap-5">
                {
                    jogos?.length === 0 ? (
                        <span>Esta Season ainda não possui jogos cadastrados.</span>
                    )
                    : (
                        jogos?.map((jogo) => {
                            return <JogoComponente deletaJogo={deletaJogo} editaJogo={setEmEdicao} jogo={jogo} key={jogo.getId}/>
                        })  
                    )
                }
            </ul>

        </Layout>
    )
}