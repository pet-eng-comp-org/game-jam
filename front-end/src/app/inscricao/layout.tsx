import type { Metadata } from "next";
import Layout from "../components/Layout";

// O titulo, a barra e o rodape do site
// (componentes de servidor) ficam aqui.
export const metadata: Metadata = {
  title: "Inscrição",
  description: "Como se inscrever no Game Jam 26: por e-mail, até a véspera do dia em que você vai.",
};

export default function LayoutInscricao({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
