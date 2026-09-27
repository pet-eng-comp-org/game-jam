"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import Botao from "../components/Botao"
import { IconeLixeira } from "../components/Icones"
import { Season } from "@/models/Season"
import { aprovaEquipe, deletaEquipe, obtemEquipes } from "@/models/Equipes"
import { cpfFormatado, planilhaDeInscritos, type EquipeInscrita } from "@/lib/planilha"

export default function Equipes() {

    const [seasons, setSeasons] = useState<Season[]>([])
    const [seasonId, setSeasonId] = useState("")
    const [equipes, setEquipes] = useState<EquipeInscrita[]>([])

    async function carregaEquipes(id: string) {
        setEquipes(id ? await obtemEquipes(id) : [])
    }

    useEffect(() => {
        (async () => {
            const lista: Season[] = (await Season.obtemTodos()) ?? []
            setSeasons(lista)
            // Abre na season atual, que e onde as inscricoes chegam.
            const inicial = (lista.find((s) => s.getAtual) ?? lista[0])?.getId ?? ""
            setSeasonId(inicial)
            carregaEquipes(inicial)
        })()
    }, [])

    function trocaSeason(id: string) {
        setSeasonId(id)
        carregaEquipes(id)
    }

    async function apagaEquipe(equipe: EquipeInscrita) {
        const confirma = window.confirm(
            `Apagar a equipe "${equipe.nome}" com os ${equipe.participantes.length} participante(s)? Não dá para desfazer.`
        )
        if (!confirma) return
        await deletaEquipe(equipe.id)
        carregaEquipes(seasonId)
    }

    async function alternaAprovacao(equipe: EquipeInscrita) {
        const aprovada = !equipe.aprovada
        if (await aprovaEquipe(equipe.id, aprovada)) {
            setEquipes((lista) => lista.map((e) => (e.id === equipe.id ? { ...e, aprovada } : e)))
        }
    }

    function baixaPlanilha() {
        const numero = seasons.find((s) => s.getId === seasonId)?.getNumero ?? ""
        const url = URL.createObjectURL(new Blob([planilhaDeInscritos(equipes)], { type: "text/csv;charset=utf-8" }))
        const link = document.createElement("a")
        link.href = url
        link.download = `inscritos-season-${numero}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    const participantes = equipes.reduce((total, e) => total + e.participantes.length, 0)
    const aprovadas = equipes.filter((e) => e.aprovada).length

    return (

        <Layout titulo="Equipes">

            <p className="mb-6">
                As equipes inscritas em cada season. A planilha traz nome, e-mail e CPF de
                cada participante, para o certificado da Proex.
            </p>

            <div className="mb-6 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 font-bold">
                    Season
                    <select value={seasonId} onChange={(e) => trocaSeason(e.target.value)}
                    className="rounded-md bg-white p-2 font-normal">
                        {seasons.map((s) => (
                            <option key={s.getId} value={s.getId}>
                                {s.getNumero}{s.getAtual ? " (atual)" : ""}
                            </option>
                        ))}
                    </select>
                </label>

                <span>{equipes.length} equipe(s), {aprovadas} aprovada(s), {participantes} participante(s)</span>

                {equipes.length > 0 && <Botao nome="Baixar planilha" onClick={baixaPlanilha} />}
            </div>

            <div className="flex flex-col gap-4">
                {equipes.map((equipe) => (
                    <section key={equipe.id} className="min-w-0 rounded-xl bg-white p-5">
                        <div className="mb-3 flex items-center justify-between gap-4">
                            <h2 className="min-w-0 break-words text-xl font-bold">{equipe.nome}</h2>
                            <div className="flex shrink-0 items-center gap-2">
                                {/* aria-pressed: o leitor de tela diz se esta aprovada. */}
                                <button onClick={() => alternaAprovacao(equipe)} aria-pressed={equipe.aprovada}
                                aria-label={`Equipe ${equipe.nome} aprovada`}
                                className={`rounded-full px-3 py-1 text-sm font-semibold duration-200 ${equipe.aprovada
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "border border-gray-400 text-gray-700 hover:bg-gray-100"}`}>
                                    {equipe.aprovada ? "✓ Aprovada" : "Aprovar"}
                                </button>
                                <button onClick={() => apagaEquipe(equipe)} aria-label={`Apagar a equipe ${equipe.nome}`}
                                className="rounded-full p-2 text-red-500 hover:bg-red-500 hover:text-white">
                                    {IconeLixeira}
                                </button>
                            </div>
                        </div>

                        {/* No celular a tabela rola dentro do cartao, sem vazar por cima do resto. */}
                        <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-1 pr-4">Nome</th>
                                    <th className="py-1 pr-4">E-mail</th>
                                    <th className="py-1 pr-4">CPF</th>
                                    <th className="py-1 pr-4">Curso</th>
                                    <th className="py-1">Instituição</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipe.participantes.map((p) => (
                                    <tr key={p.id} className="border-b last:border-0">
                                        <td className="py-1 pr-4">{p.nome}</td>
                                        <td className="py-1 pr-4">{p.email}</td>
                                        <td className="py-1 pr-4">{cpfFormatado(p.cpf) || "apagado"}</td>
                                        <td className="py-1 pr-4">{p.curso ?? ""}</td>
                                        <td className="py-1">{p.ufes ? "Ufes" : p.instituicao}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </section>
                ))}

                {seasonId && equipes.length === 0 && <p>Nenhuma equipe inscrita nesta season.</p>}
            </div>
        </Layout>
    )
}
