import Layout from "../components/Layout";
import { materiais, miniaturaDoYoutube } from "@/lib/conteudo";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";

export default async function Materiais() {

  const todos = await materiais();
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

        <p className="mt-3 text-lg leading-[22px]">
          Nesta seção, você encontrará diversos materiais úteis para iniciar e aprofundar seus
          estudos em desenvolvimento de jogos. Reunimos dicas, projetos de exemplo e recursos
          selecionados para facilitar sua jornada.
        </p>

        <Titulo valor="DICAS" className="mt-[139px]" />

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
