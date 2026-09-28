import Link from "next/link";
import Layout from "./components/Layout";
import TituloSecao from "./components/TituloSecao";
import { APOS_TITULO, PAGINA, SECAO, TEXTO } from "./components/estilo";
import Contagem from "./components/Contagem";
import CasaDosFantasmas from "./components/CasaDosFantasmas";
import JogoNaPagina from "./components/JogoNaPagina";
import SalvarNaAgenda from "./components/SalvarNaAgenda";
import EventoParaBusca from "./components/EventoParaBusca";
import IconePixel from "./components/IconePixel";
import { seasonAtual } from "@/lib/conteudo";
import { dia, diaEHora, jaPassou } from "@/lib/datas";

export default async function Home() {

  const season = await seasonAtual();
  const pessoas = season ? Number(season.numParticipantesPorEquipe) || 3 : 3;
  const extenso = ["", "uma", "duas", "três", "quatro", "cinco", "seis"][pessoas] ?? String(pessoas);
  // "sábado, 28 de novembro, às 12h": dia e hora do inicio.
  const inicioDoEvento = season?.dataEvento ? diaEHora(season.dataEvento, true) : null;

  // A frase acompanha a situacao das inscricoes: antes dizia "quando as
  // inscricoes abrirem" mesmo com elas abertas.
  const equipe = `Monte uma equipe de até ${extenso} ${pessoas === 1 ? "pessoa" : "pessoas"}`;
  const inscricao = (() => {
    switch (season?.situacaoInscricoes) {
      case "abertas": return `${equipe} e faça a inscrição aqui no site até ${diaEHora(season.inscricoesFecham!)}.`;
      case "antes": return `${equipe} e faça a inscrição aqui no site a partir de ${dia(season.inscricoesAbrem!)}.`;
      case "encerradas": return `As inscrições da Season ${season.numero} foram encerradas.`;
      default: return `${equipe} e faça a inscrição aqui no site quando as inscrições abrirem.`;
    }
  })();

  return (

    <Layout>
      <EventoParaBusca season={season} />

      <div className={PAGINA}>

        {/* Abertura: quem chega sabe na hora que e a Season 4 e quanto falta para
            a competicao. A data e a hora vem do painel; sem elas, so o formato.
            A inscricao fica no botao da barra, sempre visivel. */}
        <section className="text-center">
          <h1 className="text-balance font-secao text-5xl uppercase leading-none text-destaque md:text-7xl">
            {inicioDoEvento && !jaPassou(season!.dataEvento!) ? `A Season ${season?.numero ?? "4"} começa em` : `Season ${season?.numero ?? "4"}`}
          </h1>
          {season?.dataEvento && inicioDoEvento ? (
            <>
              <div className="mt-8">
                {/* No dia, a porta abre e os fantasmas saem. A pagina e gerada de
                    novo a cada poucos minutos, entao a abertura acompanha. */}
                <CasaDosFantasmas aberta={jaPassou(season.dataEvento)}>
                  <Contagem inicio={season.dataEvento} rotuloData={inicioDoEvento} />
                </CasaDosFantasmas>
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
              {!jaPassou(season.dataEvento) && (
                <SalvarNaAgenda evento={{ numero: season.numero, dataEvento: season.dataEvento, local: season.local }} className="mt-4 text-sm md:text-base" />
              )}
            </>
          ) : (
            <p className="mt-4 text-xl text-destaque-claro">Competição de programação em equipes, em um único dia. Data em breve.</p>
          )}
        </section>

        {/* Aqui fica o convite; o regulamento (formato, equipes, linguagens) e
            da pagina Regras. Antes as duas repetiam o formato e a lista de
            data, local e linguagens, que a abertura ja mostra. */}
        <section className={SECAO}>
          <TituloSecao valor="O que é o Game Jam" />
          <p className={`${APOS_TITULO} ${TEXTO}`}>
            É uma competição de programação em equipes do PET Engenharia de Computação da
            Ufes. Em um único dia, cada equipe recebe um jogo preparado especialmente para o
            evento e usa programação para implementar parte da lógica dele. O desafio só é
            revelado no dia: mais do que escrever código, ele põe à prova interpretação de
            problemas, raciocínio lógico, trabalho em equipe e adaptação ao inesperado.
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
          <TituloSecao valor="Como participar" />
          <p className={`${APOS_TITULO} ${TEXTO}`}>
            {inscricao}
            {season?.situacaoInscricoes !== "encerradas" && " A participação é gratuita e aberta ao público. Cada equipe precisa de um nome, então escolham um bom!"}
          </p>
          <p className={`mt-4 ${TEXTO}`}>
            Formato, equipes e linguagens permitidas estão nas{" "}
            <Link href="/regras" className="text-destaque underline">Regras</Link>.
          </p>
        </section>

        {/* O labirinto com o PET nas paredes, como o Google fez com o nome
            dele no Doodle dos 30 anos do Pac-Man. Fica depois do que importa
            (data, inscricao), para nao disputar com isso. */}
        <section className={SECAO}>
          <TituloSecao valor="Enquanto a Season não começa" />
          <p className={`${APOS_TITULO} ${TEXTO}`}>
            Uma partida de Pac-Man no labirinto do PET. No computador, use as setas ou
            WASD; no celular, o direcional embaixo do labirinto.
          </p>
          <div className="mt-8">
            <JogoNaPagina />
          </div>
        </section>
      </div>
    </Layout>
  );
}
