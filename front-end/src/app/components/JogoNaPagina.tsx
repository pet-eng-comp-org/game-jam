"use client"

// O jogo so carrega quando a pessoa rola ate perto dele: o codigo (motor,
// sprites, canvas) e o primeiro desenho do labirinto nao pesam na abertura do
// Inicio, onde o que importa e a data. Medido no Lighthouse: o jogo carregado
// de cara custava ~800 ms de processamento no celular simulado.
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const JogoPet = dynamic(() => import("./JogoPet"), { ssr: false, loading: () => <Espaco /> })

// Guarda o espaco do labirinto (32x11 tiles, mais o placar) para a pagina
// nao pular quando o jogo aparece.
function Espaco() {
  return <div className="mx-auto aspect-[32/15] w-full max-w-[832px] rounded-md bg-black/40" aria-hidden />
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
