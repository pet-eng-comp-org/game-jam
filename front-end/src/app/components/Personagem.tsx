// Os personagens do Pac-Man que marcam a pagina ativa na barra. Os fantasmas
// sao os do Figma (Tematica > Fantasma *, os mesmos da pagina de inscricao),
// com as cores de la; o Pac-Man segue o mesmo traco em pixels.

export type Personagem = "pacman" | "vermelho" | "rosa" | "ciano" | "laranja";

const COR_FANTASMA = {
  vermelho: "#FF0100",
  rosa: "#FFA9E0",
  ciano: "#10CEFF",
  laranja: "#FFA900",
};

export default function Personagem({ qual, className }: { qual: Personagem; className?: string }) {
  if (qual === "pacman") {
    return (
      <svg viewBox="0 0 13 13" aria-hidden shapeRendering="crispEdges" className={className}>
        <path fill="#FFCF00" d="M4 0h5v1h-5zM2 1h9v1h-9zM1 2h11v1h-11zM0 3h10v1h-10zM0 4h8v1h-8zM0 5h6v1h-6zM0 6h4v1h-4zM0 7h6v1h-6zM0 8h8v1h-8zM0 9h10v1h-10zM1 10h11v1h-11zM2 11h9v1h-9zM4 12h5v1h-5z" />
      </svg>
    );
  }
  return (
    <svg viewBox="20 20 124 123" aria-hidden shapeRendering="crispEdges" className={className}>
      <path fill={COR_FANTASMA[qual]} d="M20 142.5H29V134H38V125H46.5V133.5H55.5V142.5H73V125H90.5V142.5H108V134H117V125H125.5V134H134.5V143H143.5V72.5H135.5H134.5V55V47H126V45V38H117V29H99.5V20H64.5V29H47V38H38V46.5H29.5V73H20.5L20 142.5Z" />
      <path fill="#fff" d="M55 53V44H72.5V45V53H81.5V80.5H72V88.5H55V79.5H46V53H55Z" />
      <path fill="#fff" d="M106 53V44H123.5V45V53H132.5V80.5H123V88.5H106V79.5H97V53H106Z" />
      <path fill="#3223FF" d="M117 64h17v17h-17zM65 64h17v17h-17z" />
    </svg>
  );
}
