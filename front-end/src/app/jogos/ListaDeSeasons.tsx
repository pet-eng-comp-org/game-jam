"use client"

// A lista de seasons com os jogos, que abre e fecha no navegador. Os dados vem
// prontos da pagina (servidor).
import { useState } from "react"
import Link from "next/link"
import Titulo from "../components/Titulo"
import { capaDoJogo, listaDeIntegrantes } from "@/lib/capa"
import type { SeasonComJogosJson } from "@/models/api"

export default function ListaDeSeasons({ temporadas }: { temporadas: SeasonComJogosJson[] }) {

  // Um CONJUNTO, e nao uma season so: da para deixar varias abertas ao mesmo
  // tempo e comparar edicoes sem ficar fechando uma para ver a outra. Todas
  // comecam fechadas — quem chega escolhe, que e o que o titulo pede.
  const [abertas, setAbertas] = useState<Set<string>>(new Set())

  function alterna(numero: string) {

    setAbertas((atual) => {

      // Copia antes de mexer: mutar o Set existente nao troca a referencia e o
      // React nao redesenha.
      const proximo = new Set(atual)
      if (proximo.has(numero)) proximo.delete(numero)
      else proximo.add(numero)
      return proximo
    })
  }

  return (

      <div className="mx-auto w-[93%] max-w-[1340px] pt-[98px] pb-10">

        {/* O titulo do mockup era "Selecione uma opcao". Troquei para dizer o que
            a pagina e: os jogos das edicoes no formato antigo, que a Season 4
            abandonou. */}
        <div className="md:pl-[93px]">
          <Titulo valor="EDIÇÕES ANTERIORES" />
          <p className="mt-[30px] max-w-[1000px] text-lg leading-9">
            Nas Seasons 1 a 3, o Game Jam tinha outro formato: cada equipe tinha algumas
            semanas para criar um jogo do zero, sobre um tema divulgado no início. Estes são
            os jogos dessas edições, e todos rodam no navegador: é só clicar na capa. A Season 4 muda o formato:{" "}
            <Link href="/" className="text-destaque underline">veja como funciona</Link>.
          </p>
        </div>

        {/* Medido contra o mockup em pixels: letras de "SEASON" a cada 56px, a
            primeira em y=318. */}
        <div className="mt-[53px]">
          {temporadas.map((t) => {

            const estaAberta = abertas.has(t.numero)

            return (
              <div key={t.numero} className="border-b border-destaque-claro">

                <h2>
                  <button
                    type="button"
                    onClick={() => alterna(t.numero)}
                    aria-expanded={estaAberta}
                    aria-controls={`season-${t.numero}`}
                    className="flex w-full flex-wrap items-center pt-[7px] pb-2 pl-2 text-left md:flex-nowrap md:pb-0 md:pl-[121px] font-secao text-4xl uppercase leading-none text-destaque transition-opacity hover:opacity-80 md:text-5xl"
                  >
                    <span className="whitespace-nowrap md:w-[129px]">Season {t.numero}</span>
                    <span aria-hidden className={`flex w-[26px] shrink-0 items-center justify-center leading-[0] ${estaAberta ? "-translate-y-[2px]" : "-translate-y-[4.5px]"}`}>
                    <svg
                      viewBox="13.3 11.51 15.04 25.99"
                      className={`h-[26px] w-[15px] transition-transform duration-200 ${estaAberta ? "rotate-90" : ""}`}
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M27.7372 25.9513L16.1875 37.501L13.3005 34.6141L23.4068 24.5078L13.3005 14.4016L16.1875 11.5146L27.7372 23.0644C28.1199 23.4472 28.3349 23.9664 28.3349 24.5078C28.3349 25.0492 28.1199 25.5684 27.7372 25.9513Z"
                        fill="currentColor"
                      />
                    </svg>
                    </span>
                    {/* Ano e tema da edicao, editaveis no painel: dizem de onde vem
                        cada jogo, ja que o formato dessas edicoes era outro. */}
                    {(t.ano || t.tema) && (
                      <span className="basis-full font-sans text-base normal-case leading-snug text-destaque-claro md:ml-8 md:basis-auto md:text-xl">
                        {[t.ano, t.tema && `tema: ${t.tema}`].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </button>
                </h2>

                {estaAberta && (
                  <ul id={`season-${t.numero}`} className="flex flex-col gap-12 pb-14 pt-10 pl-2 md:gap-[70px] md:pt-[68px] md:pl-[101px]">
                    {t.jogos.map((j) => {
                      const integrantes = listaDeIntegrantes(j.integrantes)
                      return (
                      <li key={j.id} className="grid gap-8 lg:grid-cols-[538px_528px] lg:items-center lg:gap-[72px]">

                        <a
                          href={j.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block rounded-xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-destaque"
                        >
                          {/* O link e so a capa. O alt diz o que ele FAZ, e nao
                              o que a imagem mostra: quem usa leitor de tela
                              ouve "Jogar X", que e a acao. */}
                          <img
                            src={capaDoJogo(j.capa)}
                            alt={`Jogar ${j.nome ?? j.equipe}`}
                            className="w-full rounded-xl border border-destaque-claro/20 transition duration-200 group-hover:border-destaque group-hover:brightness-110 lg:h-[421px] lg:object-cover"
                            loading="lazy"
                          />
                        </a>

                        {/* No mockup o texto fica centrado na altura da capa. */}
                        <div>
                          <h3 className="text-2xl font-bold text-destaque md:text-[34px] md:leading-[42px]">{j.nome ?? j.equipe}</h3>
                          {j.nome && j.equipe && <p className="mt-[6px] font-bold md:text-[29px] md:leading-[35px]">por {j.equipe}</p>}
                          {j.descricao
                            ? <p className="mt-[32px] text-base md:text-[29px] md:leading-[35px]">{j.descricao}</p>
                            : integrantes.length > 0 && <p className="mt-[32px] text-base md:text-[29px] md:leading-[35px]">{integrantes.join(" · ")}</p>}
                        </div>
                      </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
  )
}
