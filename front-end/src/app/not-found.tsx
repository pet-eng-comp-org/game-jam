import type { Metadata } from "next";
import Link from "next/link";
import Layout from "./components/Layout";
import Personagem from "./components/Personagem";
import { PAGINA, TEXTO } from "./components/estilo";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

// Link errado ou pagina que saiu do ar. Antes caia na tela padrao do Next, em
// branco e em ingles, sem barra nem caminho de volta.
export default function NaoEncontrada() {
  return (
    <Layout>
      <div className={`${PAGINA} flex flex-col items-center text-center`}>
        <Personagem qual="ciano" className="h-16 w-16 md:h-20 md:w-20" />
        <h1 className="mt-8 text-balance font-secao text-5xl uppercase leading-none text-destaque md:text-7xl">
          Essa página não existe
        </h1>
        <p className={`mt-6 ${TEXTO}`}>
          O endereço pode estar digitado errado, ou a página mudou de lugar.
        </p>
        <Link
          href="/"
          className="mt-10 rounded-full bg-destaque px-8 py-3 text-lg font-bold text-barra transition-opacity hover:opacity-90"
        >
          Ir para o início
        </Link>
      </div>
    </Layout>
  );
}
