import { ChangeEvent, useState } from "react"
import Titulo from "./Título"
import Image from "next/image"

interface FormProps {
    fechar: () => void
    cadastrarPatrocinador: (nome: string, logo: File) => void
}

export default function FormCadastrarPatrocinador({ fechar, cadastrarPatrocinador }: FormProps) {

    const [nome, setNome] = useState('')
    const [logo, setLogo] = useState<File>()
    const [preview, setPreview] = useState('')

    function exibeLogo(e: ChangeEvent<HTMLInputElement>) {

        if (e.target.files && e.target.files[0]) {
            const arquivo = e.target.files[0]
            setLogo(arquivo)
            setPreview(URL.createObjectURL(arquivo))
        }
    }

    return (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50 p-4">
            <section className="relative flex flex-col items-center justify-center bg-gray-200 pt-12 p-7 rounded-xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
                
                <button onClick={fechar} className="absolute right-4 top-2 text-xl font-bold hover:text-red-500">x</button>

                <Titulo valor="Cadastrar Patrocinador" nivel={2} />

                <form className="flex flex-col gap-4 w-full" onSubmit={e => e.preventDefault()}>
                    
                    <label className="flex flex-col">
                        <span className="text-sm">Nome:</span>
                        <input
                            type="text"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            className="h-10 px-4 rounded-lg border border-gray-100 bg-gray-300 focus:bg-gray-200"
                        />
                    </label>

                    <label className="relative flex items-center justify-center bg-gray-300 rounded-md w-full h-64 cursor-pointer hover:border hover:bg-gray-200 duration-300">
                        <span className="text-4xl">{!preview ? "+" : ""}</span>
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={exibeLogo}
                            className="hidden"
                        />
                        {preview && (
                            <Image
                                src={preview}
                                alt="Preview da Logo"
                                fill
                                className="object-contain rounded-md"
                                quality={100}
                                priority
                            />
                        )}
                    </label>

                    <button
                        type="button"
                        onClick={() => { if (nome && logo) cadastrarPatrocinador(nome, logo) }}
                        className="text-white font-bold bg-blue-950 p-3 rounded-md hover:bg-blue-900 duration-300"
                    >
                        Salvar
                    </button>

                </form>
            </section>
        </div>
    )
}
