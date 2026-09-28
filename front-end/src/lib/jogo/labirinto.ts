// O labirinto do jogo do Inicio: "GAME JAM" escrito com as paredes, nas
// letras da propria logo (o alfabeto em pixel do Figma, 7x7, traco de 2),
// GAME em cima e JAM embaixo, com a casa dos fantasmas ao lado do JAM. Mais
// alto que largo, como o do arcade, para ter corredores e cruzamentos e caber
// maior na tela do celular. O bloquinho solto a esquerda do J quebra a sala
// que sobrava ali. A linha do meio e o tunel: sai por um lado e entra pelo
// outro.
//
//   #  parede          .  bolinha        o  pastilha grande
//   x  miolo de letra (fora do jogo)     -  porta da casa
//   h  dentro da casa  (so fantasmas)    _  corredor sem bolinha
export const LABIRINTO = [
  "###################################",
  "#o...............................o#",
  "#..#####...#####..##...##..######.#",
  "#.#######.#######.###.###.#######.#",
  "#.##......##xxx##.#######.##......#",
  "#.##..###.##xxx##.##.####.######..#",
  "#.##...##.#######.##...##.##......#",
  "#.#######.##...##.##...##.#######.#",
  "#..#####..##...##.##...##.#######.#",
  "_................................._",
  "#.....##..#####..##...##.###--###.#",
  "#.###.##.#######.###.###.#hhhhhh#.#",
  "#.....##.##xxx##.#######.#hhhhhh#.#",
  "#.##..##.##xxx##.##.####.#hhhhhh#.#",
  "#.##..##.#######.##...##.#hhhhhh#.#",
  "#.######.##...##.##...##.#hhhhhh#.#",
  "#..#####.##...##.##...##.########.#",
  "#o...............................o#",
  "###################################",
];

export const LARGURA = LABIRINTO[0].length;
export const ALTURA = LABIRINTO.length;

// Onde cada um comeca, em tiles (coluna, linha), a partir do mapa: o Pac-Man
// no meio de baixo; o Blinky do lado de fora, em cima da porta; os outros
// dentro da casa.
const LINHA_DA_PORTA = LABIRINTO.findIndex((l) => l.includes("-"));
const PORTA = LABIRINTO[LINHA_DA_PORTA].indexOf("-");
const MEIO_DA_CASA = LINHA_DA_PORTA + 3;
export const INICIO = {
  pacman: { x: Math.floor(LARGURA / 2), y: ALTURA - 2 },
  porta: { x: PORTA, y: LINHA_DA_PORTA },
  acimaDaPorta: { x: PORTA, y: LINHA_DA_PORTA - 1 },
  vermelho: { x: PORTA, y: LINHA_DA_PORTA - 1 },
  rosa: { x: PORTA, y: MEIO_DA_CASA },
  ciano: { x: PORTA - 2, y: MEIO_DA_CASA },
  laranja: { x: PORTA + 2, y: MEIO_DA_CASA },
};

// Cantos de cada fantasma no modo de dispersao, como no arcade: cada um vai
// para um canto do labirinto.
export const CANTOS = {
  vermelho: { x: LARGURA - 2, y: -2 },
  rosa: { x: 1, y: -2 },
  ciano: { x: LARGURA - 1, y: ALTURA + 1 },
  laranja: { x: 0, y: ALTURA + 1 },
};
