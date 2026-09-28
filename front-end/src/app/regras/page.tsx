import type { Metadata } from "next";
import Layout from "../components/Layout";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";
import { LISTA, PAGINA, SECAO, TEXTO } from "../components/estilo";
import Markdown, { type Components } from "react-markdown";
import { listaDeLinguagens, seasonAtual } from "@/lib/conteudo";
import { dia, diaEHora } from "@/lib/datas";

export const metadata: Metadata = {
  title: "Regras",
  description: "Formato, equipes, inscrição e linguagens do Game Jam, a competição de programação do PET Engenharia de Computação da Ufes.",
};

// Numerada so onde a ordem importa (o regulamento escrito no painel decide);
// o resto e topico.
const NUMERADA = `${TEXTO} list-decimal space-y-2 pl-6 marker:text-destaque`;
const SECAO_REGRAS = `${SECAO} mb-5`;

// Estilos do regulamento escrito no painel: "## Titulo" vira titulo de secao,
// "### Titulo" de subsecao; listas e paragrafos seguem o texto do site.
const markdown: Components = {
  h1: ({ children }) => <TituloSecao valor={String(children)} className={`${SECAO_REGRAS} first:mt-0`} />,
  h2: ({ children }) => <TituloSecao valor={String(children)} className={`${SECAO_REGRAS} first:mt-0`} />,
  h3: ({ children }) => <TituloSecao subsecao valor={String(children)} className="mb-4 mt-10 first:mt-0" />,
  p: ({ children }) => <p className={`mt-4 first:mt-0 ${TEXTO}`}>{children}</p>,
  ol: ({ children }) => <ol className={NUMERADA}>{children}</ol>,
  ul: ({ children }) => <ul className={LISTA}>{children}</ul>,
  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-destaque underline">{children}</a>,
  img: () => null,
};

export default async function Regras() {

  const season = await seasonAtual();

  return (
    <Layout>

      <div className={PAGINA}>

        <Titulo valor="regras" />

        {season?.regulamento ? (
          // O regulamento vem do painel, em markdown. O react-markdown nao executa
          // HTML do texto; os elementos recebem os estilos medidos no mockup.
          <div className="mt-10">
            <Markdown components={markdown}>{season.regulamento}</Markdown>
          </div>
        ) : (
          <>
            <p className={`mt-10 ${TEXTO}`}>
              O regulamento completo da Season {season?.numero ?? "4"}, com horários e premiação,
              será divulgado aqui em breve. Por enquanto, o que já está definido:
            </p>

            <TituloSecao valor="O formato" className={SECAO_REGRAS} />
            <ul className={LISTA}>
              <li>A competição acontece em um único dia e é disputada em equipes.</li>
              <li>Cada equipe recebe um jogo preparado especialmente para o evento e precisa implementar parte da lógica dele.</li>
              <li>O desafio só é revelado no dia: no início da competição são apresentadas as regras completas, o ambiente utilizado e as informações necessárias para começar.</li>
              <li>As equipes têm um tempo limitado para analisar o desafio, discutir a estratégia e desenvolver a solução.</li>
            </ul>
          </>
        )}

        <TituloSecao valor="Equipes e inscrição" className={SECAO_REGRAS} />
        <ul className={LISTA}>
          <li>Cada equipe tem até {season?.numParticipantesPorEquipe ?? "3"} pessoas.</li>
          <li>
            A inscrição é feita aqui no site,{" "}
            {season?.inscricoesAbrem && season?.inscricoesFecham
              ? <>de {dia(season.inscricoesAbrem)} até {diaEHora(season.inscricoesFecham)},</>
              : "durante o período de inscrições,"}{" "}
            e cada equipe precisa de um nome.
          </li>
          <li>Todos os participantes recebem certificado de participação, emitido pela Pró-Reitoria de Extensão (Proex) da Ufes.</li>
        </ul>

        {/* A linguagem e regra, entao mora aqui, e so aqui: data e local ficam
            na abertura do Inicio. */}
        <TituloSecao valor="Linguagens" className={SECAO_REGRAS} />
        <p className={TEXTO}>
          {listaDeLinguagens(season?.linguagens)
            ? <>Linguagens permitidas: {listaDeLinguagens(season?.linguagens)}.</>
            : "As linguagens permitidas serão divulgadas junto com o regulamento."}
        </p>

        <TituloSecao valor="Dúvidas" className={SECAO_REGRAS} />
        <p className={TEXTO}>
            Qualquer dúvida pode ser tirada com o PET Engenharia de Computação pelo Instagram{" "}
            <a href="https://www.instagram.com/petengcomp/" target="_blank" rel="noopener noreferrer" className="text-destaque underline">
              @petengcomp
            </a>
            .
        </p>
      </div>
    </Layout>
  );
}
