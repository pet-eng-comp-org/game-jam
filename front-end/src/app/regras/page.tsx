import Layout from "../components/Layout";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";
import Markdown, { type Components } from "react-markdown";
import { dataEHora, dataPorExtenso, listaDeLinguagens, seasonAtual } from "@/lib/conteudo";

const LISTA = "list-decimal space-y-5 pl-[24px] text-lg leading-[22px]";

// Estilos do regulamento escrito no painel: "## Titulo" vira subtitulo em
// Jomhuria, listas e paragrafos seguem as medidas do mockup.
const markdown: Components = {
  h1: ({ children }) => <TituloSecao valor={String(children)} className="mt-[35px] mb-[13px] first:mt-0" />,
  h2: ({ children }) => <TituloSecao valor={String(children)} className="mt-[35px] mb-[13px] first:mt-0" />,
  h3: ({ children }) => <TituloSecao valor={String(children)} className="mt-[35px] mb-[13px] first:mt-0" />,
  p: ({ children }) => <p className="mt-4 text-lg leading-[22px] first:mt-0">{children}</p>,
  ol: ({ children }) => <ol className={LISTA}>{children}</ol>,
  ul: ({ children }) => <ul className="list-disc space-y-5 pl-[24px] text-lg leading-[22px]">{children}</ul>,
  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-destaque underline">{children}</a>,
  img: () => null,
};

export default async function Regras() {

  const season = await seasonAtual();

  return (
    <Layout>

      {/* Mesma margem das outras paginas: titulo em y=177 do mockup (98px abaixo da barra). */}
      <div className="mx-auto w-[80%] max-w-[1154px] pt-[98px] pb-24">

        {/* Título principal */}
        <Titulo valor="REGRAS" />

        {season?.regulamento ? (
          // O regulamento vem do painel, em markdown. O react-markdown nao executa
          // HTML do texto; os elementos recebem os estilos medidos no mockup.
          <div className="mt-[48px]">
            <Markdown components={markdown}>{season.regulamento}</Markdown>
          </div>
        ) : (
          <>
            {/* Medidas do mockup (frame Regras): subtitulo a 54px da lista, itens a cada
                42px (entrelinha 22 + 20 entre itens), 64px da ultima linha ao subtitulo
                seguinte. A introducao ocupa o lugar do primeiro bloco. */}
            <p className="mt-[48px] text-lg leading-[22px]">
              O regulamento completo da Season {season?.numero ?? "4"}, com horários e premiação,
              será divulgado em breve aqui e no Instagram{" "}
              <a href="https://www.instagram.com/petengcomp/" target="_blank" rel="noopener noreferrer" className="text-destaque underline">
                @petengcomp
              </a>
              . Por enquanto, o que já está definido:
            </p>

            <TituloSecao valor="O formato" className="mt-[35px] mb-[13px]" />
            <ol className={LISTA}>
              <li>A competição acontece em um único dia e é disputada em equipes.</li>
              <li>Cada equipe recebe um jogo preparado especialmente para o evento e precisa implementar parte da lógica dele.</li>
              <li>O desafio só é revelado no dia: no início da competição são apresentadas as regras completas, o ambiente utilizado e as informações necessárias para começar.</li>
              <li>Como no TOPCOM, as equipes têm um tempo limitado para analisar o desafio, discutir a estratégia e desenvolver a solução.</li>
            </ol>
          </>
        )}

        <TituloSecao valor="Equipes e inscrição" className="mt-[35px] mb-[13px]" />
        <ol className={LISTA}>
          <li>Cada equipe tem até {season?.numParticipantesPorEquipe ?? "3"} pessoas.</li>
          <li>
            A inscrição é feita aqui no site,{" "}
            {season?.inscricoesAbrem && season?.inscricoesFecham
              ? <>de {dataEHora(season.inscricoesAbrem)} a {dataEHora(season.inscricoesFecham)},</>
              : "durante o período de inscrições,"}{" "}
            e cada equipe precisa de um nome.
          </li>
          <li>Todos os participantes recebem certificado de participação, emitido pela Pró-Reitoria de Extensão (PROEX) da UFES. Por isso o CPF é pedido na inscrição.</li>
        </ol>

        <TituloSecao valor="Data e linguagens" className="mt-[35px] mb-[13px]" />
        <ol className={LISTA}>
          <li>Data: {dataPorExtenso(season?.dataEvento) ?? "em breve"}.</li>
          <li>Linguagens permitidas: {listaDeLinguagens(season?.linguagens) ?? "em breve"}.</li>
        </ol>

        <TituloSecao valor="Dúvidas" className="mt-[35px] mb-[13px]" />
        <ol className={LISTA}>
          <li>
            Qualquer dúvida pode ser tirada com o PET Engenharia de Computação pelo Instagram{" "}
            <a href="https://www.instagram.com/petengcomp/" target="_blank" rel="noopener noreferrer" className="text-destaque underline">
              @petengcomp
            </a>
            .
          </li>
        </ol>
      </div>
    </Layout>
  );
}
