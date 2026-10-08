import type { Metadata } from "next";
import Layout from "../components/Layout";
import { patrocinadores } from "@/lib/conteudo";
import Titulo from "../components/Titulo";
import { PAGINA } from "../components/estilo";
import FaixaPatrocinadores from "../components/Patrocinadores";

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

      <div className={PAGINA}>

        <Titulo valor="patrocinadores" />

        {lista.length > 0 ? (
          <div className="mt-14">
            <FaixaPatrocinadores lista={lista} />
          </div>
        ) : (
          <p className="mt-6 text-lg">Os patrocinadores desta edição serão divulgados em breve.</p>
        )}
      </div>
    </Layout>
  );
}
