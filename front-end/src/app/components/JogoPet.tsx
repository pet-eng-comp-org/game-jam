"use client"

// O jogo do Inicio: o labirinto com "GAME JAM" nas paredes (src/lib/jogo), desenhado
// num canvas com os sprites do arcade (src/lib/sprites.ts). Teclado (setas ou
// WASD) e, no celular, deslizar o dedo sobre o labirinto.
//
// So roda quando esta na tela: fora dela (ou com a aba escondida) o laco para,
// e a partida fica congelada ate a pessoa voltar.
import { useCallback, useEffect, useRef, useState } from "react"
import { comeca, novoJogo, passo, vira, VIDAS, type Direcao, type Estado, type Fantasma } from "@/lib/jogo/pacman"
import { ALTURA, LABIRINTO, LARGURA } from "@/lib/jogo/labirinto"
import { CORES, FANTASMA, OLHOS, PACMAN_ABERTO, PACMAN_FECHADO, PACMAN_MEIO, ROSTO_ASSUSTADO } from "@/lib/sprites"
import { FANTASMA_B, PACMAN_MORTE, PASTILHA, PONTOS_FANTASMA } from "@/lib/jogo/sprites-jogo"
import Personagem from "./Personagem"

const CHAVE_RECORDE = "pet-game-jam-recorde"
const TECLAS: Record<string, Direcao> = {
  ArrowUp: "cima", ArrowDown: "baixo", ArrowLeft: "esquerda", ArrowRight: "direita",
  w: "cima", s: "baixo", a: "esquerda", d: "direita", W: "cima", S: "baixo", A: "esquerda", D: "direita",
}

// Path2D de cada sprite, criados uma vez.
const caminhos = new Map<string, Path2D>()
const caminho = (d: string) => {
  let p = caminhos.get(d)
  if (!p) { p = new Path2D(d); caminhos.set(d, p) }
  return p
}

function leRecorde() {
  try { return Number(localStorage.getItem(CHAVE_RECORDE)) || 0 } catch { return 0 }
}
function gravaRecorde(n: number) {
  try { localStorage.setItem(CHAVE_RECORDE, String(n)) } catch { /* aba anonima: fica so na sessao */ }
}

