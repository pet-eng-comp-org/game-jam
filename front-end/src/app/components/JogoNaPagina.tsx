"use client"

// O jogo so carrega quando a pessoa rola ate perto dele: o codigo (motor,
// sprites, canvas) e o primeiro desenho do labirinto nao pesam na abertura do
// Inicio, onde o que importa e a data. Medido no Lighthouse: o jogo carregado
// de cara custava ~800 ms de processamento no celular simulado.
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const JogoPet = dynamic(() => import("./JogoPet"), { ssr: false, loading: () => <Espaco /> })

// Guarda o espaco do jogo com a proporcao dele (35x23 tiles: o labirinto de
// 35x19 e as faixas do placar e das vidas), para o resto da pagina nao pular
// quando ele carrega.
function Espaco() {
  return (
    <div aria-hidden className="mx-auto w-full max-w-[910px]">
      <div className="aspect-[35/23] w-full rounded-md bg-black/40" />
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

  // No celular o jogo vai de borda a borda (sai da margem de 24 px da pagina):
  // o tile passa de 9 para 11 px num celular de 390 px.
  return <div ref={ancora} className="-mx-6 sm:mx-0">{perto ? <JogoPet /> : <Espaco />}</div>
}
