import Link from "next/link";
import Layout from "./components/Layout";
import TituloSecao from "./components/TituloSecao";
import { APOS_TITULO, PAGINA, SECAO, TEXTO } from "./components/estilo";
import Contagem from "./components/Contagem";
import EventoParaBusca from "./components/EventoParaBusca";
import IconePixel from "./components/IconePixel";
import { dataEHora, dataPorExtenso, listaDeLinguagens, seasonAtual } from "@/lib/conteudo";

export default async function Home() {

  const season = await seasonAtual();
  const pessoas = season ? Number(season.numParticipantesPorEquipe) || 3 : 3;
  const extenso = ["", "uma", "duas", "três", "quatro", "cinco", "seis"][pessoas] ?? String(pessoas);
  const periodo = season?.inscricoesAbrem && season?.inscricoesFecham
    ? `de ${dataEHora(season.inscricoesAbrem)} a ${dataEHora(season.inscricoesFecham)}`
    : "em breve";
  // "sábado, 28 de novembro, às 12h": dia e hora do inicio, sem o ano (e o da
  // edicao).
  const inicioDoEvento = season?.dataEvento
    ? (() => {
        const d = new Date(season.dataEvento);
        const dia = d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Sao_Paulo" });
        const [h, m] = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).split(":");
        // Frase, e nao "dia · hora". O espaco inseparavel antes da hora impede
        // que ela quebre sozinha para a linha de baixo.
        return `${dia}, às\u00a0${Number(h)}h${m === "00" ? "" : m}`;
      })()
    : null;

  return (

    <Layout>
      <EventoParaBusca season={season} />

      <div className={PAGINA}>

        {/* Abertura: quem chega sabe na hora que e a Season 4 e quanto falta para
            a competicao. A data e a hora vem do painel; sem elas, so o formato.
            A inscricao fica no botao da barra, sempre visivel. */}
        <section className="text-center">
          <h1 className="text-balance font-secao text-5xl uppercase leading-none text-destaque md:text-7xl">
            {inicioDoEvento ? `A Season ${season?.numero ?? "4"} começa em` : `Season ${season?.numero ?? "4"}`}
          </h1>
          {season?.dataEvento && inicioDoEvento ? (
            <>
              <div className="mt-8">
                <Contagem inicio={season.dataEvento} rotuloData={inicioDoEvento} />
              </div>
              {/* Quando e onde numa linha, como informacao do evento. Tocar no
                  local abre o mapa: quem vem de fora nao sabe onde fica o CT. */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg">
                <span className="flex items-center gap-2">
                  <IconePixel qual="calendario" className="h-4 w-4 text-destaque" />
                  {inicioDoEvento.charAt(0).toUpperCase() + inicioDoEvento.slice(1)}
                </span>
                {season.local && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${season.local}, Vitória - ES`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 underline decoration-destaque/50 underline-offset-4 hover:text-destaque"
                  >
                    <IconePixel qual="local" className="h-[18px] w-[14px] text-destaque" />
                    {season.local}
                  </a>
                )}
              </div>
            </>
          ) : (
            <p className="mt-4 text-xl text-destaque-claro">Competição de programação em equipes, em um único dia. Data em breve.</p>
          )}
        </section>

        <section className={SECAO}>
          <TituloSecao valor="O que é o Game Jam" />
          <p className={`${APOS_TITULO} ${TEXTO}`}>
            É uma competição de programação em equipes do PET Engenharia de Computação da
            Ufes. Em um único dia, cada equipe recebe um jogo preparado especialmente para o
            evento e usa programação para implementar parte da lógica dele.
          </p>
          {/* A Season 4 e a primeira neste formato: sem este aviso, os jogos das
              outras edicoes (em /jogos) pareciam o que se faz na competicao. */}
          <p className={`mt-4 ${TEXTO}`}>
            A Season 4 estreia esse formato. Nas três primeiras edições, o Game Jam era uma
            maratona de algumas semanas em que cada equipe criava um jogo do zero, sobre
            um tema. Os jogos criados nessas edições estão em{" "}
            <Link href="/jogos" className="text-destaque underline">Jogos</Link>.
          </p>
        </section>

        <section className={SECAO}>
          <TituloSecao valor="Como funciona" />
          <p className={`${APOS_TITULO} ${TEXTO}`}>
            Nem tudo é revelado antes da competição: no início do dia são apresentadas as
            regras completas, o ambiente e o que é preciso para começar. A partir daí, cada
            equipe interpreta o problema, discute a estratégia e transforma ideias em código,
            contra o tempo. Mais do que escrever código, o desafio põe à prova interpretação de
            problemas, raciocínio lógico, trabalho em equipe e adaptação ao inesperado.
          </p>
        </section>

        <section className={SECAO}>
          <TituloSecao valor="Como participar" />
          <p className={`${APOS_TITULO} ${TEXTO}`}>
            Monte uma equipe de até {extenso} {pessoas === 1 ? "pessoa" : "pessoas"} e faça a inscrição aqui no site quando as
            inscrições abrirem. Cada equipe precisa de um nome, então escolham um bom!
          </p>
          {/* So o que o texto acima nao diz: formato, duracao e desafio ja estao
              nas secoes anteriores. */}
          <dl className={`mt-6 space-y-2 ${TEXTO}`}>
            <div><dt className="inline font-bold">Data: </dt><dd className="inline">{dataPorExtenso(season?.dataEvento) ?? "em breve"}</dd></div>
            <div><dt className="inline font-bold">Local: </dt><dd className="inline">{season?.local ?? "em breve"}</dd></div>
            <div><dt className="inline font-bold">Inscrições: </dt><dd className="inline">{periodo}</dd></div>
            <div><dt className="inline font-bold">Linguagens permitidas: </dt><dd className="inline">{listaDeLinguagens(season?.linguagens) ?? "em breve"}</dd></div>
          </dl>
        </section>
      </div>
    </Layout>
  );
}
