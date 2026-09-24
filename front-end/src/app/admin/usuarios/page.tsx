"use client"

import { useEffect, useState } from "react"
import { IconeLixeira } from "../components/Icones";
import { Usuario } from "@/models/Usuario";
import FormCadastrarUsuario from "../components/FormCadastrarUsuario";
import { toast } from "sonner";
import Botao from "../components/Botao";
import Layout from "../components/Layout"
import type { UsuarioJson } from "@/models/api";

export default function Usuarios() {

    const [usuarios, setUsuarios] = useState<Usuario[]>([])

    const [abreCadastro, setAbreCadastro] = useState(false)

    async function deletaUsuario(usuario: Usuario) {

        await usuario.deletar()

        carregaUsuarios()
    }

    async function cadastrarUsuario(username:string, senha:string) {

        if(username === '' || senha === '') {
            toast.warning("Preencha todos os campos")
            return
        }

        const usuario = new Usuario(username, undefined, senha)

        await usuario.cadastrar()

        setAbreCadastro(false)
        carregaUsuarios()
    }
    
    async function carregaUsuarios() {

        await Usuario.obtemTodos().then((users: UsuarioJson[]) => {
            const vetor = users.map(Usuario.fromJson)
            setUsuarios(vetor)
        })
    }

    useEffect(() => {
        carregaUsuarios()
    }, [])


    function renderizaUsuarios() {

        return usuarios.map((usuario, i) => {

            return(

            <tr key={usuario.getId}>

                <td className={`w-[200px] p-2 text-lg ${((i+1) % 2) ? 'bg-gray-300' : 'bg-gray-200'}`}>
                    {usuario.getUsername}
                </td>

                <td className={`w-[200px] p-2 text-lg ${((i) % 2) ? 'bg-gray-300' : 'bg-gray-200'} `}>

                        <button onClick={() => deletaUsuario(usuario)} 
                        className="hover:text-red-500 hover:bg-blue-950 p-2 rounded-full">
                            {IconeLixeira}
                        </button>
                </td>
            </tr>

            )
        })
    }

    return (

        <Layout titulo="Usuários"
        form={abreCadastro ? <FormCadastrarUsuario cadastrarUsuario={cadastrarUsuario} fechar={() => setAbreCadastro(false)}/> : false}
        >

            <p className="mb-10">
                Nesta seção, você pode gerenciar os usuários que tem acesso ao sistema.
            </p>

            <Botao nome="Cadastrar Usuário" onClick={() => setAbreCadastro(true)} className="mb-5"/>

            <table className="w-1/2 rounded-xl">
                <thead className="font-bold bg-blue-950 text-white">
                    <tr>
                        <th className="rounded-tl-xl p-2 border-r border-r-white">username</th>
                        <th className="rounded-tr-xl p-2">ações</th>
                    </tr>
                </thead>
                <tbody>
                    {renderizaUsuarios()}
                </tbody>
            </table>
        </Layout>
    )
}