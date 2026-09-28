import Personagem from "./Personagem"

// A casa dos fantasmas do labirinto do arcade, em volta da contagem do Inicio:
// no jogo, os fantasmas esperam presos nela ate a partida comecar; aqui, ate
// a Season comecar. Geometria do sprite original (56x32): parede dupla, com
// linha de 1 pixel, vao de 2 e outra linha de 1, cantos retos, e em cima uma
// abertura de 16 pixels com a porta rosa de 2 pixels de altura. A casa estica
// com o conteudo; o que e fixo e o pixel (--u), para a linha nao deformar.
// O Blinky, como no jogo, comeca do lado de fora, em cima da porta.
// Aberta (a Season ja comecou): a porta some e os quatro estao do lado de fora.

const AZUL = "bg-[#2121FF]"

const DE_FORA = ["vermelho", "rosa", "ciano", "laranja"] as const

export default function CasaDosFantasmas({ children, aberta = false }: { children: React.ReactNode; aberta?: boolean }) {
  return (
    // No celular a casa encosta nas bordas da pagina: em 280px, com as
    // margens, a contagem nao cabia dentro das paredes.
    <div className="-mx-4 pt-[calc(var(--u)*15)] [--u:2px] min-[360px]:[--u:3px] sm:mx-auto sm:max-w-fit md:[--u:4px]">
      <div className="relative">
        {aberta ? (
          // A partida comecou: todos na rua, em cima da casa.
          <div aria-hidden className="absolute inset-x-0 top-[calc(var(--u)*-15)] flex justify-center gap-[calc(var(--u)*4)]">
            {DE_FORA.map((qual, i) => (
              <Personagem key={qual} qual={qual} olhar={i < 2 ? "esquerda" : "direita"} className="h-[calc(var(--u)*14)] w-[calc(var(--u)*14)]" />
            ))}
          </div>
        ) : (
          // Blinky do lado de fora, em cima da porta.
          <Personagem
            qual="vermelho"
            olhar="esquerda"
            className="absolute left-1/2 top-[calc(var(--u)*-15)] h-[calc(var(--u)*14)] w-[calc(var(--u)*14)] -translate-x-1/2"
          />
        )}

        {/* Parede de fora: laterais e base inteiras, o topo em dois pedacos. */}
        <span aria-hidden className="absolute inset-0 border-[length:var(--u)] border-t-0 border-[#2121FF]" />
        <span aria-hidden className={`absolute left-0 top-0 h-[var(--u)] w-[calc(50%-var(--u)*8)] ${AZUL}`} />
        <span aria-hidden className={`absolute right-0 top-0 h-[var(--u)] w-[calc(50%-var(--u)*8)] ${AZUL}`} />
        {/* Parede de dentro, 3 pixels para dentro. */}
        <span aria-hidden className="absolute inset-[calc(var(--u)*3)] border-[length:var(--u)] border-t-0 border-[#2121FF]" />
        <span aria-hidden className={`absolute left-[calc(var(--u)*3)] top-[calc(var(--u)*3)] h-[var(--u)] w-[calc(50%-var(--u)*11)] ${AZUL}`} />
        <span aria-hidden className={`absolute right-[calc(var(--u)*3)] top-[calc(var(--u)*3)] h-[var(--u)] w-[calc(50%-var(--u)*11)] ${AZUL}`} />
        {/* Os batentes da porta, ligando as duas paredes, e a porta rosa. */}
        <span aria-hidden className={`absolute left-[calc(50%-var(--u)*9)] top-0 h-[calc(var(--u)*4)] w-[var(--u)] ${AZUL}`} />
        <span aria-hidden className={`absolute left-[calc(50%+var(--u)*8)] top-0 h-[calc(var(--u)*4)] w-[var(--u)] ${AZUL}`} />
        {!aberta && <span aria-hidden className="absolute left-[calc(50%-var(--u)*8)] top-[var(--u)] h-[calc(var(--u)*2)] w-[calc(var(--u)*16)] bg-[#FFB7FF]" />}

        <div className="relative px-[calc(var(--u)*8)] pb-[calc(var(--u)*6)] pt-[calc(var(--u)*9)]">
          {children}
          {/* Os outros tres esperam la dentro, subindo e descendo, como no
              jogo (animate-flutua; parados com animacao reduzida). */}
          {!aberta && <div aria-hidden className="mt-[calc(var(--u)*6)] flex justify-center gap-[calc(var(--u)*6)]">
            {(["ciano", "rosa", "laranja"] as const).map((qual, i) => (
              <span key={qual} className="motion-safe:animate-flutua" style={{ animationDelay: `${i * -0.25}s` }}>
                <Personagem qual={qual} olhar="cima" className="h-[calc(var(--u)*14)] w-[calc(var(--u)*14)]" />
              </span>
            ))}
          </div>}
        </div>
      </div>
    </div>
  )
}
