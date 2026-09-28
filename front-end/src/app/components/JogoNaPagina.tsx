"use client"

// O jogo so carrega no navegador e depois da pagina: o codigo dele (motor,
// sprites, canvas) nao pesa na primeira carga do Inicio.
import dynamic from "next/dynamic"

const JogoPet = dynamic(() => import("./JogoPet"), {
  ssr: false,
  // Guarda o espaco do labirinto (32x11 tiles) para a pagina nao pular.
  loading: () => <div className="aspect-[32/14] w-full rounded-md bg-black/40" aria-hidden />,
})

export default function JogoNaPagina() {
  return <JogoPet />
}
