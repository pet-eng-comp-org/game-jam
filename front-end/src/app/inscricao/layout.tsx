import type { Metadata } from "next";

// A pagina e de cliente (formulario); o titulo fica aqui.
export const metadata: Metadata = {
  title: "Inscrição",
  description: "Inscreva sua equipe no Game Jam, a competição de programação do PET Engenharia de Computação da Ufes.",
};

export default function LayoutInscricao({ children }: { children: React.ReactNode }) {
  return children;
}
