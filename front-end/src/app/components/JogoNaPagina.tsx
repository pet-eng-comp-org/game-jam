"use client"

// O jogo so carrega quando a pessoa rola ate perto dele: o codigo (motor,
// sprites, canvas) e o primeiro desenho do labirinto nao pesam na abertura do
// Inicio, onde o que importa e a data. Medido no Lighthouse: o jogo carregado
// de cara custava ~800 ms de processamento no celular simulado.
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const JogoPet = dynamic(() => import("./JogoPet"), { ssr: false, loading: () => <Espaco /> })

// Guarda o espaco do jogo com a mesma estrutura dele (placar, labirinto de
// 32x11 tiles e, em aparelho de toque, o direcional), para o resto da pagina
// nao pular quando ele carrega.
function Espaco() {
  return (
    <div aria-hidden className="mx-auto w-full max-w-[832px]">
      <div className="h-[52px]" />
      <div className="aspect-[32/11] w-full rounded-md bg-black/40" />
      <div className="mt-5 hidden h-[120px] pointer-coarse:block" />
    </div>
  )
}

export default function JogoNaPagina() {
  const ancora = useRef<HTMLDivElement>(null)
  const [perto, setPerto] = useState(false)

  useEffect(() => {
    const el = ancora.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setPerto(true); obs.disconnect() }
    }, { rootMargin: "400px 0px" })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return <div ref={ancora}>{perto ? <JogoPet /> : <Espaco />}</div>
}
