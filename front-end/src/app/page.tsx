import Link from "next/link";
import Layout from "./components/Layout";
import Titulo from "./components/Titulo";
import { dataEHora, dataPorExtenso, listaDeLinguagens, seasonAtual } from "@/lib/conteudo";

export default async function Home() {

  const season = await seasonAtual();
  const pessoas = season ? Number(season.numParticipantesPorEquipe) || 3 : 3;
  const extenso = ["", "uma", "duas", "três", "quatro", "cinco", "seis"][pessoas] ?? String(pessoas);
  const periodo = season?.inscricoesAbrem && season?.inscricoesFecham
    ? `de ${dataEHora(season.inscricoesAbrem)} a ${dataEHora(season.inscricoesFecham)}`
    : "em breve";

  return (

    <Layout>

      {/* 1154/1440 do mockup = 80% da largura, com o mesmo respiro no topo. */}
      <div className="mx-auto w-[80%] max-w-[1154px] pt-[98px] pb-10">

        <section>
          <Titulo valor="O QUE É GAMEJAM" />
          <p className="mt-[30px] text-lg leading-9">
            É uma competição de programação em equipes do PET Engenharia de Computação da
            UFES. Em um único dia, cada equipe recebe um jogo preparado especialmente para o
            evento e usa programação para implementar parte da lógica dele.
          </p>
          {/* A Season 4 e a primeira neste formato: sem este aviso, os jogos das
              outras edicoes (em /jogos) pareciam o que se faz na competicao. */}
          <p className="mt-6 text-lg leading-9">
            A Season 4 estreia esse formato. Nas três primeiras edições, o Game Jam era uma
            maratona de algumas semanas em que cada equipe criava um jogo do zero, sobre
            um tema. Os jogos criados nessas edições estão em{" "}
            <Link href="/jogos" className="text-destaque underline">Jogos</Link>.
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
            Monte uma equipe de até {extenso} {pessoas === 1 ? "pessoa" : "pessoas"} e faça a inscrição aqui no site quando as
            inscrições abrirem. Cada equipe precisa de um nome, então escolham um bom!
          </p>
          <ul className="mt-6 space-y-1 text-lg leading-9">
            <li><strong>Data:</strong> {dataPorExtenso(season?.dataEvento) ?? "em breve"}</li>
            <li><strong>Inscrições:</strong> {periodo}</li>
            <li><strong>Duração:</strong> 1 dia</li>
            <li><strong>Formato:</strong> competição em equipes de até {pessoas} {pessoas === 1 ? "pessoa" : "pessoas"}</li>
            <li><strong>Linguagens permitidas:</strong> {listaDeLinguagens(season?.linguagens) ?? "em breve"}</li>
            <li><strong>Desafio:</strong> implementar a lógica de um jogo</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}
