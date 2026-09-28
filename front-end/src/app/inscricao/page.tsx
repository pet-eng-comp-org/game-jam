"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Season } from "@/models/Season"
import FormInscricao from "../components/FormInscricao"
import { diaEHora } from "@/lib/datas"

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
      {/* <main>: a regiao principal, que o leitor de tela usa para pular direto
          ao conteudo. Esta pagina nao usa o Layout, que ja tem uma. */}
      <main className="mx-auto flex min-h-screen max-w-[1440px] flex-col items-center gap-10 px-4 py-12 lg:flex-row lg:items-start lg:justify-center lg:gap-[90px] lg:px-16">

        {/* No desktop o logo acompanha a rolagem do formulario. */}
        <div className="flex shrink-0 justify-center lg:sticky lg:top-[calc(50vh-215px)] lg:w-[497px]">
          <Link href="/" aria-label="Voltar ao início do Game Jam">
            {/* Sem a faixa "Season IV" do Figma: ela prendia a logo a uma edicao.
                O numero da season fica no titulo, ao lado. */}
            {/* Menor no celular: com 256px, o formulario so aparecia depois de
                rolar. */}
            <img src="/marca/quadro-game-jam.svg" alt="PET Game Jam" className="h-40 sm:h-64 md:h-96 lg:h-[431px]" />
          </Link>
        </div>

        <div className="flex w-full max-w-[555px] flex-col lg:pt-[148px]">
          <h1 className="text-center font-secao text-5xl uppercase leading-none text-[#FFD935] md:text-7xl lg:text-8xl">
            inscrições
          </h1>
          {/* A edicao numa frase embaixo do titulo, e nao numa etiqueta em caixa
              alta em cima dele. Vem do painel. */}
          <p className="mb-10 mt-2 text-balance text-center text-lg text-destaque-claro lg:mb-[64px]">
            {estado.tipo === "pronto" && estado.season ? subtitulo(estado.season) : "\u00a0"}
          </p>

          {estado.tipo === "carregando" && <Aviso titulo="Carregando..." />}

          {estado.tipo === "erro" && (
            <Aviso titulo="Não foi possível carregar a inscrição." texto="Tente de novo em alguns minutos." />
          )}

          {estado.tipo === "pronto" && (
            estado.season?.getInscricoesAbertas ? (
              <FormInscricao
                numParticipantesPorEquipe={estado.season.getNumParticipantesPorEquipe}
                season={{ numero: String(estado.season.getNumero), dataEvento: estado.season.getDados?.dataEvento ?? null, local: estado.season.getDados?.local ?? null }}
              />
            ) : (
              <Aviso {...avisoFechada(estado.season)} />
            )
          )}
        </div>
      </main>
    </div>
  )
}

// Com as inscricoes abertas, o prazo e o tamanho da equipe: o que a pessoa
// precisa saber antes de comecar. Fechadas, so a edicao.
function subtitulo(season: Season) {
  const d = season.getDados
  const n = season.getNumParticipantesPorEquipe
  if (!season.getInscricoesAbertas || !d?.inscricoesFecham) return `Para a Season ${season.getNumero} do Game Jam.`
  return `Para a Season ${season.getNumero}, até ${diaEHora(d.inscricoesFecham)}. Equipes de 1 a ${n} pessoas.`
}

// Fechada por que? Ainda nao abriu, ja encerrou, ou sem periodo definido.
function avisoFechada(season: Season | null) {
  const d = season?.getDados
  const agora = Date.now()
  if (d?.inscricoesAbrem && new Date(d.inscricoesAbrem).getTime() > agora) {
    return { titulo: `As inscrições abrem em ${diaEHora(d.inscricoesAbrem)}.`, texto: "Monte sua equipe e volte aqui nesse dia!" }
  }
  if (d?.inscricoesFecham && new Date(d.inscricoesFecham).getTime() <= agora) {
    return { titulo: "As inscrições desta edição foram encerradas.", texto: "Acompanhe o Instagram @petengcomp para saber da próxima." }
  }
  return { titulo: "As inscrições ainda não estão abertas.", texto: "Acompanhe o Instagram @petengcomp para saber quando abrem." }
}

function Aviso({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <div role="status" className="rounded-[21px] bg-barra/90 p-8 text-center">
      <p className="text-2xl font-bold text-destaque">{titulo}</p>
      {texto && <p className="mt-2 text-lg text-destaque-claro">{texto}</p>}
    </div>
  )
}
