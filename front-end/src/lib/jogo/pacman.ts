// Motor do jogo do Inicio, sem nada de tela: o componente (JogoPet.tsx) chama
// passo() a cada quadro e desenha o estado. Fica separado para ser testado
// com node:test (test/jogo.test.ts).
//
// As regras seguem o Pac-Man de arcade, simplificadas onde nao muda a
// sensacao do jogo:
// - tudo anda numa grade; o Pac-Man guarda a proxima curva ate poder virar;
// - fantasmas decidem nos cruzamentos, pela menor distancia ate o alvo, e nao
//   dao meia-volta (so em beco, ou quando o modo troca);
// - modos de dispersao e perseguicao se alternam (7 s e 20 s);
// - cada fantasma persegue de um jeito: Blinky vai no Pac-Man, Pinky mira 4
//   casas a frente dele, Inky usa o Blinky de referencia, Clyde persegue de
//   longe e foge de perto;
// - pastilha grande: fantasmas azuis por alguns segundos; comidos em
//   sequencia valem 200, 400, 800 e 1600, e voltam para a casa so os olhos.
import { ALTURA, CANTOS, INICIO, LABIRINTO, LARGURA } from "./labirinto.ts";

export type Direcao = "cima" | "esquerda" | "baixo" | "direita";
export type NomeFantasma = "vermelho" | "rosa" | "ciano" | "laranja";
export type Fase = "espera" | "pronto" | "jogando" | "comendo" | "morrendo" | "venceu" | "fim";

const VETOR: Record<Direcao, [number, number]> = { cima: [0, -1], esquerda: [-1, 0], baixo: [0, 1], direita: [1, 0] };
const OPOSTA: Record<Direcao, Direcao> = { cima: "baixo", baixo: "cima", esquerda: "direita", direita: "esquerda" };
// Ordem de desempate do arcade: cima, esquerda, baixo, direita.
const ORDEM: Direcao[] = ["cima", "esquerda", "baixo", "direita"];

// Velocidades em tiles por segundo.
const VEL = { pacman: 7, fantasma: 6.4, assustado: 4, olhos: 14, casa: 3.5 };
// Modos: dispersao, perseguicao, dispersao... o ultimo dura para sempre.
const MODOS: { modo: "dispersao" | "perseguicao"; dura: number }[] = [
  { modo: "dispersao", dura: 7 }, { modo: "perseguicao", dura: 20 },
  { modo: "dispersao", dura: 7 }, { modo: "perseguicao", dura: 20 },
  { modo: "dispersao", dura: 5 }, { modo: "perseguicao", dura: Infinity },
];
// Quando cada um sai da casa, em segundos de jogo.
const SOLTURA: Record<NomeFantasma, number> = { vermelho: 0, rosa: 1, ciano: 4, laranja: 7 };
const PAUSA = { pronto: 2, comendo: 0.5, morrendo: 1.8, venceu: 2.2 };
export const VIDAS = 3;

export interface Pacman { x: number; y: number; dir: Direcao; quer: Direcao | null; parado: boolean; andou: number }
export interface Fantasma {
  nome: NomeFantasma;
  x: number; y: number;
  dir: Direcao;
  estado: "casa" | "saindo" | "normal" | "olhos" | "entrando";
  assustado: boolean;
}
export interface Placar { x: number; y: number; valor: 200 | 400 | 800 | 1600; ate: number }
export interface Estado {
  grade: string[][];
  restantes: number;
  pontos: number;
  vidas: number;
  nivel: number;
  fase: Fase;
  tempoFase: number;   // segundos desde que a fase comecou
  tempo: number;       // segundos de relogio (animacoes)
  jogo: number;        // segundos jogando nesta vida (soltura dos fantasmas)
  modo: number;        // indice em MODOS
  tempoModo: number;
  assustadoAte: number; // em "jogo"; 0 = nao
  combo: 200 | 400 | 800 | 1600;
  pacman: Pacman;
  fantasmas: Fantasma[];
  placares: Placar[];
  rng: () => number;
}

