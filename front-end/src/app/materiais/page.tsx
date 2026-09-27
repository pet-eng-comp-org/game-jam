import type { Metadata } from "next";
import Layout from "../components/Layout";
import { listaDeLinguagens, materiais, miniaturaDoYoutube, seasonAtual } from "@/lib/conteudo";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";
import { APOS_TITULO, LISTA, PAGINA, SECAO, TEXTO } from "../components/estilo";

export const metadata: Metadata = {
  title: "Materiais",
  description: "Como se preparar para o Game Jam da Ufes: lógica, a linguagem da competição e materiais das edições anteriores.",
};

export default async function Materiais() {

  const [todos, season] = await Promise.all([materiais(), seasonAtual()]);
  const linguagens = listaDeLinguagens(season?.linguagens);
  const comMiniatura = await Promise.all(todos.map(async (m) => ({ ...m, miniatura: await miniaturaDoYoutube(m.link) })));
  const videos = comMiniatura.filter((m) => m.miniatura);
  const links = comMiniatura.filter((m) => !m.miniatura);

  return (

    <Layout>

      <div className={PAGINA}>

        <Titulo valor="materiais" />

        {/* A Season 4 nao pede um jogo feito do zero: a equipe recebe um pronto e
            implementa parte da logica. O que ajuda a se preparar vem primeiro;
            os materiais de Phaser das edicoes anteriores ficam depois, como extra. */}
        <p className={`mt-6 ${TEXTO}`}>
          Na Season 4, ninguém precisa criar um jogo do zero: cada equipe recebe um jogo
          pronto e implementa parte da lógica dele. Então a melhor preparação é de
          programação, não de desenvolvimento de jogos.
        </p>

        <section className={SECAO}>
          <TituloSecao valor="Como se preparar" />
          <ul className={`${APOS_TITULO} ${LISTA} space-y-4`}>
            <li>
              <strong>Pratique lógica e a linguagem da competição.</strong>{" "}
              {linguagens ? <>As linguagens permitidas são: {linguagens}.</> : <>As linguagens permitidas serão divulgadas em breve.</>}{" "}
              Resolver exercícios curtos, com tempo contado, é o treino mais parecido com o dia.
            </li>
            <li>
              <strong>Entenda como um jogo funciona por dentro.</strong> Quase todo jogo repete
              o mesmo ciclo várias vezes por segundo: lê o que o jogador fez, atualiza o estado
              (posição, pontos, vidas) e desenha a tela. Colisão, pontuação e fim de jogo são
              regras aplicadas nesse ciclo, e é esse tipo de lógica que a equipe vai escrever.
            </li>
            <li>
              <strong>Treine ler código que não é seu.</strong> No dia, a equipe parte do
              código do jogo preparado: entender rápido o que já existe vale tanto quanto
              escrever código novo.
            </li>
            <li>
              <strong>Combinem a divisão do trabalho.</strong> O tempo é curto: vale decidir
              antes quem lê o código, quem escreve e quem testa.
            </li>
          </ul>
        </section>

        {/* Super PETs, links e videos sao partes desta secao, e nao secoes do
            mesmo nivel dela: por isso sao subsecoes (h3). */}
        <section className={SECAO}>
          <TituloSecao valor="Para ir além" />
          <p className={`${APOS_TITULO} ${TEXTO}`}>
            Nas edições anteriores, as equipes criavam o jogo do zero com o framework Phaser3,
            em JavaScript. Os materiais daquela época continuam aqui para quem quer entender
            como se faz um jogo inteiro.
          </p>

          <TituloSecao subsecao valor="Super PETs" className="mt-12" />
          <p className={`mt-4 ${TEXTO}`}>
            Um jogo de código aberto feito pelo PET EngComp com o framework Phaser3, que serve
            de base para entender como um jogo é organizado:{" "}
            <a
              href="https://github.com/BrunoAngeloti/SuperPets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-destaque underline underline-offset-2 hover:decoration-2"
            >
              repositório no GitHub
            </a>.
          </p>

          {links.length > 0 && (
            <>
              <TituloSecao subsecao valor="Links úteis" className="mt-12" />
              <ul className={`mt-4 ${LISTA}`}>
                {links.map(m => (
                  <li key={m.id}>
                    <a href={m.link} target="_blank" rel="noopener noreferrer" className="text-destaque underline underline-offset-2 hover:decoration-2">
                      {m.nome}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          {videos.length > 0 && (
            <>
              <TituloSecao subsecao valor="Vídeos" className="mt-12" />

              {/* Miniatura e texto lado a lado a partir de 1024px; o texto na
                  escala do resto do site (antes 29px, maior que qualquer outro
                  texto corrido). */}
              <div className="mt-6 flex flex-col gap-10">
                {videos.map(m => {
                  return (
                    <article key={m.id} className="grid items-center gap-5 lg:grid-cols-[400px_1fr] lg:gap-10">
                      <a href={m.link} target="_blank" rel="noopener noreferrer" aria-label={`Assistir: ${m.nome}`}>
                        <img
                          src={m.miniatura!}
                          alt=""
                          className="aspect-video w-full rounded-[10px] object-cover"
                        />
                      </a>

                      <div>
                        <h4 className="text-2xl font-bold text-destaque">{m.nome}</h4>
                        <p className="mt-1 text-base font-bold text-destaque-claro/80">por PET Eng Comp</p>
                        <p className={`mt-3 whitespace-pre-wrap ${TEXTO}`}>{m.descricao}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </Layout>
  );
}
