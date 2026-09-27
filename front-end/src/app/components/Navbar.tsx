"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Personagem from "./Personagem"

// A ordem e os rotulos vem do mockup da Season 4 (Figma, pagina Site).
// "Apoio" virou "Patrocinadores" e Jogos subiu para a segunda posicao.
// A pagina ativa e marcada por um personagem do Pac-Man no lugar da bolinha
// colorida do mockup, pendurado do topo da tela: Pac-Man no Inicio (amarelo,
// como a bolinha), depois os fantasmas na ordem do jogo: Blinky, Pinky, Inky e
// Clyde.
const paginas = [
  { label: 'Início', url: '/', personagem: 'pacman' },
  { label: 'Jogos', url: '/jogos', personagem: 'vermelho' },
  { label: 'Regras', url: '/regras', personagem: 'rosa' },
  { label: 'Materiais', url: '/materiais', personagem: 'ciano' },
  { label: 'Patrocinadores', url: '/apoio', personagem: 'laranja' },
] as const

// Sem patrocinador cadastrado, o link some: levava a uma pagina so com "em
// breve". A pagina continua no ar pelo endereco.
export default function Navbar({ mostraPatrocinadores = true }: { mostraPatrocinadores?: boolean }) {

  const caminho = usePathname()
  const [menuAberto, setMenuAberto] = useState(false)

  // Esc fecha o menu do celular.
  useEffect(() => {
    if (!menuAberto) return
    const fecha = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuAberto(false) }
    window.addEventListener("keydown", fecha)
    return () => window.removeEventListener("keydown", fecha)
  }, [menuAberto])

  // Medidas do mockup (Figma, Season 4, "Nav-Bar"): barra de 79px; logo em
  // x=36; links num grupo CENTRADO na pagina (x=444 a 996 em 1440), 53px entre
  // eles, texto em y=25 com 25px de altura; botao de 143x53 em y=13, com
  // 25/14px de respiro. O botao Login saiu: o "Inscreva-se" fica onde ele
  // terminava, 17px antes da borda.
  const visiveis = paginas.filter((p) => mostraPatrocinadores || p.url !== '/apoio')

  return (
    // A barra acompanha a rolagem. No desktop e fina (79px); no celular vira
    // uma faixa de 60px com a logo, a inscricao e o menu, em vez de empilhar
    // logo, links e botao (230px, um quarto da tela).
    <nav className="sticky top-0 z-50 w-full bg-barra">

      {/* Desktop */}
      <div className="relative mx-auto hidden h-[79px] max-w-[1440px] md:block">

        {/* A logo da Season IV em versao horizontal: GAME JAM da altura do texto
            dos links (28px) e o PET pequeno em cima, como assinatura. 43px no
            todo, centrada na barra. A vertical fica em
            marca/logo-pet-game-jam-vertical.svg. */}
        <Link href="/" aria-label="PET Game Jam — início" className="absolute left-9 top-[18px]">
          <img src="/marca/logo-pet-game-jam-horizontal.svg" alt="PET Game Jam" className="h-[43px] w-auto" />
        </Link>

        <div className="absolute left-1/2 top-[25px] flex -translate-x-1/2 items-center gap-x-[53px]">
          {visiveis.map((pagina) => {

            const ativa = caminho === pagina.url

            return (
              <Link
                key={pagina.url}
                href={pagina.url}
                aria-current={ativa ? "page" : undefined}
                className="relative text-base font-bold leading-[25px] text-destaque-claro transition-opacity hover:opacity-70"
              >
                {/* No lugar da bolinha do mockup: 26px, um terco para fora da
                    tela e de cabeca para baixo, entao a borda corta a saia e
                    aparece a cabeca, pendurada olhando o link. O Pac-Man fica
                    como esta: de boca para baixo, o corte deixava so as duas
                    pontas da mandibula. */}
                {ativa && (
                  <Personagem
                    qual={pagina.personagem}
                    pendurado
                    className={`absolute left-1/2 top-[-34px] h-[26px] w-[26px] -translate-x-1/2 ${pagina.personagem === "pacman" ? "" : "-scale-y-100"}`}
                  />
                )}
                {pagina.label}
              </Link>
            )
          })}
        </div>

        <Link href="/inscricao" className="absolute right-[17px] top-[13px]">
          <span className="block rounded-full bg-destaque px-[25px] py-[14px] text-center text-base font-bold leading-[25px] text-barra transition-opacity hover:opacity-90">
            Inscreva-se
          </span>
        </Link>
      </div>

      {/* Celular */}
      <div className="md:hidden">
        <div className="flex h-[60px] items-center justify-between gap-3 px-4">
          <Link href="/" aria-label="PET Game Jam — início" onClick={() => setMenuAberto(false)}>
            <img src="/marca/logo-pet-game-jam-horizontal.svg" alt="PET Game Jam" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/inscricao" onClick={() => setMenuAberto(false)}
              className="rounded-full bg-destaque px-4 py-2 text-sm font-bold text-barra transition-opacity hover:opacity-90">
              Inscreva-se
            </Link>
            <button type="button" onClick={() => setMenuAberto((a) => !a)}
              aria-expanded={menuAberto} aria-controls="menu-celular"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              className="flex h-10 w-10 items-center justify-center rounded-md text-destaque-claro hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                {menuAberto
                  ? <path d="M6 6l12 12M18 6L6 18" />
                  : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuAberto && (
          <ul id="menu-celular" className="border-t border-white/10 px-4 pb-4 pt-2">
            {visiveis.map((pagina) => {
              const ativa = caminho === pagina.url
              return (
                <li key={pagina.url}>
                  <Link href={pagina.url} aria-current={ativa ? "page" : undefined} onClick={() => setMenuAberto(false)}
                    className={`flex items-center gap-3 rounded-md px-2 py-3 text-lg font-bold ${ativa ? "text-destaque" : "text-destaque-claro"}`}>
                    {/* A pagina atual leva o personagem dela, como no desktop. */}
                    <span className="flex h-6 w-6 items-center justify-center">
                      {ativa && <Personagem qual={pagina.personagem} className="h-5 w-5" />}
                    </span>
                    {pagina.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </nav>
  )
}
