import Layout from "../components/Layout"
import ListaDeSeasons from "./ListaDeSeasons"
import { seasonsComJogos } from "@/lib/conteudo"

// Os jogos vem do banco (cadastrados pelo painel; o historico de cada um esta
// na migration 20260926210000_jogos_no_banco). So entram as seasons que ja tem
// jogo, da mais antiga para a mais nova.
export default async function Jogos() {

  const temporadas = (await seasonsComJogos())
    .filter((s) => s.jogos.length > 0)
    .sort((a, b) => Number(a.numero) - Number(b.numero))

  return (
    <Layout>
      <ListaDeSeasons temporadas={temporadas} />
    </Layout>
  )
}
