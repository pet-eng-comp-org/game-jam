"use client"

import { useState } from "react"
import Titulo from "./Título"
import type { Season, EdicaoSeason } from "@/models/Season"

// O Brasil nao tem horario de verao desde 2019: o horario de Vitoria e sempre
// UTC-3. O painel mostra e recebe datas nesse horario.
const FUSO = "-03:00"

// ISO -> valor de <input type="datetime-local"> no horario de Vitoria.
function paraCampoDataHora(iso: string | null | undefined) {
  if (!iso) return ""
  const d = new Date(new Date(iso).getTime() - 3 * 3600 * 1000)
  return d.toISOString().slice(0, 16)
}

function paraCampoData(iso: string | null | undefined) {
  return paraCampoDataHora(iso).slice(0, 10)
}

interface Props {
  season: Season
  fechar: () => void
  salvo: () => void
}

const CAMPO = "w-full rounded-md border border-gray-300 bg-white p-2"

export default function FormEditarSeason({ season, fechar, salvo }: Props) {

  const d = season.getDados
  const [pessoas, setPessoas] = useState(String(season.getNumParticipantesPorEquipe))
  const [dataEvento, setDataEvento] = useState(paraCampoData(d?.dataEvento))
  const [linguagens, setLinguagens] = useState(d?.linguagens ?? "")
  const [abrem, setAbrem] = useState(paraCampoDataHora(d?.inscricoesAbrem))
  const [fecham, setFecham] = useState(paraCampoDataHora(d?.inscricoesFecham))
  const [regulamento, setRegulamento] = useState(d?.regulamento ?? "")
  const [salvando, setSalvando] = useState(false)

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    const dados: EdicaoSeason = {
      numParticipantesPorEquipe: Number(pessoas),
      // O dia do evento vai ao meio-dia, para nenhum fuso trocar a data.
      dataEvento: dataEvento ? `${dataEvento}T12:00:00${FUSO}` : null,
      linguagens: linguagens.trim() || null,
      inscricoesAbrem: abrem ? `${abrem}:00${FUSO}` : null,
      inscricoesFecham: fecham ? `${fecham}:00${FUSO}` : null,
      regulamento: regulamento.trim() || null,
    }
    setSalvando(true)
    const ok = await season.editar(dados)
    setSalvando(false)
    if (ok) salvo()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50 p-4">
      <section className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-gray-200 p-6 pt-12">

        <button type="button" onClick={fechar} aria-label="Fechar" className="absolute right-4 top-2 text-xl font-bold hover:text-red-500">x</button>

        <Titulo valor={`Season ${season.getNumero}`} />

        <form onSubmit={salvar} className="flex flex-col gap-4">

          <label className="flex flex-col gap-1">
            <span className="font-bold">Pessoas por equipe (no máximo)</span>
            <input type="number" min={1} max={10} required value={pessoas} onChange={e => setPessoas(e.target.value)} className={CAMPO} />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-bold">Dia da competição</span>
            <input type="date" value={dataEvento} onChange={e => setDataEvento(e.target.value)} className={CAMPO} />
          </label>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-1 font-bold">Inscrições (horário de Vitória)</legend>
            <label className="flex flex-col gap-1">
              <span>Abrem em</span>
              <input type="datetime-local" value={abrem} onChange={e => setAbrem(e.target.value)} className={CAMPO} />
            </label>
            <label className="flex flex-col gap-1">
              <span>Fecham em</span>
              <input type="datetime-local" value={fecham} onChange={e => setFecham(e.target.value)} className={CAMPO} />
            </label>
            <p className="text-sm sm:col-span-2">
              O site abre e fecha as inscrições sozinho nesses horários. Sem as duas datas, ficam fechadas.
            </p>
          </fieldset>

          <label className="flex flex-col gap-1">
            <span className="font-bold">Linguagens permitidas (uma por linha)</span>
            <textarea rows={3} value={linguagens} onChange={e => setLinguagens(e.target.value)} className={CAMPO} />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-bold">Regulamento</span>
            <span className="text-sm">
              Aparece na página Regras. <code>## Título</code> vira um título de seção, e linhas
              começando com <code>1.</code> viram lista numerada. Vazio, a página mostra só o formato.
            </span>
            <textarea rows={12} value={regulamento} onChange={e => setRegulamento(e.target.value)} className={`${CAMPO} font-mono text-sm`} />
          </label>

          <button type="submit" disabled={salvando} className="rounded-md bg-blue-950 p-3 font-bold text-white duration-300 hover:bg-blue-900 disabled:opacity-60">
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </section>
    </div>
  )
}
