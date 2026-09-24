import Layout from "../components/Layout";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";
import { dataDaEdicao, linguagensDaEdicao } from "@/lib/edicao";

export default function Home() {

  return (
    <Layout className="flex items-center justify-center">

      <div className="max-w-6xl w-[80%] mt-20 relative">

        {/* Título principal */}
        <Titulo valor="REGRAS" />

        <p className="mt-8 text-lg leading-8">
          O regulamento completo da Season 4, com horários e premiação, será divulgado em
          breve aqui e no Instagram{" "}
          <a href="https://www.instagram.com/petengcomp/" target="_blank" rel="noopener noreferrer" className="text-destaque underline">
            @petengcomp
          </a>
          . Por enquanto, o que já está definido:
        </p>

        <TituloSecao valor="O formato" className="mt-12 mb-4" />
        <ol className="list-decimal ml-9 mb-6 space-y-2">
          <li>A competição acontece em um único dia e é disputada em equipes.</li>
          <li>Cada equipe recebe um jogo preparado especialmente para o evento e precisa implementar parte da lógica dele.</li>
          <li>O desafio só é revelado no dia: no início da competição são apresentadas as regras completas, o ambiente utilizado e as informações necessárias para começar.</li>
          <li>Como no TOPCOM, as equipes têm um tempo limitado para analisar o desafio, discutir a estratégia e desenvolver a solução.</li>
        </ol>

        <TituloSecao valor="Equipes e inscrição" className="mt-12 mb-4" />
        <ol className="list-decimal ml-9 mb-6 space-y-2">
          <li>Cada equipe tem até 3 pessoas.</li>
          <li>A inscrição é feita aqui no site, durante o período de inscrições, e cada equipe precisa de um nome.</li>
          <li>Todos os participantes recebem certificado de participação, emitido pela Pró-Reitoria de Extensão (PROEX) da UFES. Por isso o CPF é pedido na inscrição.</li>
        </ol>

        <TituloSecao valor="Data e linguagens" className="mt-12 mb-4" />
        <ol className="list-decimal ml-9 mb-6 space-y-2">
          <li>Data: {dataDaEdicao()}.</li>
          <li>Linguagens permitidas: {linguagensDaEdicao()}.</li>
        </ol>

        <TituloSecao valor="Dúvidas" className="mt-12 mb-4" />
        <ol className="list-decimal ml-9 mb-6 space-y-2">
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
