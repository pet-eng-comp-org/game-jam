// Os jogos das edicoes antigas, todos a vista: uma secao por season, da mais
// nova para a mais antiga, e os jogos em grade. Antes cada season era uma
// sanfona fechada, e quem chegava via tres linhas em vez dos jogos.
import Link from "next/link"
import Titulo from "../components/Titulo"
import TituloSecao from "../components/TituloSecao"
import Personagem from "../components/Personagem"
import { PAGINA, SECAO, TEXTO } from "../components/estilo"
import { capaDoJogo, listaDeIntegrantes } from "@/lib/capa"
import type { SeasonComJogosJson } from "@/models/api"

// "Ana, Bia e Caio": a lista de integrantes escrita como frase.
const emFrase = (nomes: string[]) =>
  nomes.length < 2 ? nomes.join("") : `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`

// No celular a descricao para na quarta linha; o jogo e o que conta.
const DESCRICAO = "mt-2 line-clamp-4 text-sm leading-snug sm:mt-3 sm:line-clamp-none sm:text-base sm:leading-relaxed"

export default function ListaDeSeasons({ temporadas }: { temporadas: SeasonComJogosJson[] }) {
  return (
    <div className={PAGINA}>
      <Titulo valor="edições anteriores" />
      <p className={`mt-6 ${TEXTO}`}>
        Nas Seasons 1 a 3, cada equipe tinha algumas semanas para criar um jogo do zero,
        sobre um tema. Todos rodam no navegador: é só escolher um. A Season 4 muda o
        formato:{" "}
        <Link href="/" className="text-destaque underline">veja como funciona</Link>.
      </p>

      {temporadas.map((t) => (
        <section key={t.numero} aria-labelledby={`season-${t.numero}`} className={SECAO}>
          <div id={`season-${t.numero}`}>
            <TituloSecao valor={`Season ${t.numero}`} />
          </div>
          {/* Ano e tema, editaveis no painel: dizem de onde vem cada jogo. */}
          {(t.ano || t.tema) && (
            <p className="mt-2 text-lg text-destaque-claro">
              {[t.ano, t.tema && `tema “${t.tema}”`].filter(Boolean).join(" · ")}
            </p>
          )}

          <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3">
            {t.jogos.map((j) => {
              const nome = j.nome ?? j.equipe
              const integrantes = listaDeIntegrantes(j.integrantes)
              return (
                // O cartao inteiro e clicavel pelo link do nome (after:inset-0),
                // e o leitor de tela ouve so o nome e a acao, nao o cartao todo.
                <li
                  key={j.id}
                  className="group relative grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start gap-x-4 rounded-xl outline-offset-8 has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-destaque sm:block"
                >
                  <img
                    src={capaDoJogo(j.capa)}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-xl border-2 border-destaque-claro/20 object-cover transition-colors duration-200 group-hover:border-destaque"
                  />
                  {/* No celular, capa a esquerda e texto a direita: em coluna unica
                      cada jogo ocupava uma tela inteira. */}
                  <div>
                  {/* O Pac-Man e o cursor, como no menu de um fliperama: aparece
                      mastigando ao lado do jogo escolhido. */}
                  <h3 className="flex items-center text-lg font-bold leading-tight text-destaque sm:mt-5 sm:text-2xl">
                    <span aria-hidden className="w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:mr-3 group-hover:w-6 group-hover:opacity-100 group-has-[a:focus-visible]:mr-3 group-has-[a:focus-visible]:w-6 group-has-[a:focus-visible]:opacity-100">
                      <Personagem qual="pacman" mastigando className="h-6 w-6" />
                    </span>
                    <a
                      href={j.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="outline-none after:absolute after:inset-0 after:content-['']"
                    >
                      {nome}
                      <span className="sr-only"> (jogar no navegador, abre em outra aba)</span>
                    </a>
                  </h3>
                  {j.nome && j.equipe && <p className="mt-1 text-sm font-bold text-destaque-claro/90 sm:text-base">por {j.equipe}</p>}
                  {j.descricao
                    ? <p className={DESCRICAO}>{j.descricao}</p>
                    : integrantes.length > 0 && <p className={DESCRICAO}>{emFrase(integrantes)}</p>}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
