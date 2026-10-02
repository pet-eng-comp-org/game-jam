"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Usuario } from "@/models/Usuario";
import { Season } from "@/models/Season";
import { obtemEquipes } from "@/models/Equipes";
import type { EquipeInscrita } from "@/lib/planilha";
import { diaEHora } from "@/lib/datas";
import Botao from "./components/Botao";
import FormAlterarSenha from "./components/FormAlterarSenha";
import { toast } from "sonner";
import Layout from "./components/Layout";

// Inicio do painel: a season atual num relance (inscricoes, numeros) e o que
// ainda falta preencher antes do evento. Antes era so um "Fique atento nas
// orientacoes abaixo" sem nada abaixo.
export default function Admin() {

    const [usuario, setUsuario] = useState<Usuario>()
    const [exibeFormAlterarSenha, setExibeFormAlterarSenha] = useState<boolean>(false)
    const [season, setSeason] = useState<Season | null | undefined>(undefined)
    const [equipes, setEquipes] = useState<EquipeInscrita[]>([])
    // Falha ao buscar a season (API fora do ar) e diferente de nao haver season
    // atual: antes as duas diziam "escolha uma em Season".
    const [falhou, setFalhou] = useState(false)

    useEffect(() => {
        (async () => {
            setUsuario(await Usuario.detalhesUsuarioLogado())
            try {
                const atual = await Season.obtemAtual()
                setSeason(atual)
                if (atual) setEquipes(await obtemEquipes(String(atual.getId)))
            } catch {
                setFalhou(true)
            }
        })()
    }, [])

    async function alterarSenha(senha: string, senhaConfirmada: string) {

        if(senha != senhaConfirmada){
            toast.warning("As senhas não coincidem")
            return
        }

        await usuario?.alterarSenha(senha)
        setExibeFormAlterarSenha(false)
    }

    const d = season?.getDados
    const participantes = equipes.reduce((n, e) => n + e.participantes.length, 0)
    const aprovadas = equipes.filter((e) => e.aprovada).length

    const inscricoes = !d ? "" :
        d.situacaoInscricoes === "abertas" ? `Abertas até ${diaEHora(d.inscricoesFecham!)}.` :
        d.situacaoInscricoes === "antes" ? `Abrem em ${diaEHora(d.inscricoesAbrem!)}.` :
        d.situacaoInscricoes === "encerradas" ? `Encerradas em ${diaEHora(d.inscricoesFecham!)}.` :
        "Sem período definido: ninguém consegue se inscrever."

    // O que o site mostra como "em breve" enquanto nao for preenchido.
    const faltando = !d ? [] : [
        !d.dataEvento && "data e hora do evento",
        !d.local && "local",
        (!d.inscricoesAbrem || !d.inscricoesFecham) && "período de inscrição",
        !d.linguagens && "linguagens permitidas",
        !d.regulamento && "regulamento",
    ].filter(Boolean) as string[]

    return (

        <Layout titulo={`Olá, ${usuario ? usuario.getUsername : ''}!`}
        form={exibeFormAlterarSenha ? <FormAlterarSenha alterarSenha={alterarSenha} fechar={() => setExibeFormAlterarSenha(false)}/> : false}
        >
            {falhou && (
                <p role="alert" className="mb-6">Não foi possível falar com a API agora, então o resumo da season não aparece. Tente recarregar a página em alguns minutos.</p>
            )}

            {season === null && (
                <p className="mb-6">Nenhuma season está marcada como atual. <Link href="/admin/seasons" className="font-bold underline">Escolha uma em Season</Link>.</p>
            )}

            {season && d && (
                <div className="grid max-w-4xl gap-4 md:grid-cols-2">
                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <h2 className="text-xl font-bold">Season {season.getNumero}</h2>
                        <p className="mt-3"><span className="font-bold">Inscrições: </span>{inscricoes}</p>
                        <p className="mt-1"><span className="font-bold">Evento: </span>{d.dataEvento ? diaEHora(d.dataEvento, true) : "sem data"}{d.local ? `, ${d.local}` : ""}</p>
                        <Link href="/admin/seasons" className="mt-4 inline-block font-bold underline">Editar a season</Link>
                    </section>

                    <section className="rounded-xl bg-white p-5 shadow-sm">
                        <h2 className="text-xl font-bold">Inscritos</h2>
                        <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                            <div><dt className="text-sm">Equipes</dt><dd className="text-3xl font-bold">{equipes.length}</dd></div>
                            <div><dt className="text-sm">Participantes</dt><dd className="text-3xl font-bold">{participantes}</dd></div>
                            <div><dt className="text-sm">A aprovar</dt><dd className="text-3xl font-bold">{equipes.length - aprovadas}</dd></div>
                        </dl>
                        <Link href="/admin/equipes" className="mt-4 inline-block font-bold underline">Ver as equipes e baixar a planilha</Link>
                    </section>

                    <section className="rounded-xl bg-white p-5 shadow-sm md:col-span-2">
                        <h2 className="text-xl font-bold">Antes do evento</h2>
                        {faltando.length ? (
                            <>
                                <p className="mt-3">Ainda aparece como &quot;em breve&quot; no site:</p>
                                <ul className="mt-2 list-disc pl-6">
                                    {faltando.map((f) => <li key={f}>{f}</li>)}
                                </ul>
                                <p className="mt-3">Tudo isso se preenche em <Link href="/admin/seasons" className="font-bold underline">Season → Editar</Link>.</p>
                            </>
                        ) : (
                            <p className="mt-3">Data, local, inscrições, linguagens e regulamento estão preenchidos.</p>
                        )}
                    </section>
                </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
                <Botao nome="Alterar Senha" onClick={() => setExibeFormAlterarSenha(true)} />
                <Link href="/" className="font-bold underline">Ver o site</Link>
            </div>
        </Layout>
    )
}
