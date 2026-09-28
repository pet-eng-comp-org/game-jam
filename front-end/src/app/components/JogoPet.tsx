"use client"

// O jogo do Inicio: o labirinto com "GAME JAM" nas paredes (src/lib/jogo), desenhado
// num canvas com os sprites do arcade (src/lib/sprites.ts). Teclado (setas ou
// WASD) e, no celular, deslizar o dedo sobre o labirinto.
//
// Como o Doodle do Google: tudo dentro do quadro preto (placar em cima, vidas
// embaixo, "PRONTO!" no corredor do meio, na letra da logo), e a partida
// comeca sozinha quando o jogo aparece na tela, com a abertura do arcade. Com
// animacao reduzida, espera a pessoa apertar Jogar.
//
// So roda quando esta na tela: fora dela (ou com a aba escondida) o laco para,
// e a partida fica congelada ate a pessoa voltar.
//
// Celular deitado: se o jogo estava na tela quando a pessoa virou o aparelho,
// ele ocupa a tela inteira (labirinto no meio, Sair a direita). Nao obriga ninguem a virar: em pe
// continua funcionando, com uma dica e, onde o navegador deixa (Android), um
// botao que entra em tela cheia e trava na horizontal. O canvas e o mesmo
// elemento nos dois jeitos (so o CSS muda), para a partida nao recomecar.
import { useCallback, useEffect, useRef, useState } from "react"
import { ABERTURA, comeca, frutaDoNivel, LUGAR_DA_FRUTA, novoJogo, passo, vira, VIDAS, type Direcao, type Estado, type Fantasma, type NomeFruta } from "@/lib/jogo/pacman"
import { ALTURA, LABIRINTO, LARGURA, LETRA, MEIO } from "@/lib/jogo/labirinto"
import { CORES, FANTASMA, OLHOS, PACMAN_ABERTO, PACMAN_FECHADO, PACMAN_MEIO, ROSTO_ASSUSTADO } from "@/lib/sprites"
import { FANTASMA_B, FRUTAS, PACMAN_MORTE, PASTILHA, PONTOS_FANTASMA, PONTOS_FRUTA } from "@/lib/jogo/sprites-jogo"
import { FONTE, larguraDoTexto } from "@/lib/jogo/fonte"

