import type { Metadata } from "next";
import Layout from "../components/Layout"
import ListaDeSeasons from "./ListaDeSeasons"
import { seasonsComJogos } from "@/lib/conteudo"

export const metadata: Metadata = {
  title: "Jogos das edições anteriores",
  description: "Os jogos criados nas três primeiras edições do Game Jam da Ufes, todos jogáveis no navegador.",
};

// Os jogos vem do banco (cadastrados pelo painel; o historico de cada um esta
// na migration 20260926210000_jogos_no_banco). So entram as seasons que ja tem
// jogo, da mais nova para a mais antiga: os jogos mais recentes primeiro.
export default async function Jogos() {

  const temporadas = (await seasonsComJogos())
    .filter((s) => s.jogos.length > 0)
    .sort((a, b) => Number(b.numero) - Number(a.numero))

  return (
    <Layout>
      <ListaDeSeasons temporadas={temporadas} />
    </Layout>
  )
}
