"use client"

import { useEffect, useState } from "react"
import { IconeLixeira } from "../components/Icones";
import { Season } from "@/models/Season";
import Botao from "../components/Botao";
import Layout from "../components/Layout";
import FormCadastrarSeason from "../components/FormCadastrarSeason";
import FormEditarSeason from "../components/FormEditarSeason";

export default function Seasons() {

    const [seasons, setSeasons] = useState<Season[]>([])
    const [exibeFormCadastro, setExibeFormCadastro] = useState(false)
    const [editando, setEditando] = useState<Season | null>(null)

    async function cadastrarSeason(numero: string, capa: File, numParticipantesPorEquipe: string) {

        const data = new FormData()
        data.append("numero", numero)
        data.append("file", capa)
        data.append("numParticipantesPorEquipe", numParticipantesPorEquipe)
        
        await Season.cadastrar(data)

        setExibeFormCadastro(false)
        carregaSeasons()
    }

    async function tornaSeasonAtual(season: Season) {
        
        await season.tornaAtual()

        carregaSeasons()
    }

    async function deletaSeason(season: Season) {

        await season.deletar()

        carregaSeasons()
    }
    
    async function carregaSeasons() {

        const response = await Season.obtemTodos()
        setSeasons(response)
    }

    useEffect(() => {
        carregaSeasons()
    }, [])


    function renderizaSeasons() {

        return seasons?.map((season, i) => {

            return(

            <tr key={season.getId}>

                <td className={`text-center w-16 p-2 text-lg md:w-[120px] ${((i+1) % 2) ? 'bg-gray-300' : 'bg-gray-200'}`}>
                    {season.getNumero}
                </td>

                <td className={`text-center w-20 p-2 text-lg md:w-[140px] ${((i+1) % 2) ? 'bg-gray-300' : 'bg-gray-200'}`}>
                    {season.getNumParticipantesPorEquipe}
                </td>

                {/* O flex fica num div: numa <td> ele tirava a celula do layout de
                    tabela e desalinhava a linha. Os botoes quebram linha no celular. */}
                <td className={`p-2 text-lg ${((i+1) % 2) ? 'bg-gray-300' : 'bg-gray-200'} `}>
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">

                        <Botao nome="Editar" onClick={() => setEditando(season)} className="text-sm" />

                        {
                            !season.getAtual ? (
                                <>
                                    <Botao nome="Tornar Season Atual" onClick={() => tornaSeasonAtual(season)} 
                                    className="text-sm bg-green-500 hover:bg-green-400"/>

                                    <button type="button" onClick={() => deletaSeason(season)} aria-label={`Apagar a season ${season.getNumero}`}
                                    className="text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full">
                                        {IconeLixeira}
                                    </button>
                                </>
                            ) :
                            (
                                <span className={`rounded px-2 py-1 text-xs font-bold ${season.getInscricoesAbertas ? "bg-green-600 text-white" : "bg-gray-400"}`}>
                                    {season.getInscricoesAbertas ? "inscrições abertas" : "inscrições fechadas"}
                                </span>
                            )
                        }
                    </div>
                </td>
            </tr>

            )
        })
    }

    return (

        <Layout titulo="Season"
        form={
            editando ? <FormEditarSeason season={editando} fechar={() => setEditando(null)} salvo={() => { setEditando(null); carregaSeasons() }} />
            : exibeFormCadastro ? <FormCadastrarSeason cadastrarSeason={cadastrarSeason} fechar={() => setExibeFormCadastro(false)}/> : false
        }
        >

            <p className="mb-10">
                Nesta seção, você pode gerenciar as Seasons (temporadas) do Game Jam.
            </p>

            <Botao nome="Nova Season" onClick={() => setExibeFormCadastro(true)} className="mb-5"/>

            {/* No celular a tabela rola dentro desta caixa. */}

            <div className="overflow-x-auto">

            <table className="w-full rounded-xl lg:w-auto">
                <thead className="font-bold bg-blue-950 text-white">
                    <tr>
                        <th className="rounded-tl-xl p-2 border-r border-r-white">Season</th>
                        <th className="p-2 border-r border-r-white">Pessoas por equipe</th>
                        <th className="rounded-tr-xl p-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {renderizaSeasons()}
                </tbody>
            </table>
            </div>
        </Layout>
    )
}