export default function JogoPet() {
  const caixaRef = useRef<HTMLDivElement>(null)
  const telaRef = useRef<HTMLCanvasElement>(null)
  const estadoRef = useRef<Estado | null>(null)
  const paredesRef = useRef<HTMLCanvasElement | null>(null)
  const tileRef = useRef(16)
  const visivelRef = useRef(true)

  // O que aparece fora do canvas (placar, vidas, mensagens) e so atualizado
  // quando muda, e nao a cada quadro.
  const [hud, setHud] = useState({ pontos: 0, vidas: VIDAS, fase: "espera" as Estado["fase"], nivel: 1 })
  // Carregado so no navegador (dynamic sem ssr, em JogoNaPagina.tsx), entao
  // da para ler o recorde ja na criacao do estado.
  const [recorde, setRecorde] = useState(leRecorde)

  const inicia = useCallback(() => {
    const e = estadoRef.current
    if (!e) return
    comeca(e)
    telaRef.current?.focus({ preventScroll: true })
  }, [])

  // Tamanho: o tile acompanha a largura da caixa (e da tela do aparelho).
  const mede = useCallback(() => {
    const c = telaRef.current, box = caixaRef.current
    if (!c || !box) return
    const t = Math.max(8, Math.min(26, Math.floor(box.clientWidth / LARGURA)))
    tileRef.current = t
    const dpr = window.devicePixelRatio || 1
    c.width = LARGURA * t * dpr
    c.height = ALTURA * t * dpr
    // Largura em pixel inteiro por tile; se nem o tile minimo couber (telas
    // de 280px), o CSS encolhe (max-w-full, altura proporcional).
    c.style.width = `${LARGURA * t}px`
    paredesRef.current = desenhaParedes(t, dpr)
    // Mudar o tamanho limpa o canvas: redesenha ja, mesmo com o laco parado
    // (celular girando com o jogo fora da tela).
    if (estadoRef.current) desenha(c, estadoRef.current, t, paredesRef.current)
  }, [])

  useEffect(() => {
    estadoRef.current = novoJogo()
    mede()
    const obs = new ResizeObserver(mede)
    if (caixaRef.current) obs.observe(caixaRef.current)


    // O laco so gira enquanto o jogo esta na tela e a aba esta a vista.
    let quadro = 0, ultimo = performance.now()
    let anterior = { pontos: -1, vidas: -1, fase: "", nivel: -1 }
    const laco = (agora: number) => {
      const dt = (agora - ultimo) / 1000
      ultimo = agora
      const e = estadoRef.current, c = telaRef.current
      if (!e || !c || !visivelRef.current || document.hidden) { quadro = 0; return }
      quadro = requestAnimationFrame(laco)
      passo(e, dt)
      desenha(c, e, tileRef.current, paredesRef.current)
      if (e.pontos !== anterior.pontos || e.vidas !== anterior.vidas || e.fase !== anterior.fase || e.nivel !== anterior.nivel) {
        anterior = { pontos: e.pontos, vidas: e.vidas, fase: e.fase, nivel: e.nivel }
        setHud(anterior as typeof hud)
        if (e.fase === "fim" && e.pontos > leRecorde()) { gravaRecorde(e.pontos); setRecorde(e.pontos) }
      }
    }
    const liga = () => {
      if (quadro || !visivelRef.current || document.hidden) return
      ultimo = performance.now()
      quadro = requestAnimationFrame(laco)
    }
    const vis = new IntersectionObserver(([ent]) => { visivelRef.current = ent.isIntersecting; liga() }, { threshold: 0.2 })
    if (telaRef.current) vis.observe(telaRef.current)
    document.addEventListener("visibilitychange", liga)
    liga()
    return () => { cancelAnimationFrame(quadro); obs.disconnect(); vis.disconnect(); document.removeEventListener("visibilitychange", liga) }
  }, [mede])

  // Teclado: so segura as setas (sem rolar a pagina) durante a partida.
  useEffect(() => {
    const tecla = (ev: KeyboardEvent) => {
      const e = estadoRef.current
      if (!e) return
      const dir = TECLAS[ev.key]
      const emJogo = e.fase !== "espera" && e.fase !== "fim"
      if (dir && emJogo && visivelRef.current) { ev.preventDefault(); vira(e, dir) }
      else if ((ev.key === "Enter" || ev.key === " ") && document.activeElement === telaRef.current && !emJogo) {
        ev.preventDefault(); inicia()
      }
    }
    window.addEventListener("keydown", tecla)
    return () => window.removeEventListener("keydown", tecla)
  }, [inicia])

  // Toque: deslizar o dedo sobre o labirinto vira o Pac-Man; tocar comeca.
  const toqueRef = useRef<{ x: number; y: number } | null>(null)
  const onPointerDown = (ev: React.PointerEvent) => { toqueRef.current = { x: ev.clientX, y: ev.clientY } }
  const onPointerMove = (ev: React.PointerEvent) => {
    const t = toqueRef.current, e = estadoRef.current
    if (!t || !e) return
    const dx = ev.clientX - t.x, dy = ev.clientY - t.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return
    vira(e, Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "direita" : "esquerda") : (dy > 0 ? "baixo" : "cima"))
    toqueRef.current = { x: ev.clientX, y: ev.clientY }
  }
  const onPointerUp = () => {
    const e = estadoRef.current
    if (e && (e.fase === "espera" || e.fase === "fim") && toqueRef.current) inicia()
    toqueRef.current = null
  }

  const mensagem =
    hud.fase === "pronto" ? "Pronto!" :
    hud.fase === "venceu" ? "Labirinto limpo!" :
    hud.fase === "fim" ? "Fim de jogo" : null

  return (
    <div ref={caixaRef} className="w-full">
      {/* Placar e labirinto na mesma largura (a do canvas). */}
      <div className="mx-auto w-fit max-w-full">
      <div className="mb-3 flex items-end justify-between gap-4 px-6 font-bold sm:px-0">
        <div>
          <p className="text-sm text-destaque-claro/80">Pontos</p>
          <p className="font-secao text-4xl leading-none text-white" aria-live="off">{hud.pontos}</p>
        </div>
        <div className="flex items-center gap-1.5" aria-label={`${hud.vidas} vidas`} role="img">
          {Array.from({ length: Math.max(0, hud.vidas - (hud.fase === "espera" ? 0 : 1)) }, (_, i) => (
            <Personagem key={i} qual="pacman" className="h-5 w-5 -scale-x-100" />
          ))}
        </div>
        <div className="text-right">
          <p className="text-sm text-destaque-claro/80">Recorde</p>
          <p className="font-secao text-4xl leading-none text-white">{Math.max(recorde, hud.pontos)}</p>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={telaRef}
          tabIndex={0}
          role="img"
          aria-label="Jogo: labirinto do Pac-Man com GAME JAM escrito nas paredes. Enter para jogar, setas para mover."
          className="block h-auto max-w-full touch-none select-none rounded-md bg-black outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-destaque"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { toqueRef.current = null }}
        />
        {(hud.fase === "espera" || hud.fase === "fim") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55">
            {hud.fase === "fim" && <p className="font-secao text-2xl uppercase leading-none text-[#FF0000] sm:text-4xl md:text-5xl">{mensagem}</p>}
            <button
              type="button"
              onClick={inicia}
              className="rounded-full bg-destaque px-5 py-1.5 text-sm font-bold text-barra transition-opacity hover:opacity-90 sm:px-7 sm:py-2.5 sm:text-base md:text-lg"
            >
              {hud.fase === "fim" ? "Jogar de novo" : "Jogar"}
            </button>
          </div>
        )}
        {mensagem && hud.fase !== "fim" && (
          <p className="pointer-events-none absolute inset-x-0 top-[64%] text-center font-secao text-3xl uppercase leading-none text-destaque md:text-5xl">
            {mensagem}
          </p>
        )}
      </div>

      {/* Direcional na tela, so em aparelho de toque: no celular o labirinto
          tem uns 110px de altura, e deslizar o dedo nele era dificil. */}
      <div className="mt-5 hidden justify-center pointer-coarse:flex">
        <div className="grid grid-cols-3 gap-2">
          {([["cima", "col-start-2", "Para cima"], ["esquerda", "col-start-1", "Para a esquerda"], ["direita", "col-start-3", "Para a direita"], ["baixo", "col-start-2", "Para baixo"]] as const).map(([dir, col, rotulo]) => (
            <button
              key={dir}
              type="button"
              aria-label={rotulo}
              onPointerDown={(ev) => {
                ev.preventDefault()
                const e = estadoRef.current
                if (!e) return
                if (e.fase === "espera" || e.fase === "fim") inicia()
                vira(e, dir)
              }}
              className={`${col} ${dir === "direita" ? "row-start-2" : ""} flex h-14 w-14 touch-none select-none items-center justify-center rounded-lg border-2 border-[#2121FF] bg-black active:bg-[#2121FF]/40`}
            >
              <svg viewBox="0 0 10 10" aria-hidden className={`h-5 w-5 fill-destaque ${{ cima: "", baixo: "rotate-180", esquerda: "-rotate-90", direita: "rotate-90" }[dir]}`}>
                <path d="M5 1 9 8H1z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {hud.fase === "fim" ? `Fim de jogo: ${hud.pontos} pontos.` : hud.fase === "venceu" ? `Labirinto limpo! Nível ${hud.nivel + 1}.` : ""}
      </p>
    </div>
  )
}

// Paredes: fixas, desenhadas uma vez num canvas fora da tela. Cada tile de
// parede ganha linha nos lados que dao para um corredor, recuada para dentro
// dele; com o traco das letras de 2 tiles, sai o contorno duplo do arcade.
function desenhaParedes(t: number, dpr: number) {
  const c = document.createElement("canvas")
  c.width = LARGURA * t * dpr
  c.height = ALTURA * t * dpr
  const g = c.getContext("2d")!
  g.scale(dpr, dpr)
  g.strokeStyle = CORES.parede
  g.lineWidth = Math.max(1.5, t / 10)
  g.lineCap = "square"
  const k = t * 0.35
  const parede = (x: number, y: number) => x < 0 || y < 0 || x >= LARGURA || y >= ALTURA || LABIRINTO[y][x] === "#"
  const linha = (a: number, b: number, c2: number, d: number) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c2, d); g.stroke() }
  for (let y = 0; y < ALTURA; y++) {
    for (let x = 0; x < LARGURA; x++) {
      if (LABIRINTO[y][x] === "-") {
        g.fillStyle = CORES.porta
        g.fillRect(x * t, y * t + t / 2 - t / 10, t, t / 5)
      }
      if (!parede(x, y)) continue
      const X = x * t, Y = y * t
      const cima = parede(x, y - 1), baixo = parede(x, y + 1), esq = parede(x - 1, y), dir = parede(x + 1, y)
      if (!cima) linha(X + (esq ? 0 : k), Y + k, X + t - (dir ? 0 : k), Y + k)
      if (!baixo) linha(X + (esq ? 0 : k), Y + t - k, X + t - (dir ? 0 : k), Y + t - k)
      if (!esq) linha(X + k, Y + (cima ? 0 : k), X + k, Y + t - (baixo ? 0 : k))
      if (!dir) linha(X + t - k, Y + (cima ? 0 : k), X + t - k, Y + t - (baixo ? 0 : k))
      if (cima && esq && !parede(x - 1, y - 1)) { linha(X, Y + k, X + k, Y + k); linha(X + k, Y, X + k, Y + k) }
      if (cima && dir && !parede(x + 1, y - 1)) { linha(X + t - k, Y + k, X + t, Y + k); linha(X + t - k, Y, X + t - k, Y + k) }
      if (baixo && esq && !parede(x - 1, y + 1)) { linha(X, Y + t - k, X + k, Y + t - k); linha(X + k, Y + t - k, X + k, Y + t) }
      if (baixo && dir && !parede(x + 1, y + 1)) { linha(X + t - k, Y + t - k, X + t, Y + t - k); linha(X + t - k, Y + t - k, X + t - k, Y + t) }
    }
  }
  return c
}