const CHAVE_RECORDE = "pet-game-jam-recorde"
// Faixas do quadro, em tiles: placar em cima, vidas embaixo, como no arcade.
const TOPO = 2, BASE = 2
const ALTO = TOPO + ALTURA + BASE
// Cores da logo: G, A, M e E de GAME; JAM em branco.
const COR_DA_LETRA = ["#A40000", "#C88FC8", "#00AAAA", "#BF8A3D", "#FFFFFF", "#FFFFFF", "#FFFFFF"]
const AMARELO = "#E9CB0A" // o PET da logo
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
  const paredesRef = useRef<Paredes | null>(null)
  const tileRef = useRef(16)
  const visivelRef = useRef(true)
  const cheiaRef = useRef(false)
  const [cheia, setCheia] = useState(false)
  // Tela cheia de verdade (Fullscreen API) com trava de orientacao: o Safari
  // do iPhone nao tem, e la so da para pedir que a pessoa vire.
  const [podeTravar] = useState(() =>
    typeof document !== "undefined" && !!document.fullscreenEnabled &&
    typeof screen !== "undefined" && "orientation" in screen && typeof (screen.orientation as ScreenOrientation & { lock?: unknown }).lock === "function")

  // O que o React precisa saber (botao Jogar, texto para leitor de tela) e
  // so atualizado quando muda, e nao a cada quadro; o placar e desenhado.
  const [hud, setHud] = useState({ pontos: 0, vidas: VIDAS, fase: "espera" as Estado["fase"], nivel: 1 })
  // Carregado so no navegador (dynamic sem ssr, em JogoNaPagina.tsx), entao
  // da para ler o recorde ja na criacao do estado.
  const [recorde, setRecorde] = useState(leRecorde)
  // O desenho le o recorde a cada quadro, sem depender de render.
  const recordeRef = useRef(recorde)
  useEffect(() => { recordeRef.current = recorde }, [recorde])

  const inicia = useCallback(() => {
    const e = estadoRef.current
    if (!e) return
    comeca(e)
    telaRef.current?.focus({ preventScroll: true })
  }, [])

  // Tamanho: o tile acompanha a largura da caixa (e da tela do aparelho).
  // Deitado, o maior que couber ao lado do placar.
  const mede = useCallback(() => {
    const c = telaRef.current, box = caixaRef.current
    if (!c || !box) return
    const t = cheiaRef.current
      ? Math.max(6, Math.min(Math.floor((innerWidth - 150) / LARGURA), Math.floor((innerHeight - 16) / ALTO)))
      : Math.max(8, Math.min(26, Math.floor(box.clientWidth / LARGURA)))
    tileRef.current = t
    const dpr = window.devicePixelRatio || 1
    c.width = LARGURA * t * dpr
    c.height = ALTO * t * dpr
    // Largura em pixel inteiro por tile; se nem o tile minimo couber (telas
    // de 280px), o CSS encolhe (max-w-full, altura proporcional).
    c.style.width = `${LARGURA * t}px`
    paredesRef.current = { cor: desenhaParedes(t, dpr, false), branca: desenhaParedes(t, dpr, true) }
    // Mudar o tamanho limpa o canvas: redesenha ja, mesmo com o laco parado
    // (celular girando com o jogo fora da tela).
    if (estadoRef.current) desenha(c, estadoRef.current, t, paredesRef.current, recordeRef.current)
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
      desenha(c, e, tileRef.current, paredesRef.current, recordeRef.current)
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
    // Como o Doodle, a partida comeca sozinha, uma vez, quando o jogo aparece
    // quase inteiro na tela. Com animacao reduzida, nao: fica o botao Jogar.
    let comecou = false
    const reduzida = matchMedia("(prefers-reduced-motion: reduce)").matches
    const vis = new IntersectionObserver(([ent]) => {
      visivelRef.current = ent.intersectionRatio >= 0.2
      const e = estadoRef.current
      if (!comecou && !reduzida && ent.intersectionRatio >= 0.6 && e?.fase === "espera") { comecou = true; comeca(e) }
      liga()
    }, { threshold: [0, 0.2, 0.6] })
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

  // Deitou o celular com o jogo na tela: tela cheia. Levantou: volta.
  useEffect(() => {
    const mq = matchMedia("(orientation: landscape) and (pointer: coarse)")
    const muda = () => {
      if (mq.matches && visivelRef.current) setCheia(true)
      else if (!mq.matches) setCheia(false)
    }
    mq.addEventListener("change", muda)
    return () => mq.removeEventListener("change", muda)
  }, [])

  useEffect(() => {
    cheiaRef.current = cheia
    mede()
    if (!cheia) return
    // A pagina nao rola por baixo, e o tamanho acompanha a barra do navegador
    // aparecendo e sumindo.
    const antes = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("resize", mede)
    return () => { document.body.style.overflow = antes; window.removeEventListener("resize", mede) }
  }, [cheia, mede])

  const entraTelaCheia = async () => {
    try {
      await caixaRef.current?.requestFullscreen()
      await (screen.orientation as ScreenOrientation & { lock: (o: string) => Promise<void> }).lock("landscape")
    } catch { /* sem permissao: fica a dica de virar o celular */ }
    setCheia(true)
  }
  const sai = () => {
    setCheia(false)
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
  }

  // Toque, como no Doodle do Google (sem direcional na tela): deslizar o dedo
  // na area do jogo vira o Pac-Man; tocar no labirinto leva ele na direcao
  // do toque. Na partida a area nao rola a pagina (touch-action); fora dela,
  // rola normal. Mesmas regras do codigo do Doodle: deslize de 15 px no eixo
  // que domina; toque a mais de meio tile do Pac-Man.
  const toqueRef = useRef<{ x: number; y: number; moveu: boolean } | null>(null)
  const onPointerDown = (ev: React.PointerEvent) => {
    if (ev.pointerType === "mouse" && ev.button !== 0) return
    toqueRef.current = { x: ev.clientX, y: ev.clientY, moveu: false }
  }
  const onPointerMove = (ev: React.PointerEvent) => {
    const t = toqueRef.current, e = estadoRef.current
    if (!t || !e) return
    const dx = ev.clientX - t.x, dy = ev.clientY - t.y
    const ax = Math.abs(dx), ay = Math.abs(dy)
    if (ax > 15 && ay < (2 * ax) / 3) vira(e, dx > 0 ? "direita" : "esquerda")
    else if (ay > 15 && ax < (2 * ay) / 3) vira(e, dy > 0 ? "baixo" : "cima")
    else return
    toqueRef.current = { x: ev.clientX, y: ev.clientY, moveu: true }
  }
  const onPointerUp = (ev: React.PointerEvent) => {
    const t = toqueRef.current, e = estadoRef.current, c = telaRef.current
    toqueRef.current = null
    if (!t || !e || t.moveu) return
    if (e.fase === "espera" || e.fase === "fim") { inicia(); return }
    // Toque sem arrastar, em cima do labirinto: vai na direcao do toque.
    if (!c || ev.target !== c) return
    const r = c.getBoundingClientRect()
    const tx = ((ev.clientX - r.left) / r.width) * LARGURA - 0.5
    const ty = ((ev.clientY - r.top) / r.height) * ALTO - TOPO - 0.5
    const dx = tx - e.pacman.x, dy = ty - e.pacman.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 0.5) return
    vira(e, Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "direita" : "esquerda") : (dy > 0 ? "baixo" : "cima"))
  }
  const emPartida = hud.fase !== "espera" && hud.fase !== "fim"

  return (
    <div
      ref={caixaRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { toqueRef.current = null }}
      style={emPartida || cheia ? { touchAction: "none" } : undefined}
      role={cheia ? "dialog" : undefined}
      aria-label={cheia ? "Jogo em tela cheia" : undefined}
      className={cheia
        ? "fixed inset-0 z-[60] flex items-center justify-center gap-3 bg-fundo px-[max(12px,env(safe-area-inset-left))]"
        : "w-full"}
    >
      {/* Em pe: o quadro na largura da caixa. Deitado ("contents"): o quadro
          no meio da tela cheia e o Sair ao lado. */}
      <div className={cheia ? "contents" : "mx-auto w-fit max-w-full"}>
      {cheia && (
        <div className="order-3 flex w-[110px] shrink-0 justify-center">
          <button type="button" onClick={sai} className="rounded-full border-2 border-destaque-claro/60 px-4 py-1.5 text-sm font-bold text-destaque-claro">
            Sair
          </button>
        </div>
      )}

      <div className={cheia ? "relative order-2" : "relative"}>
        <canvas
          ref={telaRef}
          tabIndex={0}
          role="img"
          aria-label="Jogo: labirinto do Pac-Man com GAME JAM escrito nas paredes. Enter para jogar, setas para mover."
          data-fase={hud.fase}
          className="block h-auto max-w-full touch-none select-none rounded-md bg-black outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-destaque"
        />
        {(hud.fase === "espera" || hud.fase === "fim") && (
          // O "Insert Coin" do Doodle: um botao de verdade, por cima do quadro.
          // Na espera, no corredor do meio; no fim, embaixo do "FIM DE JOGO".
          <button
            type="button"
            onClick={inicia}
            style={{ top: `${((TOPO + MEIO + (hud.fase === "fim" ? 2.5 : 0.5)) / ALTO) * 100}%` }}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-destaque px-5 py-1.5 text-sm font-bold text-barra transition-opacity hover:opacity-90 sm:px-7 sm:py-2.5 sm:text-base md:text-lg"
          >
            {hud.fase === "fim" ? "Jogar de novo" : "Jogar"}
          </button>
        )}
      </div>

      {/* Em pe, no celular: a dica de deitar, com o aparelho girando, e o
          botao de tela cheia onde o navegador deixa travar a orientacao. */}
      {!cheia && (
        <div className="mt-5 hidden flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 text-sm text-destaque-claro pointer-coarse:portrait:flex">
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 motion-safe:animate-vira-celular">
              <rect x="7" y="2" width="10" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M11 18h2" stroke="currentColor" strokeWidth="2" />
            </svg>
            Vire o celular para jogar em tela cheia
          </span>
          {podeTravar && (
            <button type="button" onClick={entraTelaCheia} className="rounded-full border-2 border-destaque px-4 py-1 font-bold text-destaque">
              Tela cheia
            </button>
          )}
        </div>
      )}
      </div>
      <p className="sr-only">Pontos: {hud.pontos}. Recorde: {Math.max(recorde, hud.pontos)}.</p>
      <p className="sr-only" aria-live="polite">
        {hud.fase === "fim" ? `Fim de jogo: ${hud.pontos} pontos.` : hud.fase === "venceu" ? `Labirinto limpo! Nível ${hud.nivel + 1}.` : ""}
      </p>
    </div>
  )
}

