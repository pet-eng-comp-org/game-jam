import { useState } from "react"
import Titulo from "./Título"

// Cadastra um material ou, com `inicial`, edita um que ja existe.
interface FormProps {
    fechar: () => void
    cadastrarMaterial: (nome: string, descricao: string, link: string) => void
    inicial?: { nome: string; descricao: string; link: string }
}

export default function FormCadastrarMaterial({ fechar, cadastrarMaterial, inicial }: FormProps) {

    const [nome, setNome] = useState(inicial?.nome ?? '')
    const [descricao, setDescricao] = useState(inicial?.descricao ?? '')
    const [link, setLink] = useState(inicial?.link ?? '')

    return (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50 p-4">
            <section className="relative flex flex-col items-center justify-center bg-gray-200 pt-12 p-7 rounded-xl w-full max-w-xl max-h-[92vh] overflow-y-auto">

                <button type="button" onClick={fechar} aria-label="Fechar" className="absolute right-4 top-2 text-xl font-bold hover:text-red-500">x</button>

                <Titulo valor={inicial ? "Editar Material" : "Cadastrar Material"} nivel={2} />

                <form action="" className="flex flex-col gap-4 w-full">

                    <div className="flex flex-col gap-3">

                        <label className="flex flex-col">
                            <span className="text-sm">Nome:</span>
                            <input 
                                type="text" 
                                onChange={(e) => setNome(e.target.value)}
                                value={nome}
                                className="h-10 px-4 rounded-lg border border-gray-100 bg-gray-300 focus:bg-gray-200"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm">Descrição:</span>
                            <textarea
                                onChange={(e) => setDescricao(e.target.value)}
                                value={descricao}
                                className="h-28 p-4 rounded-lg border border-gray-100 bg-gray-300 focus:bg-gray-200"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="text-sm">Link:</span>
                            <input 
                                type="url"
                                placeholder="https://"
                                onChange={(e) => setLink(e.target.value)}
                                value={link}
                                className="h-10 p-4 rounded-lg border border-gray-100 bg-gray-300 focus:bg-gray-200"
                            />
                        </label>
                    </div>

                    <button 
                        type="button" 
                        onClick={() => cadastrarMaterial(nome, descricao, link)} 
                        className="text-white font-bold bg-blue-950 p-3 rounded-md hover:bg-blue-900 duration-300"
                    >
                        Salvar
                    </button>
                </form>
            </section>
        </div>
    )
}