// Coluna com volta: o tunel da linha do meio sai por um lado e entra pelo
// outro, como no arcade.
const volta = (x: number) => ((x % LARGURA) + LARGURA) % LARGURA;
// Passou de meio tile para fora da borda: reaparece do outro lado.
const atravessa = (x: number) => (x < -0.5 ? x + LARGURA : x > LARGURA - 0.5 ? x - LARGURA : x);

const pode = (e: Estado, x: number, y: number, quem: "pacman" | "fantasma" | "olhos") => {
  if (y < 0 || y >= ALTURA) return false;
  x = volta(x);
  const c = e.grade[y][x];
  if (c === "." || c === "o" || c === "_") return true;
  // Os olhos passam pela porta para voltar a casa; ninguem mais passa.
  return quem === "olhos" && c === "-";
};

function contaBolinhas(grade: string[][]) {
  return grade.reduce((n, linha) => n + linha.filter((c) => c === "." || c === "o").length, 0);
}

function posicoesIniciais(e: Estado) {
  e.pacman = { ...INICIO.pacman, dir: "esquerda", quer: null, parado: false, andou: 0 };
  e.fantasmas = (["vermelho", "rosa", "ciano", "laranja"] as const).map((nome) => ({
    nome,
    ...INICIO[nome],
    dir: nome === "vermelho" ? "esquerda" : "cima",
    estado: nome === "vermelho" ? "normal" : "casa",
    assustado: false,
  }));
  e.jogo = 0;
  e.modo = 0;
  e.tempoModo = 0;
  e.assustadoAte = 0;
  e.placares = [];
}

export function novoJogo(rng: () => number = Math.random): Estado {
  const grade = LABIRINTO.map((l) => l.split(""));
  const e = {
    grade, restantes: contaBolinhas(grade), pontos: 0, vidas: VIDAS, nivel: 1,
    fase: "espera", tempoFase: 0, tempo: 0, combo: 200, rng,
  } as Estado;
  posicoesIniciais(e);
  return e;
}

// Comeca (ou recomeca, depois do fim) a partida.
export function comeca(e: Estado) {
  if (e.fase === "fim") Object.assign(e, novoJogo(e.rng));
  if (e.fase === "espera" || e.fase === "fim") muda(e, "pronto");
}

export function vira(e: Estado, dir: Direcao) {
  e.pacman.quer = dir;
}

function muda(e: Estado, fase: Fase) {
  e.fase = fase;
  e.tempoFase = 0;
}

export function passo(e: Estado, dt: number) {
  dt = Math.min(dt, 0.05); // aba em segundo plano nao vira um salto
  e.tempo += dt;
  e.tempoFase += dt;
  switch (e.fase) {
    case "espera":
    case "fim":
      return;
    case "pronto":
      if (e.tempoFase >= PAUSA.pronto) muda(e, "jogando");
      return;
    case "comendo":
      if (e.tempoFase >= PAUSA.comendo) muda(e, "jogando");
      // So os olhos continuam andando, como no arcade.
      for (const f of e.fantasmas) if (f.estado === "olhos" || f.estado === "entrando") andaFantasma(e, f, dt);
      return;
    case "morrendo":
      if (e.tempoFase >= PAUSA.morrendo) {
        e.vidas -= 1;
        if (e.vidas <= 0) muda(e, "fim");
        else { posicoesIniciais(e); muda(e, "pronto"); }
      }
      return;
    case "venceu":
      if (e.tempoFase >= PAUSA.venceu) {
        e.nivel += 1;
        e.grade = LABIRINTO.map((l) => l.split(""));
        e.restantes = contaBolinhas(e.grade);
        posicoesIniciais(e);
        muda(e, "pronto");
      }
      return;
  }

  e.jogo += dt;
  e.placares = e.placares.filter((p) => p.ate > e.tempo);

  // Troca de modo (parada enquanto os fantasmas estao azuis).
  if (!e.assustadoAte) {
    e.tempoModo += dt;
    if (e.tempoModo >= MODOS[e.modo].dura && e.modo < MODOS.length - 1) {
      e.modo += 1;
      e.tempoModo = 0;
      for (const f of e.fantasmas) if (f.estado === "normal") f.dir = OPOSTA[f.dir];
    }
  } else if (e.jogo >= e.assustadoAte) {
    e.assustadoAte = 0;
    for (const f of e.fantasmas) f.assustado = false;
  }

  andaPacman(e, dt);
  // Comeu a ultima bolinha: o quadro para aqui. Antes os fantasmas ainda
  // andavam e uma colisao no mesmo quadro trocava "venceu" por "morrendo",
  // e o nivel ficava vazio para sempre.
  if (e.fase !== "jogando") return;
  for (const f of e.fantasmas) andaFantasma(e, f, dt);
  colisoes(e);
}

