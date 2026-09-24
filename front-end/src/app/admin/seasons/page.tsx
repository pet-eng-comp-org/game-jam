"use client"

import { useEffect, useState } from "react"
import { IconeLixeira } from "../components/Icones";
import { Season } from "@/models/Season";
import Botao from "../components/Botao";
import Layout from "../components/Layout";
import FormCadastrarSeason from "../components/FormCadastrarSeason";

export default function Seasons() {

    const [seasons, setSeasons] = useState<Season[]>([])
    const [exibeFormCadastro, setExibeFormCadastro] = useState(false)

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

    async function abreFechaInscricoes(season: Season) {

        if(season.getInscricoesAbertas){
            await season.fechaInscricoes()
        }
        else {
            await season.abreInscricoes()
        }

        carregaSeasons()
    }

    async function apagaCpfs(season: Season) {

        const confirma = window.confirm(
            `Apagar o CPF de todos os participantes da Season ${season.getNumero}?\n\n` +
            "Faça isso só depois de os certificados da PROEX terem sido emitidos. Não dá para desfazer."
        )

        if(confirma) await season.apagaCpfs()
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

                <td className={`text-center w-[200px] p-2 text-lg ${((i+1) % 2) ? 'bg-gray-300' : 'bg-gray-200'}`}>
                    {season.getNumero}
                </td>

                <td className={`text-center w-[200px] p-2 text-lg ${((i) % 2) ? 'bg-gray-300' : 'bg-gray-200'}`}>
                    {season.getNumParticipantesPorEquipe}
                </td>

                <td className={`flex items-center justify-center gap-3 p-2 text-lg ${((i+1) % 2) ? 'bg-gray-300' : 'bg-gray-200'} `}>

                        <Botao nome="Apagar CPFs" onClick={() => apagaCpfs(season)}
                        className="text-sm bg-gray-600 hover:bg-gray-500"/>

                        {
                            !season.getAtual ? (
                                <>
                                    <Botao nome="Tornar Season Atual" onClick={() => tornaSeasonAtual(season)} 
                                    className="text-sm bg-green-500 hover:bg-green-400"/>

                                    <button onClick={() => deletaSeason(season)}
                                    className="text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full">
                                        {IconeLixeira}
                                    </button>
                                </>
                            ) :
                            (
                                <Botao nome={season.getInscricoesAbertas ? "Fechar Inscrições" : "Abrir Inscrições"} 
                                onClick={() => abreFechaInscricoes(season)}
                                className="text-sm"
                                />
                            )
                        }
                        
                </td>
            </tr>

            )
        })
    }

    return (

        <Layout titulo="Season"
        form={exibeFormCadastro ? <FormCadastrarSeason cadastrarSeason={cadastrarSeason} fechar={() => setExibeFormCadastro(false)}/> : false}
        >

            <p className="mb-10">
                Nesta seção, você pode gerenciar as Seasons (temporadas) do Game Jam.
                O CPF dos participantes serve só para o certificado da PROEX: emitidos
                os certificados de uma season, use &quot;Apagar CPFs&quot; nela.
            </p>

            <Botao nome="Nova Season" onClick={() => setExibeFormCadastro(true)} className="mb-5"/>

            <table className="w-1/2 rounded-xl">
                <thead className="font-bold bg-blue-950 text-white">
                    <tr>
                        <th className="rounded-tl-xl p-2 border-r border-r-white">season</th>
                        <th className="p-2 border-r border-r-white">número máximo de integrantes por equipe</th>
                        <th className="rounded-tr-xl p-2">ações</th>
                    </tr>
                </thead>
                <tbody>
                    {renderizaSeasons()}
                </tbody>
            </table>
        </Layout>
    )
}