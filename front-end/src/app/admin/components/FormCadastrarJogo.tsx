import { ChangeEvent, useState } from "react"
import Titulo from "./Título"
import Image from "next/image"
import { toast } from "sonner"

interface FormProps {

    fechar: () => void
    cadastrarJogo: (nome: string, capa: File, descricao: string, link: string) => void
}

export default function FormCadastrarJogo({fechar, cadastrarJogo}: FormProps) {

    const [nome, setNome] = useState('')
    const [capa, setCapa] = useState<File>()
    const [preview, setPreview] = useState('')
    const [descricao, setDescricao] = useState('')
    const [link, setLink] = useState('')

    function exibeCapa(e: ChangeEvent<HTMLInputElement>) {

        if(e.target.files && e.target.files[0]){

            const capa = e.target.files[0]

            setCapa(capa)
            setPreview(URL.createObjectURL(capa))
        }
    }

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50 p-4">

            <section className="relative flex flex-col items-center justify-center bg-gray-200 pt-12 p-7 rounded-xl w-full max-w-xl max-h-[92vh] overflow-y-auto">

                <button onClick={fechar} className="absolute right-4 top-2 text-xl font-bold hover:text-red-500">x</button>

                <Titulo valor="Cadastrar Jogo" />

                <form action="" className="flex flex-col gap-4 w-full">

                    <label className="relative flex items-center justify-center bg-gray-300 rounded-md w-full h-64 cursor-pointer hover:border hover:bg-gray-200 duration-300">

                        <span className="text-4xl">+</span>
                        <input 
                        type="file" 
                        accept="image/png, image/jpeg"
                        onChange={exibeCapa}
                        className="hidden" />

                        {
                            preview ? (

                                <Image 
                                    src={preview}
                                    alt="Preview da Capa"
                                    fill
                                    quality={100}
                                    priority
                                />
                            ) : false
                        }
                    </label>

                    <div className="flex flex-col gap-3">

                        <label className="flex flex-col">

                            <span className="text-sm">Nome:</span>
                            <input type="text" 
                            onChange={(e)=>setNome(e.target.value)}
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
                            <input type="text"
                            onChange={(e) => setLink(e.target.value)}
                            value={link} 
                            className="h-10 p-4 rounded-lg border border-gray-100 bg-gray-300 focus:bg-gray-200"
                            />
                        </label>
                    </div>

                    <button type="button" onClick={() => {
                        // Sem capa o clique era ignorado em silencio.
                        if (!capa) return toast.warning("Escolha a capa do jogo.")
                        cadastrarJogo(nome, capa, descricao, link)
                    }} className="text-white font-bold bg-blue-950 p-3 rounded-md hover:bg-blue-900 duration-300">Salvar</button>
                </form>

            </section>
        </div>
    )
}