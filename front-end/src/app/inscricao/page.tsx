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
<     div className="flex lg:flex-row flex-col lg:h-screen justify-center items-center px-4 lg:px-16 gap-4 lg:gap-8">

        <div className="lg:flex-1 w-full flex flex-col justify-center items-center h-full mt-12 mb-12">

          {/* <span className="font-titulo text-3xl text-destaque md:text-4xl lg:text-5xl">

            {seasonAtual.getInscricoesAbertas
              ? "Inscrições abertas!"
              : "Inscrições fechadas!"}
          </span> */}
          <img src="/logo-alt.png" alt="Logo do PET Game Jam" className="md:h-96 h-64 object-cover" /> 

        </div>

        <div className="flex w-full items-center justify-center lg:flex-1">

          {seasonAtual.getInscricoesAbertas ? (
            
            <FormInscricao numParticipantesPorEquipe={seasonAtual.getNumParticipantesPorEquipe} />
          ) : (
            <span className="text-3xl font-medium block text-center w-full max-w-xl border border-[var(--color-barra)] rounded-lg p-8 bg-[var(--color-barra)] text-[var(--color-destaque)] shadow-lg">
              <strong className="block text-2xl md:text-3xl lg:text-3xl">
                As inscrições estão fechadas...</strong>
              <span className="block text-xl font-normal mt-2">
                Aguarde a próxima Season do Game Jam!
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
