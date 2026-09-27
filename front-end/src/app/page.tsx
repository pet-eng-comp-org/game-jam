import Layout from "./components/Layout";
import Titulo from "./components/Titulo";
import { dataDaEdicao, linguagensDaEdicao } from "@/lib/edicao";

export default function Home() {

  return (

    <Layout>

      {/* 1154/1440 do mockup = 80% da largura, com o mesmo respiro no topo. */}
      <div className="mx-auto w-[80%] max-w-[1154px] pt-[98px] pb-10">

        <section>
          <Titulo valor="O QUE É GAMEJAM" />
          <p className="mt-[30px] text-lg leading-9">
            É uma competição de programação em equipes do PET Engenharia de Computação da
            UFES, nos mesmos moldes do TOPCOM, o maior torneio de programação do Espírito
            Santo. Em um único dia, cada equipe recebe um jogo preparado especialmente para o
            evento e usa programação para implementar parte da lógica dele.
          </p>
        </section>

        {/* O segundo bloco entra recuado no mockup: x=214 contra x=143 dos
            outros dois, e um pouco mais estreito. */}
        {/* Distancias medidas no mockup renderizado (as caixas de texto do Figma sao
            menores que o texto, entao o espacamento declarado nao vale): 132px da
            ultima linha ao proximo titulo, 141px no bloco seguinte. */}
        <section className="mt-[97px] md:ml-[6%] md:max-w-[1083px]">
          <Titulo valor="como funciona" />
          <p className="mt-[30px] text-lg leading-9">
            Nem tudo é revelado antes da competição: no início do dia são apresentadas as
            regras completas, o ambiente e o que é preciso para começar. A partir daí, cada
            equipe interpreta o problema, discute a estratégia e transforma ideias em código,
            contra o tempo. Mais do que escrever código, o desafio põe à prova interpretação de
            problemas, raciocínio lógico, trabalho em equipe e adaptação ao inesperado.
          </p>
        </section>

        <section className="mt-[106px]">
          <Titulo valor="como participar" />
          <p className="mt-[30px] text-lg leading-9">
            Monte uma equipe de até três pessoas e faça a inscrição aqui no site quando as
            inscrições abrirem. Cada equipe precisa de um nome, então escolham um bom!
          </p>
          <ul className="mt-6 space-y-1 text-lg leading-9">
            <li><strong>Data:</strong> {dataDaEdicao()}</li>
            <li><strong>Duração:</strong> 1 dia</li>
            <li><strong>Formato:</strong> competição em equipes de até 3 pessoas</li>
            <li><strong>Linguagens permitidas:</strong> {linguagensDaEdicao()}</li>
            <li><strong>Desafio:</strong> implementar a lógica de um jogo</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}
