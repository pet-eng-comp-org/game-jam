// Sprites que so o jogo do Inicio usa (JogoPet.tsx), separados de sprites.ts
// para nao irem junto com os personagens da barra, que carregam em toda pagina.
// Mesma origem: a folha de sprites do arcade extraida da ROM.

// Morte do Pac-Man: 11 quadros numa caixa de 16x16 (o normal ocupa 1..13 dela),
// com a boca para cima, abrindo ate sumir e terminar num estalo.
export const PACMAN_MORTE = [
  "M1 3h2v1h-2zM12 3h2v1h-2zM1 4h3v1h-3zM11 4h3v1h-3zM1 5h4v1h-4zM10 5h4v1h-4zM1 6h5v1h-5zM9 6h5v1h-5zM1 7h6v1h-6zM8 7h6v1h-6zM2 8h11v1h-11zM2 9h11v1h-11zM3 10h9v1h-9zM5 11h5v1h-5z",
  "M1 4h1v1h-1zM13 4h1v1h-1zM0 5h4v1h-4zM11 5h4v1h-4zM0 6h5v1h-5zM10 6h5v1h-5zM0 7h7v1h-7zM8 7h7v1h-7zM1 8h13v1h-13zM1 9h13v1h-13zM2 10h11v1h-11zM4 11h3v1h-3zM8 11h3v1h-3z",
  "M0 6h3v1h-3zM12 6h3v1h-3zM0 7h6v1h-6zM9 7h6v1h-6zM0 8h15v1h-15zM1 9h13v1h-13zM2 10h11v1h-11zM4 11h3v1h-3zM8 11h3v1h-3z",
  "M0 7h4v1h-4zM11 7h4v1h-4zM0 8h15v1h-15zM0 9h15v1h-15zM1 10h13v1h-13zM3 11h4v1h-4zM8 11h4v1h-4z",
  "M4 8h7v1h-7zM0 9h15v1h-15zM0 10h15v1h-15zM1 11h13v1h-13zM3 12h4v1h-4zM8 12h4v1h-4z",
  "M6 8h3v1h-3zM4 9h7v1h-7zM1 10h13v1h-13zM0 11h15v1h-15zM1 12h6v1h-6zM8 12h6v1h-6zM3 13h3v1h-3zM9 13h3v1h-3z",
  "M7 8h1v1h-1zM6 9h3v1h-3zM4 10h7v1h-7zM3 11h9v1h-9zM1 12h13v1h-13zM1 13h6v1h-6zM8 13h6v1h-6zM2 14h4v1h-4zM9 14h4v1h-4z",
  "M7 8h1v1h-1zM6 9h3v1h-3zM5 10h5v1h-5zM5 11h5v1h-5zM4 12h7v1h-7zM3 13h9v1h-9zM4 14h3v1h-3zM8 14h3v1h-3z",
  "M7 8h1v1h-1zM7 9h1v1h-1zM6 10h3v1h-3zM6 11h3v1h-3zM6 12h3v1h-3zM5 13h5v1h-5zM6 14h1v1h-1zM8 14h1v1h-1z",
  "M7 8h1v1h-1zM7 9h1v1h-1zM7 10h1v1h-1zM7 11h1v1h-1zM7 12h1v1h-1zM7 13h1v1h-1z",
  "M5 6h1v1h-1zM9 6h1v1h-1zM3 7h1v1h-1zM6 7h1v1h-1zM8 7h1v1h-1zM4 8h1v1h-1zM11 8h1v1h-1zM10 9h1v1h-1zM2 10h2v1h-2zM11 11h2v1h-2zM4 12h1v1h-1zM3 13h1v1h-1zM10 13h1v1h-1zM6 14h1v1h-1zM8 14h1v1h-1zM11 14h1v1h-1zM5 15h1v1h-1zM9 15h1v1h-1z"
];

// Segundo quadro da saia: os fantasmas alternam os dois enquanto andam.
export const FANTASMA_B = "M5 0h4v1h-4zM3 1h8v1h-8zM2 2h10v1h-10zM1 3h12v3h-12zM0 6h14v6h-14zM0 12h4v1h-4zM5 12h4v1h-4zM10 12h4v1h-4zM1 13h2v1h-2zM6 13h2v1h-2zM11 13h2v1h-2z";

