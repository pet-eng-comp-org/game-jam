// Os personagens do Pac-Man, com os sprites do arcade original: formas e
// cores lidas pixel a pixel da folha de sprites extraida da ROM (The Spriters
// Resource, "Pac-Man > General Sprites"). Pac-Man em 13x13, fantasmas em
// 14x14, cada pixel do sprite e uma unidade do viewBox.

export type Personagem = "pacman" | "vermelho" | "rosa" | "ciano" | "laranja" | "assustado" | "olhos" | "duzentos";

const COR_FANTASMA = {
  vermelho: "#FF0000",
  rosa: "#FFB7FF",
  ciano: "#00FFFF",
  laranja: "#FFB751",
};
const OLHO = "#DEDEFF";
const PUPILA = "#2121FF";

// Pac-Man virado para a direita: boca aberta, meio aberta e fechada.
const PACMAN_ABERTO = "M4 0h5v1h-5zM2 1h7v1h-7zM1 2h7v1h-7zM1 3h6v1h-6zM0 4h6v1h-6zM0 5h5v1h-5zM0 6h4v1h-4zM0 7h5v1h-5zM0 8h6v1h-6zM1 9h6v1h-6zM1 10h7v1h-7zM2 11h7v1h-7zM4 12h5v1h-5z";
const PACMAN_MEIO = "M4 0h5v1h-5zM2 1h9v1h-9zM1 2h11v2h-11zM0 4h10v1h-10zM0 5h7v1h-7zM0 6h4v1h-4zM0 7h7v1h-7zM0 8h10v1h-10zM1 9h11v2h-11zM2 11h9v1h-9zM4 12h5v1h-5z";
const PACMAN_FECHADO = "M4 0h5v1h-5zM2 1h9v1h-9zM1 2h11v2h-11zM0 4h13v5h-13zM1 9h11v2h-11zM2 11h9v1h-9zM4 12h5v1h-5z";

// Silhueta de todos os fantasmas (a mesma nas quatro cores e no assustado).
const FANTASMA = "M5 0h4v1h-4zM3 1h8v1h-8zM2 2h10v1h-10zM1 3h12v3h-12zM0 6h14v6h-14zM0 12h2v1h-2zM3 12h3v1h-3zM8 12h3v1h-3zM12 12h2v1h-2zM0 13h1v1h-1zM4 13h2v1h-2zM8 13h2v1h-2zM13 13h1v1h-1z";

// Olhos de cada direcao: o branco e a pupila por cima.
const OLHOS = {
  direita: {
    branco: "M4 3h2v1h-2zM10 3h2v1h-2zM3 4h4v1h-4zM9 4h4v1h-4zM3 5h2v2h-2zM9 5h2v2h-2zM4 7h2v1h-2zM10 7h2v1h-2z",
    pupila: "M5 5h2v2h-2zM11 5h2v2h-2z",
  },
  cima: {
    branco: "M2 2h1v1h-1zM5 2h1v1h-1zM8 2h1v1h-1zM11 2h1v1h-1zM2 3h4v2h-4zM8 3h4v2h-4zM3 5h2v1h-2zM9 5h2v1h-2z",
    pupila: "M3 1h2v2h-2zM9 1h2v2h-2z",
  },
};

// Assustado (depois da pastilha grande): rosto em zigue-zague.
const ROSTO_ASSUSTADO = "M4 5h2v2h-2zM8 5h2v2h-2zM2 9h2v1h-2zM6 9h2v1h-2zM10 9h2v1h-2zM1 10h1v1h-1zM4 10h2v1h-2zM8 10h2v1h-2zM12 10h1v1h-1z";

// Os pontos do primeiro fantasma comido, em 15x7.
const DUZENTOS = "M1 0h3v1h-3zM7 0h2v1h-2zM12 0h2v1h-2zM0 1h1v2h-1zM4 1h1v2h-1zM6 1h1v5h-1zM9 1h1v5h-1zM11 1h1v5h-1zM14 1h1v5h-1zM3 3h1v1h-1zM2 4h1v1h-1zM1 5h1v1h-1zM0 6h5v1h-5zM7 6h2v1h-2zM12 6h2v1h-2z";

// pendurado: na barra, no desktop, o fantasma fica de cabeca para baixo (quem
// usa vira o desenho); ai os olhos sao os de olhar para cima, que apos a
// virada olham para o link. No celular, ao lado do nome, olham para o lado.
// mastigando: o Pac-Man abre e fecha a boca (animate-boca-meio e
// animate-boca-fechada, em globals.css). Sem animacao, fica aberto.
export default function Personagem({ qual, className, pendurado = false, mastigando = false }: { qual: Personagem; className?: string; pendurado?: boolean; mastigando?: boolean }) {
  if (qual === "pacman") {
    return (
      <svg viewBox="0 0 13 13" aria-hidden shapeRendering="crispEdges" className={className}>
        <path fill="#FFFF00" d={PACMAN_ABERTO} />
        {mastigando && (
          <>
            <path className="opacity-0 motion-safe:animate-boca-meio" fill="#FFFF00" d={PACMAN_MEIO} />
            <path className="opacity-0 motion-safe:animate-boca-fechada" fill="#FFFF00" d={PACMAN_FECHADO} />
          </>
        )}
      </svg>
    );
  }
  if (qual === "assustado") {
    return (
      <svg viewBox="0 0 14 14" aria-hidden shapeRendering="crispEdges" className={className}>
        <path fill={PUPILA} d={FANTASMA} />
        <path fill="#FFB7AE" d={ROSTO_ASSUSTADO} />
        {/* Fase branca: pisca algumas vezes quando a pagina abre e some
            (animate-pisca, em globals.css). Sem animacao, fica so o azul. */}
        <g className="opacity-0 motion-safe:animate-pisca">
          <path fill={OLHO} d={FANTASMA} />
          <path fill="#FF0000" d={ROSTO_ASSUSTADO} />
        </g>
      </svg>
    );
  }
  if (qual === "olhos") {
    return (
      <svg viewBox="2 2 12 7" aria-hidden shapeRendering="crispEdges" className={className}>
        <path fill={OLHO} d={OLHOS.direita.branco} />
        <path fill={PUPILA} d={OLHOS.direita.pupila} />
      </svg>
    );
  }
  if (qual === "duzentos") {
    return (
      <svg viewBox="0 0 15 7" aria-hidden shapeRendering="crispEdges" className={className}>
        <path fill="#00FFFF" d={DUZENTOS} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 14 14" aria-hidden shapeRendering="crispEdges" className={className}>
      <path fill={COR_FANTASMA[qual]} d={FANTASMA} />
      <g className={pendurado ? "md:hidden" : undefined}>
        <path fill={OLHO} d={OLHOS.direita.branco} />
        <path fill={PUPILA} d={OLHOS.direita.pupila} />
      </g>
      {pendurado && (
        <g className="hidden md:inline">
          <path fill={OLHO} d={OLHOS.cima.branco} />
          <path fill={PUPILA} d={OLHOS.cima.pupila} />
        </g>
      )}
    </svg>
  );
}
