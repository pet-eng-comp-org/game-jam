"use client"

import { useEffect, useRef } from "react"
import Personagem from "./Personagem"
import { diaEHora } from "@/lib/datas"

// Tela depois da inscricao, no lugar do formulario. Antes era so um aviso que
// sumia em segundos sobre o formulario vazio, e parecia que nada tinha
// acontecido (e convidava a mandar de novo).
//
// A animacao e a do jogo: o Pac-Man atravessa comendo as bolinhas, come a
// pastilha grande, o fantasma vira o assustado, o Pac-Man come o fantasma
// (aparece o 200, os pontos do primeiro fantasma no arcade) e sai pela
// direita. Classes em globals.css; com animacao reduzida, a cena fica parada.

const DURACAO = 2.6 // segundos para o Pac-Man atravessar e sair
const BOLINHAS = [8, 16, 24, 32, 40, 48, 56, 64] // posicao, em % da largura
const PASTILHA = 73

// Quando a boca do Pac-Man chega a uma posicao. Ele anda de 0 ate sair da
// faixa (100% + 8px); a conta supoe a faixa com uns 360px, e o erro em outras
// larguras e de uma fracao de segundo.
const chega = (posicao: number) => `${Math.max(0, (DURACAO * (3.6 * posicao - 28)) / 368).toFixed(2)}s`
const COME_FANTASMA = `${(DURACAO * 0.87).toFixed(2)}s`

interface Props {
  equipe: string
  season?: { numero: string; dataEvento: string | null; local: string | null }
  outra: () => void
}

export default function InscricaoRecebida({ equipe, season, outra }: Props) {
  const caixa = useRef<HTMLDivElement>(null)
  const titulo = useRef<HTMLHeadingElement>(null)

  // Mostra a caixa inteira, com a animacao, abaixo da barra fixa (scroll-mt),
  // e so entao leva o foco ao titulo: focar direto rolava so ate o titulo, e a
  // animacao ficava escondida atras da barra.
  useEffect(() => {
    caixa.current?.scrollIntoView({ block: "start" })
    titulo.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div ref={caixa} role="status" className="scroll-mt-28 rounded-[21px] bg-barra/90 px-6 py-10 text-center sm:px-10">
      <div aria-hidden className="relative mx-auto h-8 w-full max-w-[420px] overflow-hidden">
        {BOLINHAS.map((x) => (
          <span
            key={x}
            className="bolinha-comida absolute top-1/2 h-[5px] w-[5px] -translate-y-1/2 bg-[#FFB7AE]"
            style={{ left: `${x}%`, animationDelay: chega(x) }}
          />
        ))}
        <svg
          viewBox="0 0 8 8"
          shapeRendering="crispEdges"
          className="bolinha-comida absolute top-1/2 h-5 w-5 -translate-y-1/2"
          style={{ left: `${PASTILHA}%`, animationDelay: chega(PASTILHA) }}
        >
          <path fill="#FFB7AE" d="M2 0h4v1h-4zM1 1h6v1h-6zM0 2h8v4h-8zM1 6h6v1h-6zM2 7h4v1h-4z" />
        </svg>
        <span className="bolinha-comida absolute right-0 top-0 h-8 w-8" style={{ animationDelay: COME_FANTASMA }}>
          <span className="fantasma-vira-sai absolute inset-0" style={{ animationDelay: chega(PASTILHA) }}>
            <Personagem qual="vermelho" className="h-8 w-8" />
          </span>
          <span className="fantasma-vira-entra absolute inset-0" style={{ animationDelay: chega(PASTILHA) }}>
            <Personagem qual="assustado" className="h-8 w-8" />
          </span>
        </span>
        <span className="pontos absolute right-0 top-0 flex h-8 w-8 items-center justify-center" style={{ animationDelay: COME_FANTASMA }}>
          <Personagem qual="duzentos" className="h-[15px] w-8" />
        </span>
        <span className="pacman-anda absolute left-0 top-0 h-8 w-8" style={{ animationDuration: `${DURACAO}s` }}>
          <Personagem qual="pacman" mastigando className="h-8 w-8" />
        </span>
      </div>

      <h2 ref={titulo} tabIndex={-1} className="mt-8 font-secao text-5xl uppercase leading-none text-destaque outline-none md:text-6xl">
        Inscrição recebida!
      </h2>
      <p className="mt-4 text-lg text-destaque-claro">
        A equipe <strong className="text-white">{equipe}</strong> está na lista
        {season ? ` da Season ${season.numero}` : ""}. A confirmação vai para o e-mail de cada participante.
      </p>
      {season?.dataEvento && (
        <p className="mt-3 text-lg text-destaque-claro">
          Nos vemos {diaEHora(season.dataEvento, true)}{season.local ? `, no ${season.local}` : ""}.
        </p>
      )}
      <p className="mt-3 text-lg text-destaque-claro">
        Os próximos avisos saem no Instagram{" "}
        <a href="https://www.instagram.com/petengcomp/" target="_blank" rel="noopener noreferrer" className="text-destaque underline">
          @petengcomp
        </a>
        .
      </p>
      <button
        type="button"
        onClick={outra}
        className="mt-8 h-[42px] border-2 border-dashed border-[#FBDC70] px-5 text-base font-bold text-[#FBDC70] transition-colors hover:bg-[#FBDC70]/10"
      >
        Inscrever outra equipe
      </button>
    </div>
  )
}
