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

  return (
    <nav className="w-full bg-barra">
      <div className="mx-auto flex h-auto md:h-[79px] max-w-[1440px] flex-col items-center gap-4 px-9 py-4 md:flex-row md:justify-between md:gap-0 md:py-0">

        <Link href="/" aria-label="PET Game Jam — início">
          <img src="/marca/logo-game-jam.svg" alt="Game Jam" className="h-8 w-auto" />
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {paginas.map((pagina) => {

            const ativa = caminho === pagina.url

            return (
              <Link
                key={pagina.url}
                href={pagina.url}
                aria-current={ativa ? "page" : undefined}
                className="relative py-2 text-base font-bold text-destaque-claro transition-opacity hover:opacity-70"
              >
                {/* O ponto amarelo da pagina ativa nasce metade para fora da
                    barra, como no mockup — e o "ponto" que o Pac-Man come. */}
                {ativa && (
                  <span
                    aria-hidden
                    className={`absolute left-1/2 hidden h-[34px] w-[34px] -translate-x-1/2 rounded-full md:block ${pagina.ponto}`}
                    style={{ top: "-36px" }}
                  />
                )}
                {pagina.label}
              </Link>
            )
          })}
        </div>

        {/* Sem botao de login: so a organizacao entra no painel, pelo endereco
            /login. Para o visitante, o botao so confundia com a inscricao. */}
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:gap-4">
          <Link href="/inscricao" className="w-full md:w-auto">
            <button className="w-full rounded-full bg-destaque px-6 py-3 text-base font-bold text-barra transition-opacity hover:opacity-90 md:w-auto">
              Inscreva-se
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
