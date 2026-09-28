"use client"

import { useEffect, useRef } from "react"
import Personagem from "./Personagem"
import { diaEHora } from "@/lib/datas"

// Tela depois da inscricao, no lugar do formulario. Antes era so um aviso que
// sumia em segundos sobre o formulario vazio, e parecia que nada tinha
// acontecido (e convidava a mandar de novo).
//
// A animacao e a do jogo: o Pac-Man atravessa comendo as bolinhas e, ao comer
// a pastilha grande, o fantasma do fim vira o assustado. Classes em
// globals.css (pacman-anda, bolinha-comida, fantasma-vira); com animacao
// reduzida, a cena fica parada.

const DURACAO = 1.8 // segundos para o Pac-Man chegar ao fim
const BOLINHAS = [6, 14, 22, 30, 38, 46, 54, 62, 70] // posicao, em % da largura
const PASTILHA = 79

// Quando o Pac-Man passa por uma posicao: ele anda de 0 a (100% - 80px), entao
// a conta e aproximada, e de proposito um pouco adiantada.
const atraso = (posicao: number) => `${(DURACAO * Math.min(1, posicao / 88)).toFixed(2)}s`

interface Props {
  equipe: string
  season?: { numero: string; dataEvento: string | null; local: string | null }
  outra: () => void
}

export default function InscricaoRecebida({ equipe, season, outra }: Props) {
  const titulo = useRef<HTMLHeadingElement>(null)

  // Quem usa leitor de tela ou teclado vai direto para a confirmacao.
  useEffect(() => titulo.current?.focus(), [])

  return (
    <div role="status" className="rounded-[21px] bg-barra/90 px-6 py-10 text-center sm:px-10">
      <div aria-hidden className="relative mx-auto h-8 w-full max-w-[420px]">
        {BOLINHAS.map((x) => (
          <span
            key={x}
            className="bolinha-comida absolute top-1/2 h-[6px] w-[6px] -translate-y-1/2 bg-[#FFB8AE]"
            style={{ left: `${x}%`, animationDelay: atraso(x) }}
          />
        ))}
        <span
          className="bolinha-comida absolute top-1/2 h-[14px] w-[14px] -translate-y-1/2 rounded-full bg-[#FFB8AE]"
          style={{ left: `${PASTILHA}%`, animationDelay: atraso(PASTILHA) }}
        />
        <span className="absolute right-0 top-0 h-8 w-8">
          <span className="fantasma-vira-sai absolute inset-0" style={{ animationDelay: atraso(PASTILHA) }}>
            <Personagem qual="vermelho" className="h-8 w-8" />
          </span>
          <span className="fantasma-vira-entra absolute inset-0" style={{ animationDelay: atraso(PASTILHA) }}>
            <Personagem qual="assustado" className="h-8 w-8" />
          </span>
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
