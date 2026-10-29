import type { Metadata } from "next";
import Layout from "../components/Layout";

// A pagina e de cliente (formulario); o titulo e a barra e o rodape do site
// (componentes de servidor) ficam aqui.
export const metadata: Metadata = {
  title: "Inscrição",
  description: "Inscreva sua equipe no Game Jam, a competição de programação do PET Engenharia de Computação da Ufes.",
};

export default function LayoutInscricao({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
