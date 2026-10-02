"use client"

import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import Titulo from "./Título"
import type { Jogo, EdicaoJogo } from "@/models/Jogos"
import { capaDoJogo } from "@/lib/capa"

interface Props {
  // Sem jogo, cadastra um novo; com jogo, edita os textos dele.
  jogo?: Jogo
  cadastrar: (dados: EdicaoJogo, capa: File) => Promise<boolean>
  fechar: () => void
  salvo: () => void
}

const CAMPO = "w-full rounded-md border border-gray-300 bg-white p-2"

export default function FormJogo({ jogo, cadastrar, fechar, salvo }: Props) {

  const d = jogo?.getDados
  const [nome, setNome] = useState(d?.nome ?? "")
  const [equipe, setEquipe] = useState(d?.equipe ?? "")
  const [integrantes, setIntegrantes] = useState(d?.integrantes ?? "")
  const [descricao, setDescricao] = useState(d?.descricao ?? "")
  const [link, setLink] = useState(d?.link ?? "")
  const [ordem, setOrdem] = useState(String(d?.ordem ?? 0))
  const [capa, setCapa] = useState<File>()
  const [preview, setPreview] = useState(d ? capaDoJogo(d.capa) : "")
  const [salvando, setSalvando] = useState(false)

  function escolheCapa(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    setCapa(arquivo)
    setPreview(URL.createObjectURL(arquivo))
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    const dados: EdicaoJogo = { nome, equipe, integrantes, descricao, link, ordem: Number(ordem) || 0 }
    if (!jogo && !capa) return toast.warning("Escolha a capa do jogo.")
    setSalvando(true)
    const ok = jogo ? await jogo.editar(dados) : await cadastrar(dados, capa!)
    setSalvando(false)
    if (ok) salvo()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50 p-4">
      <section className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-xl bg-gray-200 p-6 pt-12">

        <button type="button" onClick={fechar} aria-label="Fechar" className="absolute right-4 top-2 text-xl font-bold hover:text-red-500">x</button>

        <Titulo valor={jogo ? "Editar Jogo" : "Cadastrar Jogo"} nivel={2} />

        <form onSubmit={salvar} className="flex flex-col gap-4">

          {jogo ? (
            // A capa nao muda na edicao: para trocar, apague e cadastre de novo.
            <img src={preview} alt="Capa do jogo" className="w-full rounded-md object-cover" />
          ) : (
            <label className="relative flex h-56 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md bg-gray-300 duration-300 hover:bg-gray-200">
              {preview
                ? <img src={preview} alt="Prévia da capa" className="absolute inset-0 h-full w-full object-cover" />
                : <span className="text-center">Capa do jogo<br /><span className="text-4xl">+</span></span>}
              <input type="file" accept="image/png, image/jpeg" onChange={escolheCapa} className="sr-only" aria-label="Capa do jogo" />
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className="font-bold">Nome do jogo</span>
            <span className="text-sm text-gray-600">Opcional. Sem nome, o site mostra a equipe.</span>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} className={CAMPO} />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-bold">Equipe</span>
            <input type="text" required value={equipe} onChange={e => setEquipe(e.target.value)} className={CAMPO} />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-bold">Integrantes</span>
            <span className="text-sm text-gray-600">Um por linha. O site mostra quando o jogo não tem descrição.</span>
            <textarea rows={3} value={integrantes} onChange={e => setIntegrantes(e.target.value)} className={CAMPO} />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-bold">Descrição</span>
            <textarea rows={4} value={descricao} onChange={e => setDescricao(e.target.value)} className={CAMPO} />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-bold">Link para jogar</span>
            <input type="url" required placeholder="https://" value={link} onChange={e => setLink(e.target.value)} className={CAMPO} />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-bold">Ordem na season</span>
            <span className="text-sm text-gray-600">Menor aparece primeiro.</span>
            <input type="number" value={ordem} onChange={e => setOrdem(e.target.value)} className={CAMPO} />
          </label>

          <button type="submit" disabled={salvando} className="rounded-md bg-blue-950 p-3 font-bold text-white duration-300 hover:bg-blue-900 disabled:opacity-60">
            {salvando ? "Salvando…" : "Salvar"}
          </button>
        </form>
      </section>
    </div>
  )
}