// Quanto tempo de azul, por nivel: 6 s no primeiro, um a menos por nivel, no
// minimo 2.
export const duracaoAssustado = (nivel: number) => Math.max(2, 7 - nivel);
// Um pouco mais rapido a cada nivel.
const ritmo = (e: Estado) => 1 + Math.min(0.25, (e.nivel - 1) * 0.05);

function andaPacman(e: Estado, dt: number) {
  const p = e.pacman;
  let resta = VEL.pacman * ritmo(e) * dt;
  // Meia-volta pode a qualquer momento.
  if (p.quer && p.quer === OPOSTA[p.dir]) p.dir = p.quer;
  while (resta > 1e-9) {
    const cx = Math.round(p.x), cy = Math.round(p.y);
    const noCentro = Math.abs(p.x - cx) < 1e-6 && Math.abs(p.y - cy) < 1e-6;
    if (noCentro) {
      p.x = cx; p.y = cy;
      come(e, cx, cy);
      if (p.quer && pode(e, cx + VETOR[p.quer][0], cy + VETOR[p.quer][1], "pacman")) p.dir = p.quer;
      if (!pode(e, cx + VETOR[p.dir][0], cy + VETOR[p.dir][1], "pacman")) { p.parado = true; return; }
    }
    p.parado = false;
    const falta = distanciaAteCentro(p.x, p.y, p.dir);
    const d = Math.min(resta, falta);
    p.x += VETOR[p.dir][0] * d;
    p.y += VETOR[p.dir][1] * d;
    p.andou += d;
    resta -= d;
    if (d === falta) { p.x = Math.round(p.x); p.y = Math.round(p.y); }
    p.x = atravessa(p.x);
  }
  come(e, Math.round(p.x), Math.round(p.y));
}

// Distancia ate o proximo centro de tile na direcao (1 se ja esta num).
function distanciaAteCentro(x: number, y: number, dir: Direcao) {
  const [dx, dy] = VETOR[dir];
  const atual = dx !== 0 ? x : y;
  const sentido = dx !== 0 ? dx : dy;
  const alvo = sentido > 0 ? Math.floor(atual + 1e-9) + 1 : Math.ceil(atual - 1e-9) - 1;
  return Math.abs(alvo - atual);
}

function come(e: Estado, x: number, y: number) {
  x = volta(x);
  const c = e.grade[y]?.[x];
  if (c !== "." && c !== "o") return;
  e.grade[y][x] = "_";
  e.restantes -= 1;
  if (c === ".") e.pontos += 10;
  else {
    e.pontos += 50;
    e.assustadoAte = e.jogo + duracaoAssustado(e.nivel);
    e.combo = 200;
    for (const f of e.fantasmas) {
      if (f.estado === "olhos" || f.estado === "entrando") continue;
      if (f.estado === "normal" && !f.assustado) f.dir = OPOSTA[f.dir];
      f.assustado = true;
    }
  }
  if (e.restantes === 0) muda(e, "venceu");
}

