"use client";

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Patrocinador } from "@/models/Patrocinadores";
import Titulo from "../components/Titulo";

export default function Patrocinadores() {

  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([]);

  async function obtemPatrocinadores() {

    const p = await Patrocinador.obtemTodosPatrocinadores();
    setPatrocinadores(p);
  }

  useEffect(() => {
    obtemPatrocinadores();
  }, []);

  // Como no mockup (frame Patrocinadores 78:775): titulo alinhado a esquerda,
  // na mesma margem das outras paginas.
  return (

    <Layout>

      <div className="mx-auto w-[80%] max-w-[1154px] pt-[98px] pb-24">

        <Titulo valor="patrocinadores" />

        {patrocinadores.length > 0 ? (
          <div className="mt-14 flex flex-wrap items-center gap-10">
            {patrocinadores.map((p) => (
              <img
                key={p.getId}
                src={p.getLogo}
                alt={p.getNome}
                className="h-30 w-auto object-contain"
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-lg">Os patrocinadores desta edição serão divulgados em breve.</p>
        )}
      </div>
    </Layout>
  );
}
