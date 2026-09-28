// Regras do jogo do Inicio (src/lib/jogo/pacman.ts), sem navegador.
import { test } from "node:test";
import assert from "node:assert/strict";
import { comeca, novoJogo, passo, vira, VIDAS, type Estado } from "../src/lib/jogo/pacman.ts";
import { INICIO, LABIRINTO } from "../src/lib/jogo/labirinto.ts";

// Aleatorio com semente: os fantasmas assustados andam ao acaso, e o teste
// precisa dar o mesmo resultado sempre.
function semente(s: number) {
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const roda = (e: Estado, segundos: number) => {
  for (let t = 0; t < segundos; t += 1 / 60) passo(e, 1 / 60);
};

function jogando(rng = semente(1)) {
  const e = novoJogo(rng);
  comeca(e);
  roda(e, 2.05); // "PRONTO!"
  assert.equal(e.fase, "jogando");
  return e;
}

// A coluna da a volta (tunel da linha do meio).
const andavel = (x: number, y: number) => {
  const L = LABIRINTO[0].length;
  return ".o_".includes(LABIRINTO[Math.round(y)][((Math.round(x) % L) + L) % L]);
};

test("o labirinto e um retangulo: toda linha com a mesma largura", () => {
  const larguras = new Set(LABIRINTO.map((l) => l.length));
  assert.equal(larguras.size, 1, `larguras: ${[...larguras].join(", ")}`);
});

test("comeca parado, esperando a pessoa apertar para jogar", () => {
  const e = novoJogo();
  assert.equal(e.fase, "espera");
  assert.equal(e.vidas, VIDAS);
  const total = LABIRINTO.join("").split("").filter((c) => c === "." || c === "o").length;
  assert.equal(e.restantes, total);
  roda(e, 3);
  assert.equal(e.fase, "espera", "sem apertar, nada anda");
});

test("o Pac-Man anda sozinho para a esquerda e come as bolinhas do caminho", () => {
  const e = jogando();
  roda(e, 0.5);
  assert.ok(e.pacman.x < INICIO.pacman.x);
  assert.ok(e.pontos >= 30);
});

test("a curva pedida acontece no cruzamento, e parede nao deixa passar", () => {
  // Pedida ainda no "PRONTO!", a curva vale ja no primeiro cruzamento.
  const e = novoJogo(semente(1));
  comeca(e);
  vira(e, "cima");
  roda(e, 2.05);
  roda(e, 0.3);
  // Em cima do comeco e parede: vira no primeiro corredor para cima, a esquerda.
  assert.ok(e.pacman.y < INICIO.pacman.y, "subiu pelo primeiro corredor");
  assert.equal(Math.round(e.pacman.x), INICIO.pacman.x - 1);
});

test("em um minuto de teclas ao acaso, ninguem atravessa parede", () => {
  const e = jogando(semente(7));
  const rng = semente(3);
  const dirs = ["cima", "esquerda", "baixo", "direita"] as const;
  for (let i = 0; i < 3600; i++) {
    if (i % 20 === 0) vira(e, dirs[Math.floor(rng() * 4)]);
    passo(e, 1 / 60);
    if (e.fase === "fim") comeca(e);
    assert.ok(andavel(e.pacman.x, e.pacman.y), `Pac-Man na parede em ${e.pacman.x},${e.pacman.y}`);
    for (const f of e.fantasmas) {
      if (f.estado !== "normal") continue;
      assert.ok(andavel(f.x, f.y), `${f.nome} na parede em ${f.x},${f.y}`);
    }
  }
});

test("os fantasmas saem da casa um de cada vez", () => {
  const e = jogando();
  e.pacman.x = 1; e.pacman.y = 9; // longe, para ninguem morrer no meio
  roda(e, 0.5);
  assert.deepEqual(e.fantasmas.map((f) => f.estado === "casa"), [false, true, true, true]);
  roda(e, 9);
  assert.ok(e.fantasmas.every((f) => f.estado !== "casa"), "todos sairam");
});

test("pastilha grande deixa os fantasmas azuis, e comer em sequencia dobra os pontos", () => {
  const e = jogando();
  e.pacman.x = 2; e.pacman.y = 1; e.pacman.dir = "esquerda";
  roda(e, 0.2);
  assert.equal(e.grade[1][1], "_", "comeu a pastilha do canto");
  assert.ok(e.fantasmas.every((f) => f.assustado));
  const antes = e.pontos;
  // Dois fantasmas em cima do Pac-Man.
  for (const f of e.fantasmas.slice(0, 2)) { f.estado = "normal"; f.x = e.pacman.x; f.y = e.pacman.y; }
  passo(e, 1 / 60);
  assert.equal(e.fase, "comendo");
  roda(e, 0.6);
  passo(e, 1 / 60);
  assert.equal(e.pontos - antes, 200 + 400);
  assert.equal(e.fantasmas[0].estado === "olhos" || e.fantasmas[0].estado === "entrando" || e.fantasmas[0].estado === "saindo", true);
});

test("os olhos do fantasma comido voltam para a casa e ele sai de novo", () => {
  const e = jogando();
  // So ele no labirinto, e o Pac-Man parado num canto sem bolinha grande.
  const f = e.fantasmas[0];
  e.fantasmas = [f];
  f.estado = "olhos"; f.x = 1; f.y = 9; f.dir = "cima";
  e.pacman.x = 2; e.pacman.y = 2; e.pacman.dir = "direita";
  roda(e, 8);
  assert.equal(f.estado, "normal");
  assert.equal(f.assustado, false);
});

test("encostar num fantasma tira uma vida e recomeca; sem vidas, fim de jogo", () => {
  const e = jogando();
  for (let vida = VIDAS; vida > 0; vida--) {
    const f = e.fantasmas[0];
    f.x = e.pacman.x; f.y = e.pacman.y;
    passo(e, 1 / 60);
    assert.equal(e.fase, "morrendo");
    roda(e, 2);
    assert.equal(e.vidas, vida - 1);
    if (vida > 1) { assert.equal(e.fase, "pronto"); roda(e, 2.05); }
  }
  assert.equal(e.fase, "fim");
  comeca(e);
  assert.equal(e.fase, "pronto");
  assert.equal(e.vidas, VIDAS, "nova partida");
  assert.equal(e.pontos, 0);
});

test("limpar o labirinto passa de nivel, com as bolinhas de volta", () => {
  const e = jogando();
  for (const linha of e.grade) for (let x = 0; x < linha.length; x++) if (linha[x] === "." || linha[x] === "o") linha[x] = "_";
  e.grade[INICIO.pacman.y][INICIO.pacman.x - 2] = ".";
  e.restantes = 1;
  e.fantasmas.forEach((f) => { f.estado = "casa"; });
  roda(e, 0.3);
  assert.equal(e.fase, "venceu");
  roda(e, 2.5);
  assert.equal(e.nivel, 2);
  assert.ok(e.restantes > 100);
});

// Achados do code review (reproduzidos antes da correcao).
test("comer a ultima bolinha no mesmo quadro de uma colisao ainda passa de nivel", () => {
  for (const assustado of [false, true]) {
    const e = jogando();
    for (const linha of e.grade) for (let x = 0; x < linha.length; x++) if (linha[x] === "." || linha[x] === "o") linha[x] = "_";
    e.grade[9][14] = ".";
    e.restantes = 1;
    e.pacman.x = 14.3; e.pacman.y = 9; e.pacman.dir = "esquerda";
    const f = e.fantasmas[0];
    e.fantasmas = [f];
    // Perto o bastante para encostar no mesmo quadro em que a bolinha some.
    f.estado = "normal"; f.x = 13.6; f.y = 9; f.dir = "direita"; f.assustado = assustado;
    passo(e, 1 / 60);
    assert.equal(e.fase, "venceu", assustado ? "fantasma azul" : "fantasma normal");
    roda(e, 2.5);
    assert.equal(e.nivel, 2);
  }
});

const tiles = () => {
  const lista: { x: number; y: number }[] = [];
  LABIRINTO.forEach((linha, y) => linha.split("").forEach((c, x) => { if (".o".includes(c)) lista.push({ x, y }); }));
  return lista;
};

test("os olhos do fantasma comido chegam em casa saindo de qualquer ponto", () => {
  for (const t of tiles()) {
    const e = jogando();
    const f = e.fantasmas[1];
    e.fantasmas = [f];
    f.estado = "olhos"; f.x = t.x; f.y = t.y; f.dir = "esquerda";
    e.pacman.x = 2; e.pacman.y = 2; e.pacman.dir = "direita"; // parado, sem bolinha grande
    let chegou = false;
    for (let i = 0; i < 60 * 8 && !chegou; i++) { passo(e, 1 / 60); chegou = f.estado !== "olhos"; }
    assert.ok(chegou, `olhos presos saindo de ${t.x},${t.y}`);
  }
});

test("perseguindo, o Blinky alcanca o Pac-Man parado em qualquer ponto", () => {
  for (const t of tiles()) {
    const e = jogando();
    const f = e.fantasmas[0];
    e.fantasmas = [f];
    e.modo = 5; // perseguicao para sempre
    e.pacman.x = t.x; e.pacman.y = t.y; e.pacman.quer = null;
    // Parado de verdade: sem direcao livre na frente dele.
    e.pacman.dir = (["cima", "esquerda", "baixo", "direita"] as const).find((d) => {
      const [dx, dy] = { cima: [0, -1], esquerda: [-1, 0], baixo: [0, 1], direita: [1, 0] }[d];
      return !".o_".includes(LABIRINTO[t.y + dy]?.[t.x + dx] ?? "#");
    }) ?? "cima";
    let pegou = false;
    for (let i = 0; i < 60 * 15 && !pegou; i++) { passo(e, 1 / 60); pegou = e.fase === "morrendo"; }
    assert.ok(pegou, `Blinky nao alcancou o Pac-Man em ${t.x},${t.y}`);
  }
});

test("o tunel da linha do meio leva de um lado ao outro", () => {
  const e = jogando();
  const meio = LABIRINTO.findIndex((l) => l.startsWith("_"));
  const L = LABIRINTO[0].length;
  e.fantasmas = [];
  e.pacman.x = 1; e.pacman.y = meio; e.pacman.dir = "esquerda";
  roda(e, 0.5);
  assert.ok(e.pacman.x > L / 2, `saiu pela esquerda e voltou pela direita (x=${e.pacman.x})`);
  assert.ok(andavel(e.pacman.x, e.pacman.y));
  e.pacman.dir = "direita";
  roda(e, 0.6);
  assert.ok(e.pacman.x < L / 2, `e de volta (x=${e.pacman.x})`);
});
