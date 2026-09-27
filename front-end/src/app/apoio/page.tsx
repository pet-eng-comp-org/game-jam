import type { Metadata } from "next";
import Layout from "../components/Layout";
import { patrocinadores } from "@/lib/conteudo";
import Titulo from "../components/Titulo";

export const metadata: Metadata = {
  title: "Patrocinadores",
  description: "Quem apoia o Game Jam, a competição de programação do PET Engenharia de Computação da Ufes.",
};

export default async function Patrocinadores() {

  const lista = await patrocinadores();

  // Como no mockup (frame Patrocinadores 78:775): titulo alinhado a esquerda,
  // na mesma margem das outras paginas.
  return (

    <Layout>

      <div className="mx-auto w-[80%] max-w-[1154px] pt-[98px] pb-24">

        <Titulo valor="patrocinadores" />

        {lista.length > 0 ? (
          <div className="mt-14 flex flex-wrap items-center gap-10">
            {lista.map((p) => (
              <img
                key={p.id}
                src={p.logo}
                alt={p.nome}
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
