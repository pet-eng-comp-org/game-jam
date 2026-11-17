import type { Metadata } from "next";
import Layout from "../components/Layout";
import { materiais, miniaturaDoYoutube } from "@/lib/conteudo";
import { linguagensPorExtenso } from "@/lib/edicao";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";
import { APOS_TITULO, LISTA, PAGINA, SECAO, TEXTO } from "../components/estilo";

export const metadata: Metadata = {
  title: "Materiais",
  description: "Como se preparar para o workshop do Game Jam: lógica, a sua linguagem e materiais das edições anteriores.",
};

export default async function Materiais() {

  const todos = await materiais();
  const comMiniatura = await Promise.all(todos.map(async (m) => ({ ...m, miniatura: await miniaturaDoYoutube(m.link) })));
  const videos = comMiniatura.filter((m) => m.miniatura);
  const links = comMiniatura.filter((m) => !m.miniatura);

  return (

    <Layout>

      <div className={PAGINA}>

        <Titulo valor="materiais" />

        {/* No workshop o jogo vem pronto e cada pessoa escreve a logica do proprio
            tanque. O que ajuda a se preparar vem primeiro; os materiais de Phaser
            das edicoes anteriores ficam depois, como extra. */}
        <p className={`mt-6 ${TEXTO}`}>
          No workshop, o jogo já vem pronto e você escreve a lógica do seu tanque, então a
          melhor preparação é de programação, não de desenvolvimento de jogos.
        </p>

        <section className={SECAO}>
          <TituloSecao valor="Como se preparar" />
          <ul className={`${APOS_TITULO} ${LISTA} space-y-4`}>
            <li>
              <strong>Pratique lógica e a sua linguagem ({linguagensPorExtenso()}).</strong>{" "}
              Condicionais e laços são a base, e um pouco de geometria ajuda: ângulo e
              distância, para mirar e desviar.
            </li>
            <li>
              <strong>Entenda como um jogo funciona por dentro.</strong> Quase todo jogo repete
              o mesmo ciclo várias vezes por segundo: lê o que o jogador fez, atualiza o estado
              (posição, pontos, vidas) e desenha a tela. No workshop é assim também: a cada
              quadro, o seu tanque recebe o estado do jogo e devolve a ação (andar, virar,
              mirar, atirar, ligar o escudo).
            </li>
            <li>
              <strong>Treine ler código que não é seu.</strong> No workshop, cada fase vem com
              um modelo pronto na sua linguagem; você completa a parte que falta.
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
            como se faz um jogo inteiro, mas não são usados no workshop.
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
