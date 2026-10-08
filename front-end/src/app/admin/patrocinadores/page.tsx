"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import { Patrocinador } from "@/models/Patrocinadores"
import PatrocinadorComponente from "../components/PatrocinadorComponente"
import FormCadastrarPatrocinador from "../components/FormCadastrarPatrocinador"
import Botao from "../components/Botao"

export default function Patrocinadores() {

    const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>()
    const [exibeFormCadastro, setExibeFormCadastro] = useState(false)

    async function cadastrarPatrocinador(nome: string, logo: File, site: string) {

        const data = new FormData()
        data.append("nome", nome)
        data.append("logo", logo)
        data.append("site", site)

        await Patrocinador.cadastrar(data)
        setExibeFormCadastro(false)
        carregaPatrocinadores()
    }

    async function carregaPatrocinadores() {

        const response: Patrocinador[] = await Patrocinador.obtemTodosPatrocinadores()
        setPatrocinadores(response)
    }

    async function deletaPatrocinador(patrocinador: Patrocinador) {

        await patrocinador.deletar()
        carregaPatrocinadores()
    }

    useEffect(() => {
        carregaPatrocinadores()
    }, [])

    return (
        
        <Layout 
            titulo="Patrocinadores"
            form={exibeFormCadastro 
                ? <FormCadastrarPatrocinador 
                    cadastrarPatrocinador={cadastrarPatrocinador} 
                    fechar={() => setExibeFormCadastro(false)} 
                  /> 
                : false}
        >
            <Botao nome="Cadastrar Patrocinador" onClick={() => setExibeFormCadastro(true)} className="mb-5"/>

            <ul className="flex flex-col gap-5">
                {
                    patrocinadores?.length === 0 ? (
                        <span>Não há patrocinadores cadastrados.</span>
                    ) : (
                        patrocinadores?.map((patrocinador) => (
                            <PatrocinadorComponente 
                                deletaPatrocinador={deletaPatrocinador} 
                                patrocinador={patrocinador} 
                                key={patrocinador.getId}
                            />
                        ))
                    )
                }
            </ul>
        </Layout>
    )
}