// Paredes: fixas, desenhadas uma vez num canvas fora da tela. Cada tile de
// parede ganha linha nos lados que dao para um corredor, recuada para dentro
// dele; com o traco das letras de 2 tiles, sai o contorno duplo do arcade.
// Cada letra na cor dela na logo, a borda no azul do arcade; a versao branca
// e a do labirinto piscando quando ele fica limpo.
type Paredes = { cor: HTMLCanvasElement; branca: HTMLCanvasElement }
function desenhaParedes(t: number, dpr: number, branca: boolean) {
  const c = document.createElement("canvas")
  c.width = LARGURA * t * dpr
  c.height = ALTURA * t * dpr
  const g = c.getContext("2d")!
  g.scale(dpr, dpr)
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
      const letra = LETRA[y][x] ?? -1
      g.strokeStyle = branca ? "#FFFFFF" : letra < 0 ? CORES.parede : COR_DA_LETRA[letra]
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

// Texto na letra da logo (src/lib/jogo/fonte.ts), com altura em px; cada
// letra e um Path2D so, para nao abrir fresta entre os pixels.
const letras = new Map<string, Path2D>()
function letra(ch: string) {
  let p = letras.get(ch)
  if (!p) {
    p = new Path2D()
    const f = FONTE[ch] ?? FONTE[" "]
    f.forEach((linha, y) => [...linha].forEach((c, x) => { if (c === "#") p!.rect(x, y, 1, 1) }))
    letras.set(ch, p)
  }
  return p
}
function escreve(g: CanvasRenderingContext2D, texto: string, x: number, y: number, altura: number, cor: string, alinha: "esquerda" | "centro" | "direita" = "esquerda") {
  const p = altura / 7
  const w = larguraDoTexto(texto) * p
  g.save()
  g.fillStyle = cor
  g.translate(alinha === "centro" ? x - w / 2 : alinha === "direita" ? x - w : x, y)
  g.scale(p, p)
  for (const ch of texto) {
    g.fill(letra(ch))
    g.translate((FONTE[ch] ?? FONTE[" "])[0].length + 1, 0)
  }
  g.restore()
}

function desenha(c: HTMLCanvasElement, e: Estado, t: number, paredes: Paredes | null, recorde: number) {
  const g = c.getContext("2d")!
  const dpr = c.width / (LARGURA * t)
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.fillStyle = "#000"
  g.fillRect(0, 0, LARGURA * t, ALTO * t)

  // Placar, em cima: "1UP" (pisca durante a partida, como no arcade) e os
  // pontos a esquerda, o recorde a direita.
  const h = Math.max(7, t * 1.1)
  const yTexto = (TOPO * t - h) / 2
  const pisca = e.fase === "jogando" && Math.floor(e.tempo * 3) % 2 === 1
  if (!pisca) escreve(g, "1UP", t, yTexto, h, AMARELO)
  escreve(g, String(e.pontos), t + (larguraDoTexto("1UP ") * h) / 7, yTexto, h, "#FFFFFF")
  const valor = String(Math.max(recorde, e.pontos))
  const fim = (LARGURA - 1) * t
  escreve(g, valor, fim, yTexto, h, "#FFFFFF", "direita")
  escreve(g, "RECORDE", fim - (larguraDoTexto(valor + " ") * h) / 7, yTexto, h, AMARELO, "direita")

  // Pixel do sprite: um sprite de 16 ocupa ~1,7 tile, como no arcade.
  const s = Math.max(1, Math.round((t * 1.7) / 16))

  // Vidas, embaixo: as que sobram alem da que esta em jogo. Na abertura,
  // antes do Pac-Man aparecer, contam todas; quando ele surge, uma sai dali.
  const escondidos = e.fase === "pronto" && e.abertura && e.tempoFase < ABERTURA.aparecem
  const vidas = Math.max(0, e.vidas - (e.fase === "espera" || escondidos ? 0 : 1))
  for (let i = 0; i < vidas; i++) {
    g.save()
    g.translate(Math.round((1.5 + i * 2) * t + (13 * s) / 2), Math.round((TOPO + ALTURA + BASE / 2) * t - (13 * s) / 2))
    g.scale(-s, s)
    g.fillStyle = CORES.pacman
    g.fill(caminho(PACMAN_MEIO))
    g.restore()
  }

  // E a direita, as frutas dos ultimos 7 niveis, como no arcade: a mais
  // antiga no canto, cada nivel novo acrescenta uma a esquerda.
  const primeiro = Math.max(1, e.nivel - 6)
  for (let n = primeiro; n <= e.nivel; n++) {
    desenhaFruta(g, frutaDoNivel(n), (LARGURA - 1.5 - (n - primeiro) * 2) * t, (TOPO + ALTURA + BASE / 2) * t, s)
  }

  // Daqui para baixo, o labirinto, entre as faixas.
  g.translate(0, TOPO * t)
  // Labirinto limpo: as paredes piscam em branco, e os fantasmas somem.
  const limpo = e.fase === "venceu" && e.tempoFase >= 1
  if (paredes) g.drawImage(limpo && Math.floor(e.tempoFase * 4) % 2 === 0 ? paredes.branca : paredes.cor, 0, 0, LARGURA * t, ALTURA * t)

  // "PRONTO!" e "FIM DE JOGO" no corredor do meio, onde nao ha bolinhas.
  const hm = Math.max(7, t * 0.9)
  if (e.fase === "pronto") escreve(g, "PRONTO!", (LARGURA * t) / 2, (MEIO + 0.5) * t - hm / 2, hm, AMARELO, "centro")
  if (e.fase === "fim") escreve(g, "FIM DE JOGO", (LARGURA * t) / 2, (MEIO + 0.5) * t - hm / 2, hm, CORES.vermelho, "centro")

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

  // Na abertura, so o labirinto e o "PRONTO!" ate a hora de aparecerem; no
  // fim de jogo, so o "FIM DE JOGO", como no arcade.
  if (escondidos || e.fase === "fim") return
  const morrendo = e.fase === "morrendo"
  // Fantasmas (somem enquanto o Pac-Man morre, como no arcade).
  if (!limpo && (!morrendo || e.tempoFase < 0.5)) {
    for (const f of e.fantasmas) desenhaFantasma(g, e, f, centro(f.x), centro(f.y), s)
  }

  // A fruta, e os pontos dela (em rosa) depois de comida.
  if (e.fruta) desenhaFruta(g, frutaDoNivel(e.nivel), centro(LUGAR_DA_FRUTA.x), centro(LUGAR_DA_FRUTA.y), s)
  const pf = e.pontosFruta && e.tempo < e.pontosFruta.ate ? PONTOS_FRUTA[e.pontosFruta.valor] : null
  if (pf) {
    g.save()
    g.translate(Math.round(centro(LUGAR_DA_FRUTA.x) - (pf.largura * s) / 2), Math.round(centro(LUGAR_DA_FRUTA.y) - (7 * s) / 2))
    g.scale(s, s)
    g.fillStyle = CORES.porta
    g.fill(caminho(pf.d))
    g.restore()
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

function desenhaFruta(g: CanvasRenderingContext2D, fruta: NomeFruta, cx: number, cy: number, s: number) {
  for (const camada of FRUTAS[fruta]) sprite(g, camada.d, camada.cor, cx, cy, s, 16)
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
