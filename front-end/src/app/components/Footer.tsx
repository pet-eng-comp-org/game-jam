import Link from "next/link"

// Rodape compacto, no padrao de tres colunas (marca, navegacao, contato) com
// uma faixa final. O do mockup tinha 400px de altura, com icones de 57px e
// texto de 24px, para uma logo e tres contatos: quase meia tela de notebook.
const contatos = [
  { icone: "/marca/icone-email.svg", texto: "petengcomp@inf.ufes.br", url: "mailto:petengcomp@inf.ufes.br", alt: "E-mail" },
  { icone: "/marca/icone-instagram.svg", texto: "@petengcomp", url: "https://www.instagram.com/petengcomp/", alt: "Instagram" },
  { icone: "/marca/icone-youtube.svg", texto: "PET Eng Comp Ufes", url: "https://www.youtube.com/@PETEngCompUFES", alt: "YouTube" },
]

// Para quem chega ao fim de uma pagina longa (Jogos, Regras) ir a outra sem
// subir ate a barra.
const paginas = [
  { label: "Início", url: "/" },
  { label: "Jogos", url: "/jogos" },
  { label: "Regras", url: "/regras" },
  { label: "Materiais", url: "/materiais" },
  { label: "Inscrição", url: "/inscricao" },
]

const TITULO = "mb-3 text-sm font-bold uppercase tracking-wider text-destaque"

export default function Footer() {

  // O ano vinha cravado como 2025 e envelheceu sozinho. Aqui ele e resolvido na
  // construcao do site, entao acompanha os deploys sem ninguem lembrar.
  const ano = new Date().getFullYear()

  return (
    <footer className="mt-24 w-full bg-barra">

      <div className="mx-auto grid max-w-[1154px] gap-8 px-9 py-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8 md:px-0 md:w-[80%]">

        <div>
          {/* A logo e do PET: leva ao site do PET, e nao ao inicio do Game Jam. */}
          <a href="https://pet.inf.ufes.br" target="_blank" rel="noopener noreferrer" aria-label="Site do PET Engenharia de Computação" className="inline-block transition-opacity hover:opacity-80">
            <img src="/marca/logo-pet.svg" alt="PET Engenharia de Computação — UFES" className="w-[150px]" />
          </a>
          <p className="mt-4 max-w-[320px] text-sm leading-6 text-destaque-claro/80">
            O Game Jam é organizado pelo PET Engenharia de Computação da Ufes.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <p className={TITULO}>Páginas</p>
          <ul className="grid w-max grid-cols-2 gap-x-10 gap-y-2">
            {paginas.map((p) => (
              <li key={p.url}>
                <Link href={p.url} className="text-destaque-claro transition-colors hover:text-destaque">{p.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={TITULO}>Contato</p>
          <ul className="space-y-2">
            {contatos.map((c) => (
              <li key={c.url}>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white transition-opacity hover:opacity-70">
                  <img src={c.icone} alt="" aria-hidden className="h-[22px] w-[22px] shrink-0" />
                  <span>{c.texto}</span>
                  <span className="sr-only">{c.alt}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full border-t border-white/20">
        <p className="mx-auto flex max-w-[1154px] flex-col items-center gap-1 px-4 py-4 text-center text-sm text-destaque-claro/80 md:flex-row md:justify-center md:gap-2">
          <span>© {ano} PET Engenharia de Computação · Ufes</span>
          <span aria-hidden className="hidden md:inline">·</span>
          <Link href="/privacidade" className="underline hover:text-destaque">Privacidade</Link>
        </p>
      </div>
    </footer>
  );
}
