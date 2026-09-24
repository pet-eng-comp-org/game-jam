"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Season } from "@/models/Season"
import FormInscricao from "../components/FormInscricao"

// Tela "Inscricoes" do mockup (Figma, Season 4, pagina Site, frame 220:51):
// logo com os fantasmas a esquerda, titulo e formulario a direita, sobre o
// fundo de labirinto. Sem barra de navegacao, como no desenho.
type Estado = { tipo: "carregando" } | { tipo: "erro" } | { tipo: "pronto"; season: Season | null }

export default function Inscricao() {

  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" })

  useEffect(() => {
    Season.obtemAtual()
      .then((season) => setEstado({ tipo: "pronto", season }))
      // Antes a pagina ficava em "Carregando..." para sempre se a API falhasse.
      .catch(() => setEstado({ tipo: "erro" }))
  }, [])

  // Fundo preso a janela, como no mockup: com cover sobre a pagina inteira, o
  // labirinto ampliava e os pontos caiam em cima do titulo.
  return (
    <div className="min-h-screen bg-fundo bg-[url('/background-inscricao.webp')] bg-cover bg-fixed bg-center">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col items-center gap-10 px-4 py-12 lg:flex-row lg:items-start lg:justify-center lg:gap-[90px] lg:px-16">

        {/* No desktop o logo acompanha a rolagem do formulario. */}
        <div className="flex shrink-0 justify-center lg:sticky lg:top-[calc(50vh-215px)] lg:w-[497px]">
          <Link href="/" aria-label="Voltar ao início do Game Jam">
            <img src="/logo-alt.png" alt="PET Game Jam, Season IV" className="h-64 object-contain md:h-96 lg:h-[431px]" />
          </Link>
        </div>

        <div className="flex w-full max-w-[555px] flex-col lg:pt-[84px]">
          <h1 className="mb-10 text-center font-titulo text-4xl text-[#FFD935] sm:text-5xl md:text-[64px] md:leading-[80px]">
            inscrições
          </h1>

          {estado.tipo === "carregando" && <Aviso titulo="Carregando..." />}

          {estado.tipo === "erro" && (
            <Aviso titulo="Não foi possível carregar a inscrição." texto="Tente de novo em alguns minutos." />
          )}

          {estado.tipo === "pronto" && (
            estado.season?.getInscricoesAbertas ? (
              <FormInscricao numParticipantesPorEquipe={estado.season.getNumParticipantesPorEquipe} />
            ) : (
              <Aviso titulo="As inscrições estão fechadas." texto="Acompanhe o Instagram @petengcomp para saber quando abrem." />
            )
          )}
        </div>
      </div>
    </div>
  )
}

function Aviso({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <div role="status" className="rounded-[21px] bg-barra/90 p-8 text-center">
      <p className="text-2xl font-bold text-destaque">{titulo}</p>
      {texto && <p className="mt-2 text-lg text-destaque-claro">{texto}</p>}
    </div>
  )
}