// Pontos por fantasma comido em sequencia, 7 pixels de altura.
export const PONTOS_FANTASMA: Record<200 | 400 | 800 | 1600, { largura: number; d: string }> = {
  200: { largura: 15, d: "M1 0h3v1h-3zM7 0h2v1h-2zM12 0h2v1h-2zM0 1h1v1h-1zM4 1h1v1h-1zM6 1h1v1h-1zM9 1h1v1h-1zM11 1h1v1h-1zM14 1h1v1h-1zM0 2h1v1h-1zM4 2h1v1h-1zM6 2h1v1h-1zM9 2h1v1h-1zM11 2h1v1h-1zM14 2h1v1h-1zM3 3h1v1h-1zM6 3h1v1h-1zM9 3h1v1h-1zM11 3h1v1h-1zM14 3h1v1h-1zM2 4h1v1h-1zM6 4h1v1h-1zM9 4h1v1h-1zM11 4h1v1h-1zM14 4h1v1h-1zM1 5h1v1h-1zM6 5h1v1h-1zM9 5h1v1h-1zM11 5h1v1h-1zM14 5h1v1h-1zM0 6h5v1h-5zM7 6h2v1h-2zM12 6h2v1h-2z" },
  400: { largura: 15, d: "M3 0h1v1h-1zM7 0h2v1h-2zM12 0h2v1h-2zM2 1h2v1h-2zM6 1h1v1h-1zM9 1h1v1h-1zM11 1h1v1h-1zM14 1h1v1h-1zM1 2h1v1h-1zM3 2h1v1h-1zM6 2h1v1h-1zM9 2h1v1h-1zM11 2h1v1h-1zM14 2h1v1h-1zM0 3h1v1h-1zM3 3h1v1h-1zM6 3h1v1h-1zM9 3h1v1h-1zM11 3h1v1h-1zM14 3h1v1h-1zM0 4h5v1h-5zM6 4h1v1h-1zM9 4h1v1h-1zM11 4h1v1h-1zM14 4h1v1h-1zM3 5h1v1h-1zM6 5h1v1h-1zM9 5h1v1h-1zM11 5h1v1h-1zM14 5h1v1h-1zM3 6h1v1h-1zM7 6h2v1h-2zM12 6h2v1h-2z" },
  800: { largura: 15, d: "M1 0h3v1h-3zM7 0h2v1h-2zM12 0h2v1h-2zM0 1h1v1h-1zM4 1h1v1h-1zM6 1h1v1h-1zM9 1h1v1h-1zM11 1h1v1h-1zM14 1h1v1h-1zM0 2h1v1h-1zM4 2h1v1h-1zM6 2h1v1h-1zM9 2h1v1h-1zM11 2h1v1h-1zM14 2h1v1h-1zM1 3h3v1h-3zM6 3h1v1h-1zM9 3h1v1h-1zM11 3h1v1h-1zM14 3h1v1h-1zM0 4h1v1h-1zM4 4h1v1h-1zM6 4h1v1h-1zM9 4h1v1h-1zM11 4h1v1h-1zM14 4h1v1h-1zM0 5h1v1h-1zM4 5h1v1h-1zM6 5h1v1h-1zM9 5h1v1h-1zM11 5h1v1h-1zM14 5h1v1h-1zM1 6h3v1h-3zM7 6h2v1h-2zM12 6h2v1h-2z" },
  1600: { largura: 16, d: "M0 0h1v1h-1zM3 0h3v1h-3zM8 0h2v1h-2zM13 0h2v1h-2zM0 1h1v1h-1zM2 1h1v1h-1zM7 1h1v1h-1zM10 1h1v1h-1zM12 1h1v1h-1zM15 1h1v1h-1zM0 2h1v1h-1zM2 2h1v1h-1zM7 2h1v1h-1zM10 2h1v1h-1zM12 2h1v1h-1zM15 2h1v1h-1zM0 3h1v1h-1zM2 3h4v1h-4zM7 3h1v1h-1zM10 3h1v1h-1zM12 3h1v1h-1zM15 3h1v1h-1zM0 4h1v1h-1zM2 4h1v1h-1zM5 4h1v1h-1zM7 4h1v1h-1zM10 4h1v1h-1zM12 4h1v1h-1zM15 4h1v1h-1zM0 5h1v1h-1zM2 5h1v1h-1zM5 5h1v1h-1zM7 5h1v1h-1zM10 5h1v1h-1zM12 5h1v1h-1zM15 5h1v1h-1zM0 6h1v1h-1zM3 6h2v1h-2zM8 6h2v1h-2zM13 6h2v1h-2z" },
};

// Pastilha grande, 8x8.
export const PASTILHA = "M2 0h4v1h-4zM1 1h6v1h-6zM0 2h8v4h-8zM1 6h6v1h-6zM2 7h4v1h-4z";
