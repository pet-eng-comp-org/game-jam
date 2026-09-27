import Link from "next/link"

// Os tres contatos do rodape do mockup (Figma, Season 4, grupo "Barra final").
// Ajustes finos medidos contra o mockup em pixels: no desenho o texto do e-mail
// fica 3px acima do centro do icone, e o icone do YouTube ocupa 50x35 (o SVG
// dele tem mais margem que os outros, entao a caixa e maior).
const contatos = [
  { icone: "/marca/icone-email.svg", texto: "petengcomp@inf.ufes.br", url: "mailto:petengcomp@inf.ufes.br", alt: "E-mail", texto_classe: "md:-translate-y-[3px]", icone_classe: "md:h-[57px] md:w-[57px]" },
  { icone: "/marca/icone-instagram.svg", texto: "@petengcomp", url: "https://www.instagram.com/petengcomp/", alt: "Instagram", texto_classe: "", icone_classe: "md:h-[57px] md:w-[57px]" },
  { icone: "/marca/icone-youtube.svg", texto: "PET Eng Comp Ufes", url: "https://www.youtube.com/@PETEngCompUFES", alt: "YouTube", texto_classe: "md:-ml-[2px]", icone_classe: "md:h-[60px] md:w-[60px]" },
]

export default function Footer() {

  // O ano vinha cravado como 2025 e envelheceu sozinho. Aqui ele e resolvido na
  // construcao do site, entao acompanha os deploys sem ninguem lembrar. Se o
  // site passar um ano inteiro sem deploy o valor congela — mas ai o problema e
  // outro.
  const ano = new Date().getFullYear()

  // Medidas do mockup (Figma, Season 4, grupo "Barra final"), a partir do topo
  // do rodape: logo em x=94 y=94; contatos em linhas de 57px a partir de y=60,
  // texto 17px depois do icone, terminando 73px antes da borda; linha branca
  // em y=314; credito 30px abaixo dela, e 86px de faixa ate o fim.
  return (
    <footer className="mt-24 w-full bg-barra">

      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 px-9 py-16 md:h-[314px] md:flex-row md:items-start md:justify-between md:gap-0 md:py-0 md:pl-[94px] md:pr-[73px]">

        {/* A logo e do PET: leva ao site do PET, e nao ao inicio do Game Jam. */}
        <a href="https://pet.inf.ufes.br" target="_blank" rel="noopener noreferrer" aria-label="Site do PET Engenharia de Computação" className="md:mt-[94px]">
          <img
            src="/marca/logo-pet.svg"
            alt="PET Engenharia de Computação — UFES"
            className="w-[200px] md:w-[274px]"
          />
        </a>

        <ul className="flex flex-col gap-4 md:mt-[60px] md:gap-[5px]">
          {contatos.map((c) => (
            <li key={c.url}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 transition-opacity hover:opacity-70 md:h-[57px] md:gap-[17px]"
              >
                <img src={c.icone} alt="" aria-hidden className={`h-[42px] w-[42px] shrink-0 ${c.icone_classe}`} />
                {/* Inter 24, peso 500, espacamento -1,44px (-0,06em), como no mockup. */}
                <span className={`text-lg font-medium tracking-[-0.06em] text-white md:text-2xl md:leading-[29px] ${c.texto_classe}`}>{c.texto}</span>
                <span className="sr-only">{c.alt}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Linha do mockup: branca, 1px, de ponta a ponta. O credito do mockup era
          em ingles ("Created by... All rights reserved") e cinza sobre o azul,
          com contraste de 2:1; aqui vai em portugues e legivel (8:1). */}
      <div className="w-full border-t border-white">
        <p className="px-4 py-6 text-center text-sm tracking-[-0.005em] text-destaque-claro/80 md:flex md:h-[86px] md:items-start md:justify-center md:gap-2 md:py-0 md:pt-[26px]">
          <span>© {ano} PET Engenharia de Computação · Ufes</span>
          <span aria-hidden className="hidden md:inline">·</span>
          <Link href="/privacidade" className="block underline hover:text-destaque md:inline">Privacidade</Link>
        </p>
      </div>
    </footer>
  );
}
