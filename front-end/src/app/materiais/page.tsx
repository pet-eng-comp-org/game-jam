"use client";

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Material } from "@/models/Materiais";
import Titulo from "../components/Titulo";

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

  return (

    <Layout className="flex flex-col">

      <div className="max-w-6xl w-[80%] mt-20 relative flex flex-col mx-auto px-3.5">

        {/* Título */}
        <Titulo valor="materiais" />

        <p className="mt-6 mb-10 whitespace-pre-wrap">
          Nesta seção, você encontrará diversos materiais úteis para iniciar e aprofundar seus estudos em desenvolvimento de jogos. Reunimos{"\n"}
          dicas, projetos de exemplo e recursos selecionados para facilitar sua jornada.
        </p>

        {/* Dicas */}
        <Titulo valor="DICAS" className="mb-2" />

        {/* Super PETs */}
        <h4 className="mb-4 mt-7 text-xl font-semibold text-destaque">Super PETs</h4>

        <p className="mb-5 whitespace-pre-wrap">
          Para ajudá-los nessa nova jornada no desenvolvimento de jogos, o PET EngComp desenvolveu o Super PETs, um jogo de código aberto{"\n"}no github{" "}
          <a 
            href="https://github.com/BrunoAngeloti/SuperPets" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-destaque hover:underline font-semibold"
          >
            (repositório)
          </a>. Nesse repositório vocês podem ter uma boa base de como desenvolver um jogo usando o framework Phaser3.
        </p>
        
        {/* Links úteis */}
        <h4 className="mb-4 mt-3 text-xl font-semibold text-destaque">Links úteis</h4>

        <ul className="list-disc marker:text-destaque ml-6 space-y-3 mb-10">

          {materiais
            .filter(m => !getYouTubeEmbedUrl(m.getLink))
            .map(m => (
              <li key={m.getId}>
                <a
                  href={m.getLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-destaque hover:underline font-semibold"
                >
                  {m.getNome}
                </a>
              </li>
            ))}
        </ul>

        {/* Vídeos */}
        <Titulo valor="VIDEOS" className="mb-2" />

        <div className="flex flex-col gap-6 mt-8">
        {materiais
        .filter(m => getYouTubeEmbedUrl(m.getLink))
        .map(m => {
          const videoId = getYouTubeEmbedUrl(m.getLink);
          const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        return (

        <div key={m.getId} className="flex gap-6 items-center">

          {/* Miniatura clicável */}
          <a href={m.getLink} target="_blank" rel="noopener noreferrer">
            <img
              src={thumbnail}
              alt={m.getNome}
              className="w-72 h-auto rounded-md" // maior que antes
            />
          </a>

          {/* Título, autor e descrição */}
          <div className="flex flex-col justify-center ml-4 max-w-xl">
            <h5 className="font-semibold text-destaque">
              {m.getNome}
            </h5>
            <span className="mb-4 mt-1 text-sm uppercase tracking-wide text-tenue">
              por EQUIPE PET
            </span>
            <p className="whitespace-pre-wrap">
              {m.getDescricao}
            </p>
          </div>
        </div>
        );
        })}
        </div>
      </div>
    </Layout>
  );
}
