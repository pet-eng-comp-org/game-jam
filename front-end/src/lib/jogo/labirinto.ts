// O labirinto do jogo do Inicio: "PET" escrito com as paredes, como o Google
// fez com o proprio nome no Doodle dos 30 anos do Pac-Man, e a casa dos
// fantasmas a direita. Letras com traco de 2 tiles, para o contorno duplo das
// paredes ler como letra.
//
//   #  parede          .  bolinha        o  pastilha grande
//   x  buraco da letra (fora do jogo)    -  porta da casa
//   h  dentro da casa  (so fantasmas)    _  corredor sem bolinha
export const LABIRINTO = [
  "################################",
  "#o............................o#",
  "#.######.#####.######.###--###.#",
  "#.##xx##.#####.######.#hhhhhh#.#",
  "#.##xx##.##......##...#hhhhhh#.#",
  "#.######.####....##...#hhhhhh#.#",
  "#.##.....##......##...#hhhhhh#.#",
  "#.##.....#####...##...#hhhhhh#.#",
  "#.##.....#####...##...########.#",
  "#o............................o#",
  "################################",
];

export const LARGURA = LABIRINTO[0].length;
export const ALTURA = LABIRINTO.length;

// Onde cada um comeca, em tiles (coluna, linha). O Pac-Man no meio de baixo;
// o Blinky do lado de fora, em cima da porta; os outros dentro da casa.
const PORTA = LABIRINTO[2].indexOf("-");
export const INICIO = {
  pacman: { x: 15, y: 9 },
  porta: { x: PORTA, y: 2 },
  acimaDaPorta: { x: PORTA, y: 1 },
  vermelho: { x: PORTA, y: 1 },
  rosa: { x: PORTA, y: 5 },
  ciano: { x: PORTA - 2, y: 5 },
  laranja: { x: PORTA + 2, y: 5 },
};

// Cantos de cada fantasma no modo de dispersao, como no arcade: cada um vai
// para um canto do labirinto.
export const CANTOS = {
  vermelho: { x: LARGURA - 2, y: -2 },
  rosa: { x: 1, y: -2 },
  ciano: { x: LARGURA - 1, y: ALTURA + 1 },
  laranja: { x: 0, y: ALTURA + 1 },
};