function alvo(e: Estado, f: Fantasma): { x: number; y: number } {
  if (f.estado === "olhos") return INICIO.acimaDaPorta;
  if (MODOS[e.modo].modo === "dispersao") return CANTOS[f.nome];
  const p = { x: Math.round(e.pacman.x), y: Math.round(e.pacman.y) };
  const [dx, dy] = VETOR[e.pacman.dir];
  switch (f.nome) {
    case "vermelho":
      return p;
    case "rosa":
      return { x: p.x + 4 * dx, y: p.y + 4 * dy };
    case "ciano": {
      const v = e.fantasmas[0];
      const meio = { x: p.x + 2 * dx, y: p.y + 2 * dy };
      return { x: 2 * meio.x - Math.round(v.x), y: 2 * meio.y - Math.round(v.y) };
    }
    case "laranja":
      return (f.x - p.x) ** 2 + (f.y - p.y) ** 2 > 64 ? p : CANTOS.laranja;
  }
}

function velocidade(e: Estado, f: Fantasma) {
  if (f.estado === "olhos" || f.estado === "entrando") return VEL.olhos;
  if (f.estado === "casa" || f.estado === "saindo") return VEL.casa;
  return (f.assustado ? VEL.assustado : VEL.fantasma) * ritmo(e);
}

function andaFantasma(e: Estado, f: Fantasma, dt: number) {
  let resta = velocidade(e, f) * dt;

  if (f.estado === "casa") {
    if (e.jogo >= SOLTURA[f.nome]) f.estado = "saindo";
    else return;
  }
  // Sair da casa: ate a coluna da porta, e subir ate em cima dela.
  if (f.estado === "saindo") {
    const alvoX = INICIO.porta.x;
    if (Math.abs(f.x - alvoX) > 1e-6) {
      const d = Math.min(resta, Math.abs(alvoX - f.x));
      f.dir = alvoX > f.x ? "direita" : "esquerda";
      f.x += Math.sign(alvoX - f.x) * d;
      resta -= d;
    }
    if (resta > 0 && Math.abs(f.x - alvoX) < 1e-6) {
      f.dir = "cima";
      const d = Math.min(resta, f.y - INICIO.acimaDaPorta.y);
      f.y -= d;
      resta -= d;
      if (f.y - INICIO.acimaDaPorta.y < 1e-6) {
        f.y = INICIO.acimaDaPorta.y;
        f.estado = "normal";
        f.dir = "esquerda";
      }
    }
    if (f.estado !== "normal") return;
  }
  // Olhos entrando: descem pela porta ate o meio da casa e saem de novo.
  if (f.estado === "entrando") {
    f.dir = "baixo";
    const fundo = INICIO.rosa.y;
    const d = Math.min(resta, fundo - f.y);
    f.y += d;
    if (fundo - f.y < 1e-6) { f.y = fundo; f.estado = "saindo"; f.assustado = false; }
    return;
  }

  const quem = f.estado === "olhos" ? "olhos" : "fantasma";
  while (resta > 1e-9) {
    const cx = Math.round(f.x), cy = Math.round(f.y);
    if (Math.abs(f.x - cx) < 1e-6 && Math.abs(f.y - cy) < 1e-6) {
      f.x = cx; f.y = cy;
      if (f.estado === "olhos" && cx === INICIO.acimaDaPorta.x && cy === INICIO.acimaDaPorta.y) {
        f.estado = "entrando";
        return;
      }
      f.dir = escolhe(e, f, cx, cy, quem);
    }
    const falta = distanciaAteCentro(f.x, f.y, f.dir);
    const d = Math.min(resta, falta);
    f.x += VETOR[f.dir][0] * d;
    f.y += VETOR[f.dir][1] * d;
    resta -= d;
    if (d === falta) { f.x = Math.round(f.x); f.y = Math.round(f.y); }
    f.x = atravessa(f.x);
  }
}

