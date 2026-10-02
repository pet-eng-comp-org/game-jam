// O labirinto do jogo do Inicio: "GAME JAM" escrito com as paredes, nas
// letras da propria logo (o alfabeto em pixel do Figma, 7x7, traco de 2),
// GAME em cima e JAM embaixo. Mais alto que largo, como o do arcade, para ter
// corredores e cruzamentos e caber maior na tela do celular. A casa dos
// fantasmas e o miolo do A do JAM: a barra do meio do A e a porta, e eles
// saem por ela para o vao entre as pernas. A linha do meio e o tunel: sai por
// um lado e entra pelo outro; o meio dela fica sem bolinhas, como o corredor
// do READY! no arcade, porque e ali que aparecem o "PRONTO!" e o "FIM DE JOGO".
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
  "_...........___________..........._",
  "#........##...#####...##...##.....#",
  "#........##..#######..###.###.....#",
  "#........##..##hhh##..#######.....#",
  "#....##..##..##hhh##..##.####.....#",
  "#....##..##..##---##..##...##.....#",
  "#....######..##...##..##...##.....#",
  "#.....#####..##...##..##...##.....#",
  "#o...............................o#",
  "###################################",
];

export const LARGURA = LABIRINTO[0].length;
export const ALTURA = LABIRINTO.length;
// A linha do tunel, entre GAME e JAM.
export const MEIO = LABIRINTO.findIndex((l) => l.startsWith("_"));

// De qual letra e cada tile de parede, para pintar cada uma com a cor dela
// na logo: -1 e a borda; 0 a 3, o G, o A, o M e o E de GAME; 4 a 6, o J, o A
// e o M de JAM; null nao e parede. Cada letra e um pedaco de parede ligado.
export const LETRA: (number | null)[][] = (() => {
  const letra = LABIRINTO.map((l) => [...l].map(() => null as number | null));
  const grupos: { x: number; y: number }[][] = [];
  for (let y = 0; y < ALTURA; y++) {
    for (let x = 0; x < LARGURA; x++) {
      if (LABIRINTO[y][x] !== "#" || letra[y][x] !== null) continue;
      const grupo: { x: number; y: number }[] = [];
      const fila = [{ x, y }];
      letra[y][x] = -2;
      while (fila.length) {
        const p = fila.pop()!;
        grupo.push(p);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = p.x + dx, ny = p.y + dy;
          if (LABIRINTO[ny]?.[nx] === "#" && letra[ny][nx] === null) { letra[ny][nx] = -2; fila.push({ x: nx, y: ny }); }
        }
      }
      grupos.push(grupo);
    }
  }
  // A borda e o que encosta na beira do mapa (o tunel corta ela em duas); as
  // letras, da esquerda para a direita, primeiro as de cima.
  const naBeira = (g: { x: number; y: number }[]) => g.some((p) => p.x === 0 || p.y === 0 || p.x === LARGURA - 1 || p.y === ALTURA - 1);
  const letras = grupos.filter((g) => !naBeira(g));
  const esquerda = (g: { x: number }[]) => Math.min(...g.map((p) => p.x));
  const ordem = [...letras].sort((a, b) => Number(a[0].y > MEIO) - Number(b[0].y > MEIO) || esquerda(a) - esquerda(b));
  for (const g of grupos.filter(naBeira)) for (const p of g) letra[p.y][p.x] = -1;
  ordem.forEach((g, i) => { for (const p of g) letra[p.y][p.x] = i; });
  return letra;
})();

// A porta: o meio da sequencia de "-". A casa ("h") fica de um lado dela, e o
// lado de fora do outro; o motor nao supoe que a porta abra para cima.
const LINHA_DA_PORTA = LABIRINTO.findIndex((l) => l.includes("-"));
const PORTA = Math.floor((LABIRINTO[LINHA_DA_PORTA].indexOf("-") + LABIRINTO[LINHA_DA_PORTA].lastIndexOf("-")) / 2);
const CASA_EM_CIMA = LABIRINTO[LINHA_DA_PORTA - 1][PORTA] === "h";
const DENTRO = CASA_EM_CIMA ? LINHA_DA_PORTA - 1 : LINHA_DA_PORTA + 1;
const FORA = CASA_EM_CIMA ? LINHA_DA_PORTA + 1 : LINHA_DA_PORTA - 1;
// A linha de tras da casa: o miolo do A tem 3 tiles de largura, e tres
// fantasmas lado a lado ficavam amontoados. Pinky na frente da porta, Inky e
// Clyde atras, um de cada lado.
const FUNDO = CASA_EM_CIMA ? DENTRO - 1 : DENTRO + 1;

// Onde cada um comeca, em tiles (coluna, linha): o Pac-Man no meio de baixo;
// o Blinky do lado de fora da porta; os outros dentro da casa.
export const INICIO = {
  pacman: { x: Math.floor(LARGURA / 2), y: ALTURA - 2 },
  porta: { x: PORTA, y: LINHA_DA_PORTA },
  foraDaPorta: { x: PORTA, y: FORA },
  vermelho: { x: PORTA, y: FORA },
  rosa: { x: PORTA, y: DENTRO },
  ciano: { x: PORTA - 1, y: FUNDO },
  laranja: { x: PORTA + 1, y: FUNDO },
};

// Cantos de cada fantasma no modo de dispersao, como no arcade: cada um vai
// para um canto do labirinto.
export const CANTOS = {
  vermelho: { x: LARGURA - 2, y: -2 },
  rosa: { x: 1, y: -2 },
  ciano: { x: LARGURA - 1, y: ALTURA + 1 },
  laranja: { x: 0, y: ALTURA + 1 },
};
