// Os personagens do Pac-Man, com os sprites do arcade original (src/lib/sprites.ts).
// Cada pixel do sprite e uma unidade do viewBox.
import { CORES, DUZENTOS_PATH, FANTASMA, OLHOS, PACMAN_ABERTO, PACMAN_FECHADO, PACMAN_MEIO, ROSTO_ASSUSTADO } from "@/lib/sprites";

export type Personagem = "pacman" | "vermelho" | "rosa" | "ciano" | "laranja" | "assustado" | "olhos" | "duzentos";

const COR_FANTASMA = { vermelho: CORES.vermelho, rosa: CORES.rosa, ciano: CORES.ciano, laranja: CORES.laranja };
const OLHO = CORES.olho;
const PUPILA = CORES.pupila;
const DUZENTOS = DUZENTOS_PATH;

// pendurado: na barra, no desktop, o fantasma fica de cabeca para baixo (quem
// usa vira o desenho); ai os olhos sao os de olhar para cima, que apos a
// virada olham para o link. No celular, ao lado do nome, olham para o lado.
// mastigando: o Pac-Man abre e fecha a boca (animate-boca-meio e
// animate-boca-fechada, em globals.css). Sem animacao, fica aberto.
// olhar: para onde o fantasma olha (fora da barra).
export default function Personagem({ qual, className, pendurado = false, mastigando = false, olhar = "direita" }: { qual: Personagem; className?: string; pendurado?: boolean; mastigando?: boolean; olhar?: keyof typeof OLHOS }) {
  if (qual === "pacman") {
    return (
      <svg viewBox="0 0 13 13" aria-hidden shapeRendering="crispEdges" className={className}>
        <path fill={CORES.pacman} d={PACMAN_ABERTO} />
        {mastigando && (
          <>
            <path className="opacity-0 motion-safe:animate-boca-meio" fill={CORES.pacman} d={PACMAN_MEIO} />
            <path className="opacity-0 motion-safe:animate-boca-fechada" fill={CORES.pacman} d={PACMAN_FECHADO} />
          </>
        )}
      </svg>
    );
  }
  if (qual === "assustado") {
    return (
      <svg viewBox="0 0 14 14" aria-hidden shapeRendering="crispEdges" className={className}>
        <path fill={PUPILA} d={FANTASMA} />
        <path fill={CORES.assustadoRosto} d={ROSTO_ASSUSTADO} />
        {/* Fase branca: pisca algumas vezes quando a pagina abre e some
            (animate-pisca, em globals.css). Sem animacao, fica so o azul. */}
        <g className="opacity-0 motion-safe:animate-pisca">
          <path fill={OLHO} d={FANTASMA} />
          <path fill="#FF0000" d={ROSTO_ASSUSTADO} />
        </g>
      </svg>
    );
  }
  if (qual === "olhos") {
    return (
      <svg viewBox="2 2 12 7" aria-hidden shapeRendering="crispEdges" className={className}>
        <path fill={OLHO} d={OLHOS.direita.branco} />
        <path fill={PUPILA} d={OLHOS.direita.pupila} />
      </svg>
    );
  }
  if (qual === "duzentos") {
    return (
      <svg viewBox="0 0 15 7" aria-hidden shapeRendering="crispEdges" className={className}>
        <path fill="#00FFFF" d={DUZENTOS} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 14 14" aria-hidden shapeRendering="crispEdges" className={className}>
      <path fill={COR_FANTASMA[qual]} d={FANTASMA} />
      <g className={pendurado ? "md:hidden" : undefined}>
        <path fill={OLHO} d={OLHOS[olhar].branco} />
        <path fill={PUPILA} d={OLHOS[olhar].pupila} />
      </g>
      {pendurado && (
        <g className="hidden md:inline">
          <path fill={OLHO} d={OLHOS.cima.branco} />
          <path fill={PUPILA} d={OLHOS.cima.pupila} />
        </g>
      )}
    </svg>
  );
}
