"use client";

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Material } from "@/models/Materiais";
import Titulo from "../components/Titulo";
import TituloSecao from "../components/TituloSecao";

export default function Materiais() {

  const [materiais, setMateriais] = useState<Material[]>([]);

  async function obtemMateriais() {

    const m = await Material.obtemTodosMateriais();
    setMateriais(m);
  }

  useEffect(() => {
    obtemMateriais();
  }, []);

  function getYouTubeEmbedUrl(link: string) {

    const match = link.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
    return match ? match[1] : null;
  }

  const videos = materiais.filter(m => getYouTubeEmbedUrl(m.getLink));
  const links = materiais.filter(m => !getYouTubeEmbedUrl(m.getLink));

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

        <Titulo valor="DICAS" className="mt-[125px]" />

        <TituloSecao valor="Super PETs:" className="mt-5" />
        <p className="mt-4 text-lg leading-9">
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
            <TituloSecao valor="Links úteis:" className="mt-5" />
            <ul className="mt-4 list-disc pl-6 text-lg leading-9 marker:text-destaque">
              {links.map(m => (
                <li key={m.getId}>
                  <a href={m.getLink} target="_blank" rel="noopener noreferrer" className="text-destaque hover:underline">
                    {m.getNome}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        {videos.length > 0 && (
          <>
            <Titulo valor="VÍDEOS" className="mt-[125px]" />

            <div className="mt-14 flex flex-col gap-[53px]">
              {videos.map(m => {
                const videoId = getYouTubeEmbedUrl(m.getLink);

                return (
                  <article key={m.getId} className="grid items-center gap-8 md:grid-cols-[538fr_528fr] md:gap-[72px]">
                    <a href={m.getLink} target="_blank" rel="noopener noreferrer" aria-label={`Assistir: ${m.getNome}`}>
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        alt=""
                        className="aspect-[538/421] w-full rounded-[10px] object-cover"
                      />
                    </a>

                    <div>
                      <h3 className="text-2xl font-bold text-destaque md:text-[34px] md:leading-[42px]">{m.getNome}</h3>
                      <p className="mt-1 text-xl font-bold md:text-[29px] md:leading-[35px]">por EQUIPE PET</p>
                      <p className="mt-8 whitespace-pre-wrap text-xl md:text-[29px] md:leading-[35px]">{m.getDescricao}</p>
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