// Um sprite (caminho em pixels) centrado em (cx, cy), com pixel de s px.
function sprite(g: CanvasRenderingContext2D, d: string, cor: string, cx: number, cy: number, s: number, caixa: number) {
  g.save()
  g.translate(Math.round(cx - (caixa * s) / 2), Math.round(cy - (caixa * s) / 2))
  g.scale(s, s)
  g.fillStyle = cor
  g.fill(caminho(d))
  g.restore()
}

function desenha(c: HTMLCanvasElement, e: Estado, t: number, paredes: HTMLCanvasElement | null) {
  const g = c.getContext("2d")!
  const dpr = c.width / (LARGURA * t)
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.fillStyle = "#000"
  g.fillRect(0, 0, LARGURA * t, ALTURA * t)
  if (paredes) g.drawImage(paredes, 0, 0, LARGURA * t, ALTURA * t)

  // Pixel do sprite: um sprite de 16 ocupa ~1,7 tile, como no arcade.
  const s = Math.max(1, Math.round((t * 1.7) / 16))
  const centro = (v: number) => (v + 0.5) * t

  // Bolinhas; as grandes piscam.
  g.fillStyle = CORES.bolinha
  const b = Math.max(2, Math.round(t / 7))
  for (let y = 0; y < ALTURA; y++) {
    for (let x = 0; x < LARGURA; x++) {
      const ch = e.grade[y][x]
      if (ch === ".") g.fillRect(Math.round(centro(x) - b / 2), Math.round(centro(y) - b / 2), b, b)
      else if (ch === "o" && (e.fase !== "jogando" || Math.floor(e.tempo * 4) % 2 === 0)) sprite(g, PASTILHA, CORES.bolinha, centro(x), centro(y), s, 8)
    }
  }

  const morrendo = e.fase === "morrendo"
  // Fantasmas (somem enquanto o Pac-Man morre, como no arcade).
  if (!morrendo || e.tempoFase < 0.5) {
    for (const f of e.fantasmas) desenhaFantasma(g, e, f, centro(f.x), centro(f.y), s)
  }

  // Pontos do fantasma comido, no lugar dele.
  for (const p of e.placares) {
    const sp = PONTOS_FANTASMA[p.valor]
    g.save()
    g.translate(Math.round(centro(p.x) - (sp.largura * s) / 2), Math.round(centro(p.y) - (7 * s) / 2))
    g.scale(s, s)
    g.fillStyle = CORES.pontos
    g.fill(caminho(sp.d))
    g.restore()
  }

  // Pac-Man: no "comendo" some (o placar fica no lugar), como no arcade.
  const p = e.pacman
  if (e.fase === "comendo") return
  const px = centro(p.x), py = centro(p.y)
  if (morrendo) {
    if (e.tempoFase < 0.5) { sprite(g, PACMAN_FECHADO, CORES.pacman, px, py, s, 13); return }
    const i = Math.min(PACMAN_MORTE.length - 1, Math.floor(((e.tempoFase - 0.5) / 1.2) * PACMAN_MORTE.length))
    if (e.tempoFase < 1.7) sprite(g, PACMAN_MORTE[i], CORES.pacman, px, py, s, 16)
    return
  }
  const quadros = [PACMAN_ABERTO, PACMAN_MEIO, PACMAN_FECHADO, PACMAN_MEIO]
  const d = e.fase === "jogando" && !p.parado ? quadros[Math.floor(p.andou * 5) % 4] : e.fase === "espera" || e.fase === "pronto" ? PACMAN_FECHADO : PACMAN_MEIO
  g.save()
  g.translate(Math.round(px), Math.round(py))
  if (p.dir === "esquerda") g.scale(-1, 1)
  else if (p.dir === "cima") g.rotate(-Math.PI / 2)
  else if (p.dir === "baixo") g.rotate(Math.PI / 2)
  g.translate(-Math.round((13 * s) / 2), -Math.round((13 * s) / 2))
  g.scale(s, s)
  g.fillStyle = CORES.pacman
  g.fill(caminho(d))
  g.restore()
}

