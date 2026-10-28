import { connection } from "next/server"
import FormInscricao from "../components/FormInscricao"
import IconePixel from "../components/IconePixel"
import Personagem from "../components/Personagem"
import { seasonAtual } from "@/lib/conteudo"
import { diaEHora } from "@/lib/datas"
import type { SeasonJson } from "@/models/api"

// Tela de inscricao. Antes seguia o mockup da Season 4 (logo com os fantasmas
// a esquerda, formulario solto a direita, campos creme sem borda); o redesenho
// de 10/2026 segue o que funciona nas inscricoes que o PET e o IntroComp ja usam
// e nas de evento conhecidas (Luma, Sympla): o essencial do evento no topo,
// antes de pedir qualquer dado, e o formulario em etapas num cartao.
//
// A season vem do servidor, como nas outras paginas: o formulario chega pronto
// no HTML, sem "Carregando..." enquanto o navegador busca a API. A situacao
// das inscricoes sai das datas, calculada a cada acesso (connection), para a
// tela mudar na hora em que abrem ou fecham; a API confere de novo ao gravar.
type Situacao = "antes" | "abertas" | "encerradas" | "sem-data"

function situacao(s: SeasonJson): Situacao {
  if (!s.inscricoesAbrem || !s.inscricoesFecham) return "sem-data"
  const agora = Date.now()
  if (agora < new Date(s.inscricoesAbrem).getTime()) return "antes"
  return agora < new Date(s.inscricoesFecham).getTime() ? "abertas" : "encerradas"
}

export default async function Inscricao() {
  await connection()
  const season = await seasonAtual().catch(() => undefined)
  const sit = season ? situacao(season) : null
  const abertas = sit === "abertas"

  return (
    <>
      <section className="relative overflow-hidden bg-barra">
        <div className="mx-auto max-w-[960px] px-6 pb-12 pt-12 md:pb-16 md:pt-16">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-destaque-claro/80">
            {season ? `Season ${season.numero}` : "PET Game Jam"}
          </p>
          <h1 className="font-secao text-7xl uppercase leading-[0.8] text-destaque md:text-8xl">Inscrição</h1>

          {season && (
            <>
              {abertas && (
                <p className="mt-4 max-w-[52ch] text-lg text-white/85">
                  É gratuita e leva uns três minutos. Equipes de 1 a {season.numParticipantesPorEquipe} pessoas.
                </p>
              )}
              <ul className="mt-6 flex flex-col gap-3 text-base text-white/85 sm:flex-row sm:flex-wrap sm:gap-x-8">
                {season.dataEvento && (
                  <li className="flex items-center gap-2.5">
                    <IconePixel qual="calendario" className="h-5 w-5 shrink-0 text-destaque" />
                    <span className="first-letter:uppercase">{diaEHora(season.dataEvento, true)}</span>
                  </li>
                )}
                {season.local && (
                  <li className="flex items-center gap-2.5">
                    <IconePixel qual="local" className="h-5 w-5 shrink-0 text-destaque" />
                    {season.local}
                  </li>
                )}
              </ul>
              {abertas && season.inscricoesFecham && (
                <p className="mt-5 font-bold text-destaque">Inscrições até {diaEHora(season.inscricoesFecham)}</p>
              )}
            </>
          )}
        </div>

        {/* Os fantasmas do jogo, so de enfeite, no canto do cabecalho. */}
        <div aria-hidden className="pointer-events-none absolute bottom-6 right-[6%] hidden items-end gap-5 md:flex">
          <Personagem qual="vermelho" className="h-14 w-14" />
          <Personagem qual="rosa" className="h-14 w-14" />
          <Personagem qual="ciano" className="h-14 w-14" />
          <Personagem qual="laranja" className="h-14 w-14" />
        </div>
      </section>

      <div className="mx-auto w-full max-w-[680px] px-6 pb-24 pt-10 md:pt-14">
        {season === undefined && (
          <Aviso titulo="Não foi possível carregar a inscrição." texto="Tente de novo em alguns minutos." />
        )}

        {season === null && (
          <Aviso titulo="As inscrições ainda não estão abertas." texto="Acompanhe o Instagram @petengcomp para saber quando abrem." />
        )}

        {season && (
          abertas ? (
            <FormInscricao
              numParticipantesPorEquipe={Number(season.numParticipantesPorEquipe) || 3}
              season={{ numero: season.numero, dataEvento: season.dataEvento, local: season.local }}
            />
          ) : (
            <Aviso {...avisoFechada(season, sit!)} />
          )
        )}
      </div>
    </>
  )
}

// Fechada por que? Ainda nao abriu, ja encerrou, ou sem periodo definido.
function avisoFechada(season: SeasonJson, sit: Situacao) {
  if (sit === "antes") {
    return { titulo: `As inscrições abrem em ${diaEHora(season.inscricoesAbrem!)}.`, texto: "Monte sua equipe e volte aqui nesse dia!" }
  }
  if (sit === "encerradas") {
    return { titulo: "As inscrições desta edição foram encerradas.", texto: "Acompanhe o Instagram @petengcomp para saber da próxima." }
  }
  return { titulo: "As inscrições ainda não estão abertas.", texto: "Acompanhe o Instagram @petengcomp para saber quando abrem." }
}

function Aviso({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <div role="status" className="rounded-2xl border border-white/10 bg-barra p-8 text-center">
      <p className="text-2xl font-bold text-destaque">{titulo}</p>
      {texto && <p className="mt-2 text-lg text-destaque-claro">{texto}</p>}
    </div>
  )
}
