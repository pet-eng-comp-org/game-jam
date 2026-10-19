import Link from "next/link"
import { connection } from "next/server"
import FormInscricao from "../components/FormInscricao"
import { seasonAtual } from "@/lib/conteudo"
import { diaEHora } from "@/lib/datas"
import type { SeasonJson } from "@/models/api"

// Tela "Inscricoes" do mockup (Figma, Season 4, pagina Site, frame 220:51):
// logo com os fantasmas a esquerda, titulo e formulario a direita, com a
// barra, o rodape e o fundo das outras paginas (em layout.tsx).
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

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-6 pb-24 pt-14 lg:flex-row lg:items-start lg:justify-center lg:gap-[90px] lg:px-16 lg:pt-[98px]">

        {/* So no computador, acompanhando a rolagem do formulario: no celular
            a barra ja tem a logo, e o quadro empurrava o formulario para baixo. */}
        <div className="hidden shrink-0 justify-center lg:sticky lg:top-[calc(50vh-175px)] lg:flex lg:w-[497px]">
          <Link href="/" aria-label="Voltar ao início do Game Jam">
            {/* Sem a faixa "Season IV" do Figma: ela prendia a logo a uma edicao.
                O numero da season fica no titulo, ao lado. */}
            <img src="/marca/quadro-game-jam.svg" alt="PET Game Jam" className="h-[431px]" />
          </Link>
        </div>

        <div className="flex w-full max-w-[555px] flex-col lg:pt-[60px]">
          <h1 className="text-center font-secao text-5xl uppercase leading-none text-[#FFD935] md:text-7xl lg:text-8xl">
            inscrições
          </h1>
          {/* A edicao numa frase embaixo do titulo, e nao numa etiqueta em caixa
              alta em cima dele. Vem do painel. */}
          <p className="mb-10 mt-2 text-balance text-center text-lg text-destaque-claro lg:mb-[64px]">
            {season ? subtitulo(season, sit === "abertas") : " "}
          </p>

          {season === undefined && (
            <Aviso titulo="Não foi possível carregar a inscrição." texto="Tente de novo em alguns minutos." />
          )}

          {season === null && (
            <Aviso titulo="As inscrições ainda não estão abertas." texto="Acompanhe o Instagram @petengcomp para saber quando abrem." />
          )}

          {season && (
            sit === "abertas" ? (
              <FormInscricao
                numParticipantesPorEquipe={Number(season.numParticipantesPorEquipe) || 3}
                season={{ numero: season.numero, dataEvento: season.dataEvento, local: season.local }}
              />
            ) : (
              <Aviso {...avisoFechada(season, sit!)} />
            )
          )}
        </div>
    </div>
  )
}

// Com as inscricoes abertas, o prazo e o tamanho da equipe: o que a pessoa
// precisa saber antes de comecar. Fechadas, so a edicao.
function subtitulo(season: SeasonJson, abertas: boolean) {
  if (!abertas || !season.inscricoesFecham) return `Para a Season ${season.numero} do Game Jam.`
  return `Para a Season ${season.numero}, até ${diaEHora(season.inscricoesFecham)}. Equipes de 1 a ${season.numParticipantesPorEquipe} pessoas.`
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
    <div role="status" className="rounded-[21px] bg-barra/90 p-8 text-center">
      <p className="text-2xl font-bold text-destaque">{titulo}</p>
      {texto && <p className="mt-2 text-lg text-destaque-claro">{texto}</p>}
    </div>
  )
}
