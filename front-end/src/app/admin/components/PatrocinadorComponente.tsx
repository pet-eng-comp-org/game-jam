import { Patrocinador } from "@/models/Patrocinadores"
import { IconeLixeira } from "./Icones"

interface PatrocinadorProps {

    patrocinador: Patrocinador
    deletaPatrocinador: (patrocinador: Patrocinador) => void
}

export default function PatrocinadorComponente({ patrocinador, deletaPatrocinador }: PatrocinadorProps) {

    return (

        <div className="bg-white border border-gray-300 rounded-lg p-5 w-full max-w-sm flex flex-col items-start gap-3">

            <div className="flex justify-between items-center w-full">
                <span className="text-xl font-semibold text-gray-800">
                    {patrocinador.getNome}
                </span>

                <button 
                    onClick={() => deletaPatrocinador(patrocinador)}
                    className="text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full transition"
                >
                    {IconeLixeira}
                </button>
            </div>

            {patrocinador.getSite && (
                <a href={patrocinador.getSite} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-800 underline break-all">
                    {patrocinador.getSite}
                </a>
            )}

            {patrocinador.getLogo && (
                <img 
                    src={patrocinador.getLogo} 
                    alt={patrocinador.getNome} 
                    className="w-full max-h-48 object-contain rounded-md border border-gray-200"
                />
            )}
        </div>
    )
}
