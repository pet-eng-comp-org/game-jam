import Link from "next/link"

// Os tres contatos do rodape do mockup (Figma, Season 4, grupo "Barra final").
const contatos = [
  { icone: "/marca/icone-email.svg", texto: "petengcomp@inf.ufes.br", url: "mailto:petengcomp@inf.ufes.br", alt: "E-mail" },
  { icone: "/marca/icone-instagram.svg", texto: "@petengcomp", url: "https://www.instagram.com/petengcomp/", alt: "Instagram" },
  { icone: "/marca/icone-youtube.svg", texto: "PET Eng Comp Ufes", url: "https://www.youtube.com/@PETEngCompUFES", alt: "YouTube" },
]

export default function Footer() {

  // O ano vinha cravado como 2025 e envelheceu sozinho. Aqui ele e resolvido na
  // construcao do site, entao acompanha os deploys sem ninguem lembrar. Se o
  // site passar um ano inteiro sem deploy o valor congela — mas ai o problema e
  // outro.
  const ano = new Date().getFullYear()

  return (
    <footer className="mt-24 w-full bg-barra">

      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 px-9 py-16 md:flex-row md:justify-between md:gap-0">

        <Link href="/" aria-label="PET Engenharia de Computação">
          <img
            src="/marca/logo-pet.svg"
            alt="PET Engenharia de Computação — UFES"
            className="w-[200px] md:w-[274px]"
          />
        </Link>

        <ul className="flex flex-col gap-6">
          {contatos.map((c) => (
            <li key={c.url}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 transition-opacity hover:opacity-70"
              >
                <img src={c.icone} alt="" aria-hidden className="h-[42px] w-[42px] shrink-0 md:h-[57px] md:w-[57px]" />
                <span className="text-lg font-medium text-white md:text-2xl">{c.texto}</span>
                <span className="sr-only">{c.alt}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* A linha e o credito ficam abaixo de uma divisoria, como no mockup. */}
      {/* Linha do mockup: branca, 1px ("Barra final", Line). */}
      <div className="mx-auto max-w-[1454px] border-t border-white px-9">
        <p className="py-6 text-center text-sm text-tenue">
          Created by PET Engenharia de Computação&nbsp;&nbsp;·&nbsp;&nbsp;{ano}&nbsp;&nbsp;·&nbsp;&nbsp;All rights reserved
        </p>
      </div>
    </footer>
  );
}
