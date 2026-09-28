// Sprites do Pac-Man de arcade original, lidos pixel a pixel da folha extraida
// da ROM (The Spriters Resource, "Pac-Man > General Sprites"). Cada caminho e
// uma lista de retangulos de 1 pixel do sprite ("Mx yhLv1h-Lz"), para desenhar
// em SVG (viewBox em pixels do sprite) ou no canvas (com Path2D e escala).

export const CORES = {
  pacman: "#FFFF00",
  vermelho: "#FF0000",
  rosa: "#FFB7FF",
  ciano: "#00FFFF",
  laranja: "#FFB751",
  olho: "#DEDEFF",
  pupila: "#2121FF",
  parede: "#2121FF",
  bolinha: "#FFB7AE",
  porta: "#FFB7FF",
  assustadoRosto: "#FFB7AE",
  pontos: "#00FFFF",
} as const;

// Pac-Man virado para a direita, 13x13: boca aberta, meio aberta e fechada.
export const PACMAN_ABERTO = "M4 0h5v1h-5zM2 1h7v1h-7zM1 2h7v1h-7zM1 3h6v1h-6zM0 4h6v1h-6zM0 5h5v1h-5zM0 6h4v1h-4zM0 7h5v1h-5zM0 8h6v1h-6zM1 9h6v1h-6zM1 10h7v1h-7zM2 11h7v1h-7zM4 12h5v1h-5z";
export const PACMAN_MEIO = "M4 0h5v1h-5zM2 1h9v1h-9zM1 2h11v2h-11zM0 4h10v1h-10zM0 5h7v1h-7zM0 6h4v1h-4zM0 7h7v1h-7zM0 8h10v1h-10zM1 9h11v2h-11zM2 11h9v1h-9zM4 12h5v1h-5z";
export const PACMAN_FECHADO = "M4 0h5v1h-5zM2 1h9v1h-9zM1 2h11v2h-11zM0 4h13v5h-13zM1 9h11v2h-11zM2 11h9v1h-9zM4 12h5v1h-5z";

// Silhueta de todos os fantasmas, 14x14 (a mesma nas quatro cores e no assustado).
export const FANTASMA = "M5 0h4v1h-4zM3 1h8v1h-8zM2 2h10v1h-10zM1 3h12v3h-12zM0 6h14v6h-14zM0 12h2v1h-2zM3 12h3v1h-3zM8 12h3v1h-3zM12 12h2v1h-2zM0 13h1v1h-1zM4 13h2v1h-2zM8 13h2v1h-2zM13 13h1v1h-1z";

// Olhos de cada direcao: o branco e a pupila por cima.
export const OLHOS = {
  direita: {
    branco: "M4 3h2v1h-2zM10 3h2v1h-2zM3 4h4v1h-4zM9 4h4v1h-4zM3 5h2v2h-2zM9 5h2v2h-2zM4 7h2v1h-2zM10 7h2v1h-2z",
    pupila: "M5 5h2v2h-2zM11 5h2v2h-2z",
  },
  esquerda: {
    branco: "M2 3h2v1h-2zM8 3h2v1h-2zM1 4h4v1h-4zM7 4h4v1h-4zM3 5h2v2h-2zM9 5h2v2h-2zM2 7h2v1h-2zM8 7h2v1h-2z",
    pupila: "M1 5h2v2h-2zM7 5h2v2h-2z",
  },
  cima: {
    branco: "M2 2h1v1h-1zM5 2h1v1h-1zM8 2h1v1h-1zM11 2h1v1h-1zM2 3h4v2h-4zM8 3h4v2h-4zM3 5h2v1h-2zM9 5h2v1h-2z",
    pupila: "M3 1h2v2h-2zM9 1h2v2h-2z",
  },
  baixo: {
    branco: "M3 4h2v1h-2zM9 4h2v1h-2zM2 5h4v2h-4zM8 5h4v2h-4zM2 7h1v1h-1zM5 7h1v1h-1zM8 7h1v1h-1zM11 7h1v1h-1z",
    pupila: "M3 7h2v2h-2zM9 7h2v2h-2z",
  },
};

// Assustado (depois da pastilha grande): rosto em zigue-zague.
export const ROSTO_ASSUSTADO = "M4 5h2v2h-2zM8 5h2v2h-2zM2 9h2v1h-2zM6 9h2v1h-2zM10 9h2v1h-2zM1 10h1v1h-1zM4 10h2v1h-2zM8 10h2v1h-2zM12 10h1v1h-1z";


// Os pontos do primeiro fantasma comido (15x7), usados fora do jogo tambem.
export const DUZENTOS_PATH = "M1 0h3v1h-3zM7 0h2v1h-2zM12 0h2v1h-2zM0 1h1v1h-1zM4 1h1v1h-1zM6 1h1v1h-1zM9 1h1v1h-1zM11 1h1v1h-1zM14 1h1v1h-1zM0 2h1v1h-1zM4 2h1v1h-1zM6 2h1v1h-1zM9 2h1v1h-1zM11 2h1v1h-1zM14 2h1v1h-1zM3 3h1v1h-1zM6 3h1v1h-1zM9 3h1v1h-1zM11 3h1v1h-1zM14 3h1v1h-1zM2 4h1v1h-1zM6 4h1v1h-1zM9 4h1v1h-1zM11 4h1v1h-1zM14 4h1v1h-1zM1 5h1v1h-1zM6 5h1v1h-1zM9 5h1v1h-1zM11 5h1v1h-1zM14 5h1v1h-1zM0 6h5v1h-5zM7 6h2v1h-2zM12 6h2v1h-2z";
