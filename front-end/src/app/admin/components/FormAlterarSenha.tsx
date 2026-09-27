import { useState } from "react"
import Titulo from "./Título"

interface FormProps {

    fechar: () => void
    alterarSenha: (senha: string, senhaConfirmada: string) => void
}

export default function FormAlterarSenha({fechar, alterarSenha}: FormProps) {

    const [senha, setSenha] = useState('')
    const [senhaConfirmada, setSenhaConfirmada] = useState('')

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50 p-4">

            <section className="relative w-max bg-gray-200 pt-12 p-7 rounded-xl">

                <button onClick={fechar} className="absolute right-4 top-2 text-xl font-bold hover:text-red-500">x</button>

                <Titulo valor="Alterar Senha" />

                <form action="" className="flex flex-col gap-4 mt-10">

                    <input name="senha" type="password" placeholder="nova senha" onChange={(e) => setSenha(e.target.value)} value={senha}
                    className="h-10 px-4 rounded-lg border border-gray-100 bg-gray-300 focus:bg-gray-200"/>
                    <input name="senhaConfirmada" type="password" placeholder="confirme sua senha" onChange={(e) => setSenhaConfirmada(e.target.value)} value={senhaConfirmada}
                    className="h-10 px-4 rounded-lg border border-gray-100 bg-gray-300 focus:bg-gray-200"/>

                    <button type="button" onClick={() => alterarSenha(senha, senhaConfirmada)} className="text-white font-bold bg-blue-950 p-3 rounded-md hover:bg-blue-900 duration-300">Alterar</button>
                </form>
            </section>
        </div>
    )
}