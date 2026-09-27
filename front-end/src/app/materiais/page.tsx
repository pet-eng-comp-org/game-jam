import Layout from "../components/Layout";
import { listaDeLinguagens, materiais, miniaturaDoYoutube, seasonAtual } from "@/lib/conteudo";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";

export default async function Materiais() {

  const [todos, season] = await Promise.all([materiais(), seasonAtual()]);
  const linguagens = listaDeLinguagens(season?.linguagens);
  const comMiniatura = await Promise.all(todos.map(async (m) => ({ ...m, miniatura: await miniaturaDoYoutube(m.link) })));
  const videos = comMiniatura.filter((m) => m.miniatura);
  const links = comMiniatura.filter((m) => !m.miniatura);

  // Medidas do mockup (Figma, Season 4, frame Materiais 78:607): texto Inter
  // 18px com entrelinha 36, subtitulos Jomhuria 48 ("SUPER PETS:"), e cada
  // video como cartao de 538x421 com o texto a 72px, em Inter 34/29.
  return (

    <Layout>

      <div className="mx-auto w-[80%] max-w-[1154px] pt-[98px] pb-24">

        <Titulo valor="materiais" />

        {/* A Season 4 nao pede um jogo feito do zero: a equipe recebe um pronto e
            implementa parte da logica. O que ajuda a se preparar vem primeiro;
            os materiais de Phaser das edicoes anteriores ficam depois, como extra. */}
        <p className="mt-3 text-lg leading-9">
          Na Season 4, ninguém precisa criar um jogo do zero: cada equipe recebe um jogo
          pronto e implementa parte da lógica dele. Então a melhor preparação é de
          programação, não de desenvolvimento de jogos.
        </p>

        <Titulo valor="COMO SE PREPARAR" className="mt-[100px]" />
        <ul className="mt-[30px] list-disc space-y-4 pl-6 text-lg leading-9 marker:text-destaque">
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

        <Titulo valor="PARA IR ALÉM" className="mt-[130px]" />
        <p className="mt-[30px] text-lg leading-9">
          Nas edições anteriores, as equipes criavam o jogo do zero com o framework Phaser3,
          em JavaScript. Os materiais daquela época continuam aqui para quem quer entender
          como se faz um jogo inteiro.
        </p>

        <TituloSecao valor="Super PETs:" className="mt-[32px]" />
        {/* Entrelinha 21,8px e lista com 20px entre itens: valores por trecho do
            texto no Figma (o estilo geral diz 36, mas cada trecho sobrescreve). */}
        {/* 1145px: a caixa do Figma tem 1150, mas o Chrome desenha a Inter 0,4% mais
            estreita e "aberto" cabia na 1a linha, que no mockup quebra em "codigo". */}
        <p className="mt-[17px] max-w-[1145px] text-lg leading-[22px]">
          Para ajudá-los nessa nova jornada no desenvolvimento de jogos, o PET EngComp
          desenvolveu o Super PETs, um jogo de código aberto no GitHub{" "}
          <a
            href="https://github.com/BrunoAngeloti/SuperPets"
            target="_blank"
            rel="noopener noreferrer"
            className="text-destaque hover:underline"
          >
            (repositório)
          </a>. Nesse repositório vocês podem ter uma boa base de como desenvolver um jogo
          usando o framework Phaser3.
        </p>

        {links.length > 0 && (
          <>
            <TituloSecao valor="Links úteis:" className="mt-[37px]" />
            <ul className="mt-[19px] list-disc space-y-5 pl-6 text-lg leading-[22px] marker:text-destaque">
              {links.map(m => (
                <li key={m.id}>
                  <a href={m.link} target="_blank" rel="noopener noreferrer" className="text-destaque hover:underline">
                    {m.nome}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        {videos.length > 0 && (
          <>
            <Titulo valor="VÍDEOS" className="mt-[130px]" />

            <div className="mt-[54px] flex flex-col gap-[53px]">
              {videos.map(m => {
                return (
                  <article key={m.id} className="grid items-center gap-8 md:ml-[7px] md:grid-cols-[538px_528px] md:gap-[72px]">
                    <a href={m.link} target="_blank" rel="noopener noreferrer" aria-label={`Assistir: ${m.nome}`}>
                      <img
                        src={m.miniatura!}
                        alt=""
                        className="aspect-[538/421] w-full rounded-[10px] object-cover md:h-[421px] md:w-[538px]"
                      />
                    </a>

                    <div>
                      <h3 className="text-2xl font-bold text-destaque md:text-[34px] md:leading-[42px]">{m.nome}</h3>
                      <p className="mt-1 text-xl font-bold md:text-[29px] md:leading-[35px]">por EQUIPE PET</p>
                      <p className="mt-8 whitespace-pre-wrap text-xl md:text-[29px] md:leading-[35px]">{m.descricao}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