// Nos cruzamentos: nunca meia-volta, a nao ser que seja a unica saida.
function escolhe(e: Estado, f: Fantasma, cx: number, cy: number, quem: "fantasma" | "olhos"): Direcao {
  const olhos = f.estado === "olhos";
  // Os olhos passam pela porta; os outros, nao (a porta e so de entrada). Os
  // olhos tambem podem dar meia-volta: o que importa e chegar em casa.
  const abertas = ORDEM.filter((d) => (olhos || d !== OPOSTA[f.dir]) && pode(e, cx + VETOR[d][0], cy + VETOR[d][1], quem));
  if (abertas.length === 0) return OPOSTA[f.dir];
  if (f.assustado && f.estado === "normal") return abertas[Math.floor(e.rng() * abertas.length)];
  const t = alvo(e, f);

  // Distancia ate o alvo. Na dispersao, em linha reta, como no arcade (dar
  // voltas no canto e o comportamento original). Perseguindo e voltando para
  // casa, pelos corredores: com linha reta, os espacos abertos de 2x2 do
  // labirinto prendiam fantasma e olhos girando em circulo.
  const pelosCorredores = olhos || MODOS[e.modo].modo === "perseguicao";
  const mapa = pelosCorredores ? distancias(e, t, quem) : null;
  let melhor = abertas[0], menor = Infinity;
  for (const d of abertas) {
    const nx = cx + VETOR[d][0], ny = cy + VETOR[d][1];
    const dist = mapa ? mapa[ny * LARGURA + volta(nx)] : (nx - t.x) ** 2 + (ny - t.y) ** 2;
    if (dist < menor) { menor = dist; melhor = d; }
  }
  return melhor;
}

// Distancia pelos corredores de cada tile ate o alvo (busca em largura a
// partir do tile andavel mais perto dele: o alvo do Pinky, 4 casas a frente,
// pode cair numa parede ou fora do labirinto). Tile inalcancavel: Infinity.
function distancias(e: Estado, alvo: { x: number; y: number }, quem: "fantasma" | "olhos") {
  const d = new Float64Array(LARGURA * ALTURA).fill(Infinity);
  let origem = -1, perto = Infinity;
  for (let y = 0; y < ALTURA; y++) {
    for (let x = 0; x < LARGURA; x++) {
      if (!pode(e, x, y, quem)) continue;
      const q = (x - alvo.x) ** 2 + (y - alvo.y) ** 2;
      if (q < perto) { perto = q; origem = y * LARGURA + x; }
    }
  }
  if (origem < 0) return d;
  const fila = [origem];
  d[origem] = 0;
  for (let i = 0; i < fila.length; i++) {
    const atual = fila[i], x = atual % LARGURA, y = (atual - x) / LARGURA;
    for (const [dx, dy] of Object.values(VETOR)) {
      const nx = volta(x + dx), ny = y + dy, n = ny * LARGURA + nx;
      if (pode(e, nx, ny, quem) && d[n] === Infinity) { d[n] = d[atual] + 1; fila.push(n); }
    }
  }
  return d;
}

function colisoes(e: Estado) {
  if (e.fase !== "jogando") return;
  const p = e.pacman;
  for (const f of e.fantasmas) {
    if (f.estado !== "normal") continue;
    if (Math.abs(f.x - p.x) + Math.abs(f.y - p.y) > 0.8) continue;
    if (f.assustado) {
      f.estado = "olhos";
      f.assustado = false;
      e.pontos += e.combo;
      e.placares.push({ x: f.x, y: f.y, valor: e.combo, ate: e.tempo + 1 });
      e.combo = e.combo === 1600 ? 1600 : ((e.combo * 2) as Estado["combo"]);
      muda(e, "comendo");
      return;
    }
    muda(e, "morrendo");
    return;
  }
}
