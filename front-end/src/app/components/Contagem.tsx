"use client"

import { useEffect, useState } from "react"

// Contagem regressiva ate o inicio da competicao, na abertura do Inicio: um
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

function NumeroPixel({ valor, px }: { valor: string; px: number }) {
  return (
    <span className="inline-flex" style={{ gap: px }} aria-hidden>
      {valor.split("").map((d, i) => (
        <svg key={i} width={5 * px} height={7 * px} viewBox="0 0 5 7" shapeRendering="crispEdges">
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
  inicio: string // ISO do inicio da competicao
  rotuloData: string // "sábado, 28 de novembro, às 12:00", ja formatado no servidor
}

export default function Contagem({ inicio, rotuloData }: Props) {
  const agora = useAgora()
  const alvo = new Date(inicio).getTime()

  if (agora !== null && agora >= alvo) {
    return <p className="text-2xl font-bold text-destaque md:text-3xl">A competição está acontecendo!</p>
  }

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
      <p className="sr-only">A competição começa em {rotuloData}.</p>
      {/* No celular os digitos encolhem para as quatro casas caberem numa linha. */}
      <div className="flex justify-center gap-2 md:gap-6">
        {casas.map(([rotulo, valor]) => (
          <div key={rotulo} className="flex min-w-[68px] flex-col items-center gap-2 rounded-lg border-2 border-destaque/60 bg-barra px-2 py-3 md:min-w-[130px] md:gap-3 md:rounded-xl md:px-6 md:py-4">
            <span className="md:hidden"><NumeroPixel valor={valor} px={4} /></span>
            <span className="hidden md:inline"><NumeroPixel valor={valor} px={7} /></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-destaque-claro/80 md:text-xs">{rotulo}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
