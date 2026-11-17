"use client"

import { useEffect, useState } from "react"

// Contagem regressiva ate o inicio do evento, na abertura do Inicio: um
// placar de fliperama em digitos de pixel. A conta roda no navegador: a
// pagina vem do cache do servidor e o relogio dela ficaria parado.

// Digitos 5x7, como os de placar de fliperama.
const DIGITOS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
}

// Tamanho pela altura (classe CSS), para acompanhar a tela: 3px por pixel em
// telas estreitas, 4px no celular comum e 7px a partir do tablet.
function NumeroPixel({ valor }: { valor: string }) {
  return (
    <span className="inline-flex h-[21px] gap-[3px] min-[360px]:h-[28px] min-[360px]:gap-[4px] md:h-[49px] md:gap-[7px]" aria-hidden>
      {valor.split("").map((d, i) => (
        <svg key={i} viewBox="0 0 5 7" className="h-full w-auto" shapeRendering="crispEdges">
          {DIGITOS[d].flatMap((linha, y) =>
            linha.split("").map((b, x) => (b === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#FFCF00" /> : null)),
          )}
        </svg>
      ))}
    </span>
  )
}

// Hora do navegador, atualizada a cada segundo. Nula na primeira pintura
// (no servidor e antes de hidratar), para as duas baterem.
function useAgora() {
  const [agora, setAgora] = useState<number | null>(null)
  useEffect(() => {
    const atualiza = () => setAgora(Date.now())
    const primeiro = setTimeout(atualiza, 0)
    const t = setInterval(atualiza, 1000)
    return () => {
      clearTimeout(primeiro)
      clearInterval(t)
    }
  }, [])
  return agora
}

interface Props {
  // Os dias do evento, em ISO: a contagem vai ate o proximo que comeca.
  dias: { numero: number; inicio: string; fim: string }[]
  nome: string // "Game Jam 26"
  aviso: string // "O Game Jam 26 começa na terça, 1 de dezembro, às 14h.", para leitor de tela
}

export default function Contagem({ dias, nome, aviso }: Props) {
  const agora = useAgora()
  const t = (iso: string) => new Date(iso).getTime()

  // Durante um dia, avisa qual; entre um dia e o outro, conta ate o proximo
  // (sem isto, a manha do Dia 2 dizia "esta acontecendo" e mandava gente ao
  // CT horas antes).
  const hoje = agora === null ? undefined : dias.find((d) => agora >= t(d.inicio) && agora < t(d.fim))
  const proximo = agora === null ? dias[0] : dias.find((d) => t(d.inicio) > agora)
  if (hoje) {
    return <p className="text-2xl font-bold text-destaque md:text-3xl">O Dia {hoje.numero} do {nome} está acontecendo!</p>
  }
  if (!proximo) {
    return <p className="text-2xl font-bold text-destaque md:text-3xl">O {nome} terminou. Obrigado a todos que participaram!</p>
  }
  const alvo = t(proximo.inicio)
  const depoisDoPrimeiro = proximo.numero !== dias[0].numero

  const s = agora === null ? null : Math.floor((alvo - agora) / 1000)
  const dois = (n: number) => String(n).padStart(2, "0")
  const casas: [string, string][] = [
    ["dias", s === null ? "--" : String(Math.floor(s / 86400))],
    ["horas", s === null ? "--" : dois(Math.floor(s / 3600) % 24)],
    ["min", s === null ? "--" : dois(Math.floor(s / 60) % 60)],
    ["seg", s === null ? "--" : dois(s % 60)],
  ]

  return (
    <div>
      <p className="sr-only">{depoisDoPrimeiro ? `O Dia ${proximo.numero} do ${nome} começa em breve.` : aviso}</p>
      {depoisDoPrimeiro && (
        <p className="mb-3 text-base font-bold text-destaque md:text-lg">Até o Dia {proximo.numero}</p>
      )}
      {/* No celular os digitos encolhem para as quatro casas caberem numa linha,
          ate em tela de 280px. */}
      <div className="flex justify-center gap-1.5 min-[360px]:gap-2 md:gap-6">
        {casas.map(([rotulo, valor]) => (
          <div key={rotulo} className="flex min-w-[52px] flex-col items-center gap-2 px-1.5 min-[360px]:min-w-[68px] min-[360px]:px-2 md:min-w-[130px] md:gap-3 md:px-6">
            <NumeroPixel valor={valor} />
            <span className="text-xs text-destaque-claro/80 md:text-sm">{rotulo}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
