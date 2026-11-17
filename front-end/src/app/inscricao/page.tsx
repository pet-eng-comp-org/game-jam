import Link from "next/link"
import IconePixel from "../components/IconePixel"
import Personagem from "../components/Personagem"
import { jaPassou } from "@/lib/datas"
import { DIAS, EMAIL_DE_INSCRICAO, EMAILS, FIM, horario, LOCAL, NOME, periodo, quando } from "@/lib/edicao"

// Inscricao do Game Jam 26: por pessoa e so por e-mail (decisao da organizacao,
// 12/11/2026). A pagina diz o que escrever e para quem, e o botao abre o e-mail
// ja preenchido. Os enderecos ficam a vista, para quem nao tem aplicativo de
// e-mail no computador e precisa copiar.
//
// Gerada de novo a cada 5 minutos, para mudar sozinha quando o evento acabar.
export const revalidate = 300

export default function Inscricao() {
  const acabou = jaPassou(FIM)

  return (
    <>
      <section className="relative overflow-hidden bg-barra">
        <div className="mx-auto max-w-[960px] px-6 pb-12 pt-12 md:pb-16 md:pt-16">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-destaque-claro/80">{NOME}</p>
          <h1 className="font-secao text-7xl uppercase leading-[0.8] text-destaque md:text-8xl">Inscrição</h1>

          <ul className="mt-6 flex flex-col gap-3 text-base text-white/85 sm:flex-row sm:flex-wrap sm:gap-x-8">
            <li className="flex items-center gap-2.5">
              <IconePixel qual="calendario" className="h-5 w-5 shrink-0 text-destaque" />
              {periodo()}
            </li>
            <li className="flex items-center gap-2.5">
              <IconePixel qual="local" className="h-5 w-5 shrink-0 text-destaque" />
              {LOCAL}
            </li>
          </ul>
        </div>

        {/* Os fantasmas do jogo, so de enfeite, no canto do cabecalho. */}
        <div aria-hidden className="pointer-events-none absolute bottom-6 right-[6%] hidden items-end gap-5 md:flex">
          <Personagem qual="vermelho" className="h-14 w-14" />
          <Personagem qual="rosa" className="h-14 w-14" />
          <Personagem qual="ciano" className="h-14 w-14" />
          <Personagem qual="laranja" className="h-14 w-14" />
        </div>
      </section>

      {/* Mesma coluna do cabecalho (960px), com o texto em ate 680px, alinhado
          a esquerda: antes o corpo centralizado ficava 140px dentro do titulo. */}
      <div className="mx-auto w-full max-w-[960px] px-6 pb-24 pt-10 md:pt-14">
      <div className="max-w-[680px]">
        {acabou ? (
          <div role="status" className="rounded-2xl border border-white/10 bg-barra p-8 text-center">
            <p className="text-2xl font-bold text-destaque">O {NOME} terminou.</p>
            <p className="mt-2 text-lg text-destaque-claro">Acompanhe o Instagram @petengcomp para saber da próxima edição.</p>
          </div>
        ) : (
          <>
            <p className="text-lg text-destaque-claro">
              A inscrição é por pessoa e por e-mail. Para garantir seu lugar, escreva até a
              véspera do dia em que você vai, com o seu nome e os dias.
            </p>

            <a href={EMAIL_DE_INSCRICAO}
              className="mt-8 inline-block rounded-full bg-destaque px-7 py-4 text-lg font-bold text-barra transition-opacity hover:opacity-90">
              Escrever o e-mail de inscrição
            </a>

            <p className="mt-6 text-base text-destaque-claro">
              Ou escreva direto para{" "}
              <span className="font-bold text-white [overflow-wrap:anywhere]">{EMAILS[0]}</span> ou{" "}
              <span className="font-bold text-white [overflow-wrap:anywhere]">{EMAILS[1]}</span>.
            </p>

            <h2 className="mt-12 text-xl font-bold text-destaque">Os dias</h2>
            <ul className="mt-4 space-y-3">
              {DIAS.map((d) => (
                <li key={d.numero} className="rounded-2xl border border-white/10 bg-barra px-5 py-4">
                  <p className="font-bold">
                    Dia {d.numero}: {d.atividade}
                  </p>
                  <p className="mt-1 text-base text-destaque-claro">
                    <span className="first-letter:uppercase inline-block">{quando(d)}</span>, {horario(d)}, {d.sala}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-base text-destaque-claro">
              Quem aparecer no dia sem avisar participa se houver computador livre. Não precisa
              levar nada. Quem tem menos de 18 anos se inscreve com o conhecimento de um
              responsável. Mais detalhes nas{" "}
              <Link href="/regras" className="text-destaque underline">Regras</Link>; o que fazemos
              com os seus dados está em{" "}
              <Link href="/privacidade" className="text-destaque underline">Privacidade</Link>.
            </p>
          </>
        )}
      </div>
      </div>
    </>
  )
}
