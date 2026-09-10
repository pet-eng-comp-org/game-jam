"use client"

import { useEffect, useState } from "react"
import { Season } from "@/models/Season"
import FormInscricao from "../components/FormInscricao"

export default function Inscricao() {

  //const [seasonAtual, setSeasonAtual] = useState<Season | null>(null)
  //quando terminar de editar, descomentar tudo oq está comentado e apagar a declaração abaixo
  const seasonAtual = new Season(4, "", 3, true, false, "")

  useEffect(() => {

  // async function fetchSeasonAtual() {

  //   const res = await Season.obtemAtual()
  //   setSeasonAtual(res ?? null)
  // }
  //fetchSeasonAtual()
}, [])

  if (!seasonAtual) {
    return <div className="mt-20 text-center">Carregando...</div>
  }

  return (

    <div
      style={{
        background: "url('/background-inscricao.webp') no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="flex lg:flex-row flex-col lg:h-screen justify-center items-center">

        <div className="lg:flex-1 w-full flex flex-col gap-12 justify-center items-center h-full mt-12 mb-12">

          {/* <span className="font-titulo text-3xl text-destaque md:text-4xl lg:text-5xl">

            {seasonAtual.getInscricoesAbertas
              ? "Inscrições abertas!"
              : "Inscrições fechadas!"}
          </span> */}
          <img src="/logo-alt.png" alt="Logo do PET Game Jam" className="md:h-96 h-64" /> 

        </div>

        <div className="flex w-full items-center justify-center lg:flex-1">

          {seasonAtual.getInscricoesAbertas ? (
            
            <FormInscricao numParticipantesPorEquipe={seasonAtual.getNumParticipantesPorEquipe} />
          ) : (
            <span className="text-3xl font-medium block text-center mx-auto max-w-2xl rounded-lg p-6 bg-[var(--color-barra)] text-[var(--color-destaque)] shadow-s">
              <strong>As inscrições estão fechadas...</strong><br />aguarde a próxima Season do Game Jam!
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
