"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// A ordem e os rotulos vem do mockup da Season 4 (Figma, pagina Site).
// "Apoio" virou "Patrocinadores" e Jogos subiu para a segunda posicao.
// O ponto da pagina ativa troca de cor conforme a pagina, e as cores sao as
// dos fantasmas do Pac-Man. Nao e enfeite meu: veio do mockup, uma por frame.
const paginas = [
  { label: 'Início', url: '/', ponto: 'bg-destaque' },
  { label: 'Jogos', url: '/jogos', ponto: 'bg-agua' },
  { label: 'Regras', url: '/regras', ponto: 'bg-perigo' },
  { label: 'Materiais', url: '/materiais', ponto: 'bg-destaque' },
  { label: 'Patrocinadores', url: '/apoio', ponto: 'bg-agua' },
]

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

        <Link href="/" aria-label="PET Game Jam — início" className="md:absolute md:left-9 md:top-[23px]">
          <img src="/marca/logo-game-jam.svg" alt="Game Jam" className="h-8 w-auto" />
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
                {/* O ponto da pagina ativa nasce metade para fora da barra, como
                    no mockup (34px, topo em y=-19) — e o "ponto" que o Pac-Man come. */}
                {ativa && (
                  <span
                    aria-hidden
                    className={`absolute left-1/2 hidden h-[34px] w-[34px] -translate-x-1/2 rounded-full md:block ${pagina.ponto}`}
                    style={{ top: "-44px" }}
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
