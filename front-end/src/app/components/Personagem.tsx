// Os personagens do Pac-Man que marcam a pagina ativa na barra. Os fantasmas
// sao os do Figma (Tematica > Fantasma *, os mesmos da pagina de inscricao),
// com as cores de la; o Pac-Man segue o mesmo traco em pixels.

export type Personagem = "pacman" | "vermelho" | "rosa" | "ciano" | "laranja" | "assustado" | "olhos";

// Os dois estados do fantasma depois que o Pac-Man come a pastilha grande, na
// grade de 14x14 do arcade: azul e assustado (piscando em branco quando o
// efeito acaba) e, se for comido, so os olhos voltando para casa.
const CORPO = "M5 0h4v1h-4zM3 1h8v1h-8zM2 2h10v1h-10zM1 3h12v3h-12zM0 6h14v6h-14zM0 12h2v1h-2zM3 12h3v1h-3zM8 12h3v1h-3zM12 12h2v1h-2zM0 13h1v1h-1zM4 13h2v1h-2zM8 13h2v1h-2zM13 13h1v1h-1z";
const ROSTO = "M4 5h2v2h-2zM8 5h2v2h-2zM1 9h1v1h-1zM4 9h2v1h-2zM8 9h2v1h-2zM12 9h1v1h-1zM2 10h2v1h-2zM6 10h2v1h-2zM10 10h2v1h-2z";
const OLHO_BRANCO = "M3 3h2v1h-2zM9 3h2v1h-2zM2 4h4v3h-4zM8 4h4v3h-4zM3 7h2v1h-2zM9 7h2v1h-2z";
const PUPILA = "M3 6h2v2h-2zM9 6h2v2h-2z";

const COR_FANTASMA = {
  vermelho: "#FF0100",
  rosa: "#FFA9E0",
  ciano: "#10CEFF",
  laranja: "#FFA900",
};

// pendurado: no desktop o fantasma fica de cabeca para baixo na barra, e as
// pupilas vao para o lado que vira o de baixo.
// mastigando: o Pac-Man abre e fecha a boca (animate-mastiga, em globals.css),
// alternando com o quadro de boca fechada. Sem animacao, fica aberto.
export default function Personagem({ qual, className, pendurado = false, mastigando = false }: { qual: Personagem; className?: string; pendurado?: boolean; mastigando?: boolean }) {
  if (qual === "assustado") {
    return (
      <svg viewBox="0 0 14 14" aria-hidden shapeRendering="crispEdges" className={className}>
        <path fill="#2121FF" d={CORPO} />
        <path fill="#FFB8AE" d={ROSTO} />
        {/* Fase branca: pisca algumas vezes quando a pagina abre e some
            (animate-pisca, em globals.css). Sem animacao, fica so o azul. */}
        <g className="opacity-0 motion-safe:animate-pisca">
          <path fill="#FFFFFF" d={CORPO} />
          <path fill="#FF0000" d={ROSTO} />
        </g>
      </svg>
    );
  }
  if (qual === "olhos") {
    return (
      <svg viewBox="1 2 12 7" aria-hidden shapeRendering="crispEdges" className={className}>
        <path fill="#FFFFFF" d={OLHO_BRANCO} />
        <path fill="#2121FF" d={PUPILA} />
      </svg>
    );
  }
  if (qual === "pacman") {
    return (
      <svg viewBox="0 0 13 13" aria-hidden shapeRendering="crispEdges" className={className}>
        <path fill="#FFCF00" d="M4 0h5v1h-5zM2 1h9v1h-9zM1 2h11v1h-11zM0 3h10v1h-10zM0 4h8v1h-8zM0 5h6v1h-6zM0 6h4v1h-4zM0 7h6v1h-6zM0 8h8v1h-8zM0 9h10v1h-10zM1 10h11v1h-11zM2 11h9v1h-9zM4 12h5v1h-5z" />
        {mastigando && (
          <path className="opacity-0 motion-safe:animate-mastiga" fill="#FFCF00" d="M4 0h5v1h-5zM2 1h9v1h-9zM1 2h11v1h-11zM0 3h13v7h-13zM1 10h11v1h-11zM2 11h9v1h-9zM4 12h5v1h-5z" />
        )}
      </svg>
    );
  }
  return (
    <svg viewBox="20 20 124 123" aria-hidden shapeRendering="crispEdges" className={className}>
      <path fill={COR_FANTASMA[qual]} d="M20 142.5H29V134H38V125H46.5V133.5H55.5V142.5H73V125H90.5V142.5H108V134H117V125H125.5V134H134.5V143H143.5V72.5H135.5H134.5V55V47H126V45V38H117V29H99.5V20H64.5V29H47V38H38V46.5H29.5V73H20.5L20 142.5Z" />
      <path fill="#fff" d="M55 53V44H72.5V45V53H81.5V80.5H72V88.5H55V79.5H46V53H55Z" />
      <path fill="#fff" d="M106 53V44H123.5V45V53H132.5V80.5H123V88.5H106V79.5H97V53H106Z" />
      {/* Pupilas olhando para o lado (celular, ao lado do nome) ou, no desktop,
          para o topo do desenho: la o fantasma fica de cabeca para baixo,
          pendurado da borda, e o topo vira o lado do link. */}
      <path className={pendurado ? "md:hidden" : undefined} fill="#3223FF" d="M117 64h17v17h-17zM65 64h17v17h-17z" />
      {pendurado && <path className="hidden md:inline" fill="#3223FF" d="M55.5 44h17v17h-17zM106.5 44h17v17h-17z" />}
    </svg>
  );
}