function desenhaFantasma(g: CanvasRenderingContext2D, e: Estado, f: Fantasma, cx: number, cy: number, s: number) {
  // Na casa, sobem e descem.
  if (f.estado === "casa") cy += Math.round(Math.sin(e.tempo * 6 + f.x) * s * 2)
  const olhos = OLHOS[f.dir]
  const saia = Math.floor(e.tempo * 8) % 2 === 0 ? FANTASMA : FANTASMA_B
  if (f.estado === "olhos" || f.estado === "entrando") {
    sprite(g, olhos.branco, CORES.olho, cx, cy, s, 14)
    sprite(g, olhos.pupila, CORES.pupila, cx, cy, s, 14)
    return
  }
  if (f.assustado) {
    // Nos ultimos 2 segundos, pisca em branco.
    const falta = e.assustadoAte - e.jogo
    const branco = falta < 2 && Math.floor(e.tempo * 5) % 2 === 0
    sprite(g, saia, branco ? CORES.olho : CORES.pupila, cx, cy, s, 14)
    sprite(g, ROSTO_ASSUSTADO, branco ? CORES.vermelho : CORES.assustadoRosto, cx, cy, s, 14)
    return
  }
  sprite(g, saia, CORES[f.nome], cx, cy, s, 14)
  sprite(g, olhos.branco, CORES.olho, cx, cy, s, 14)
  sprite(g, olhos.pupila, CORES.pupila, cx, cy, s, 14)
}
