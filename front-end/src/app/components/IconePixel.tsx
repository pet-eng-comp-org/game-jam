// Icones pequenos em pixel, no traco dos digitos do placar e dos fantasmas.
const DESENHOS = {
  calendario: [
    ".X....X.",
    "XXXXXXXX",
    "XXXXXXXX",
    "X......X",
    "X.X.X..X",
    "X......X",
    "X.X.X..X",
    "XXXXXXXX",
  ],
  local: [
    "..XXX..",
    ".XXXXX.",
    "XX...XX",
    "XX...XX",
    ".XXXXX.",
    ".XXXXX.",
    "..XXX..",
    "..XXX..",
    "...X...",
  ],
}

export default function IconePixel({ qual, className }: { qual: keyof typeof DESENHOS; className?: string }) {
  const linhas = DESENHOS[qual]
  return (
    <svg viewBox={`0 0 ${linhas[0].length} ${linhas.length}`} className={className} aria-hidden shapeRendering="crispEdges" fill="currentColor">
      {linhas.flatMap((l, y) => l.split("").map((c, x) => (c === "X" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null)))}
    </svg>
  )
}
