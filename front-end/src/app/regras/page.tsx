import Layout from "../components/Layout";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";
import { dataDaEdicao, linguagensDaEdicao } from "@/lib/edicao";

export default function Home() {

  return (
    <Layout>

      {/* Mesma margem das outras paginas: titulo em y=177 do mockup (98px abaixo da barra). */}
      <div className="mx-auto w-[80%] max-w-[1154px] pt-[98px] pb-24">

        {/* Título principal */}
        <Titulo valor="REGRAS" />

        {/* Medidas do mockup (frame Regras): subtitulo a 54px da lista, itens a cada
            42px (entrelinha 22 + 20 entre itens), 64px da ultima linha ao subtitulo
            seguinte. A introducao ocupa o lugar do primeiro bloco. */}
        <p className="mt-[48px] text-lg leading-[22px]">
          O regulamento completo da Season 4, com horários e premiação, será divulgado em
          breve aqui e no Instagram{" "}
          <a href="https://www.instagram.com/petengcomp/" target="_blank" rel="noopener noreferrer" className="text-destaque underline">
            @petengcomp
          </a>
          . Por enquanto, o que já está definido:
        </p>

        <TituloSecao valor="O formato" className="mt-[35px] mb-[13px]" />
        <ol className="list-decimal space-y-5 pl-[24px] text-lg leading-[22px]">
          <li>A competição acontece em um único dia e é disputada em equipes.</li>
          <li>Cada equipe recebe um jogo preparado especialmente para o evento e precisa implementar parte da lógica dele.</li>
          <li>O desafio só é revelado no dia: no início da competição são apresentadas as regras completas, o ambiente utilizado e as informações necessárias para começar.</li>
          <li>Como no TOPCOM, as equipes têm um tempo limitado para analisar o desafio, discutir a estratégia e desenvolver a solução.</li>
        </ol>

        <TituloSecao valor="Equipes e inscrição" className="mt-[35px] mb-[13px]" />
        <ol className="list-decimal space-y-5 pl-[24px] text-lg leading-[22px]">
          <li>Cada equipe tem até 3 pessoas.</li>
          <li>A inscrição é feita aqui no site, durante o período de inscrições, e cada equipe precisa de um nome.</li>
          <li>Todos os participantes recebem certificado de participação, emitido pela Pró-Reitoria de Extensão (PROEX) da UFES. Por isso o CPF é pedido na inscrição.</li>
        </ol>

        <TituloSecao valor="Data e linguagens" className="mt-[35px] mb-[13px]" />
        <ol className="list-decimal space-y-5 pl-[24px] text-lg leading-[22px]">
          <li>Data: {dataDaEdicao()}.</li>
          <li>Linguagens permitidas: {linguagensDaEdicao()}.</li>
        </ol>

        <TituloSecao valor="Dúvidas" className="mt-[35px] mb-[13px]" />
        <ol className="list-decimal space-y-5 pl-[24px] text-lg leading-[22px]">
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
