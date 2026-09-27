import { Jogo } from "@/models/Jogos"
import { IconeLixeira } from "./Icones"
import { capaDoJogo } from "@/lib/capa"

interface JogoProps {

    jogo: Jogo
    editaJogo: (jogo: Jogo) => void
    deletaJogo: (jogo: Jogo) => void
}

export default function JogoComponente({ jogo, editaJogo, deletaJogo }: JogoProps) {

    const d = jogo.getDados
    const titulo = d.nome ?? d.equipe

    return (

        <div className="flex w-full max-w-3xl flex-col gap-5 rounded-md border border-gray-800 p-4 md:flex-row">

            <img src={capaDoJogo(d.capa)} alt={`Capa de ${titulo}`} className="w-full object-cover md:w-44"/>

            <div className="flex w-full flex-col">
                <span className="text-lg font-semibold md:text-xl">{titulo}</span>
                {d.nome && <span className="mb-3 text-sm text-gray-600">por {d.equipe}</span>}
                <div className="w-full text-sm md:text-base">
                    {d.descricao}
                </div>

                <div className="flex grow items-end justify-end gap-2">
                    <button onClick={() => editaJogo(jogo)} className="rounded-md px-3 py-1 font-semibold text-blue-950 hover:bg-blue-950 hover:text-white">Editar</button>
                    <button onClick={() => deletaJogo(jogo)} aria-label={`Apagar ${titulo}`}
                    className="rounded-full p-2 text-red-500 hover:bg-red-500 hover:text-white">{IconeLixeira}</button>
                </div>
            </div>
        </div>
    )
}
