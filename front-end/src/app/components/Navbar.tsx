"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Personagem from "./Personagem"

// A ordem e os rotulos vem do mockup da Season 4 (Figma, pagina Site).
// "Apoio" virou "Patrocinadores" e Jogos subiu para a segunda posicao.
// A pagina ativa e marcada por um personagem do Pac-Man em cima do nome, no
// lugar da bolinha colorida do mockup. A bolinha nascia meio para fora da
// barra; um fantasma cortado ao meio ficaria so a saia, entao ele vem inteiro
// e menor. Pac-Man no Inicio (amarelo, como a bolinha), depois os
// fantasmas na ordem do jogo: Blinky, Pinky, Inky e Clyde.
const paginas = [
  { label: 'Início', url: '/', personagem: 'pacman' },
  { label: 'Jogos', url: '/jogos', personagem: 'vermelho' },
  { label: 'Regras', url: '/regras', personagem: 'rosa' },
  { label: 'Materiais', url: '/materiais', personagem: 'ciano' },
  { label: 'Patrocinadores', url: '/apoio', personagem: 'laranja' },
] as const

export default function Navbar() {

  const caminho = usePathname()

  // Medidas do mockup (Figma, Season 4, "Nav-Bar"): barra de 79px; logo em
  // x=36; links num grupo CENTRADO na pagina (x=444 a 996 em 1440), 53px entre
  // eles, texto em y=25 com 25px de altura; botao de 143x53 em y=13, com
  // 25/14px de respiro. O botao Login saiu: o "Inscreva-se" fica onde ele
  // terminava, 17px antes da borda.
  return (
    <nav className="w-full bg-barra">
      <div className="relative mx-auto flex h-auto max-w-[1440px] flex-col items-center gap-4 px-9 py-4 md:block md:h-[79px] md:p-0">

        {/* A logo da Season IV em versao horizontal, para a barra: GAME JAM numa
            linha, da altura do texto dos links (28px), e o PET pequeno em cima,
            como assinatura. 43px no todo, centrada na barra. A vertical, a
            original, fica em marca/logo-pet-game-jam-vertical.svg. */}
        <Link href="/" aria-label="PET Game Jam — início" className="md:absolute md:left-9 md:top-[18px]">
          <img src="/marca/logo-pet-game-jam-horizontal.svg" alt="PET Game Jam" className="h-[43px] w-auto" />
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 md:absolute md:left-1/2 md:top-[25px] md:-translate-x-1/2 md:flex-nowrap md:gap-x-[53px]">
          {paginas.map((pagina) => {

            const ativa = caminho === pagina.url

            return (
              <Link
                key={pagina.url}
                href={pagina.url}
                aria-current={ativa ? "page" : undefined}
                className="relative py-2 text-base font-bold leading-[25px] text-destaque-claro transition-opacity hover:opacity-70 md:py-0"
              >
                {/* Fora do fluxo, para o grupo de links continuar centrado como no
                    mockup. No desktop fica em cima do nome, onde era a bolinha,
                    inteiro no espaco entre o topo da barra e o texto; no celular,
                    com os links em mais de uma linha, fica ao lado. */}
                {ativa && (
                  <Personagem
                    qual={pagina.personagem}
                    className="absolute right-full top-1/2 mr-[7px] h-[19px] w-[19px] -translate-y-1/2 md:right-auto md:top-auto md:bottom-full md:left-1/2 md:mr-0 md:mb-[3px] md:-translate-x-1/2 md:translate-y-0"
                  />
                )}
                {pagina.label}
              </Link>
            )
          })}
        </div>

        <Link href="/inscricao" className="w-full md:absolute md:right-[17px] md:top-[13px] md:w-auto">
          <span className="block w-full rounded-full bg-destaque px-[25px] py-3 text-center text-base font-bold leading-[25px] text-barra transition-opacity hover:opacity-90 md:w-auto md:py-[14px]">
            Inscreva-se
          </span>
        </Link>
      </div>
    </nav>
  )
}
