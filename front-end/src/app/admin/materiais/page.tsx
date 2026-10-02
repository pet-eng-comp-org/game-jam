"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import { Material } from "@/models/Materiais"
import MaterialComponente from "../components/MaterialComponente"
import FormCadastrarMaterial from "../components/FormCadastrarMaterial"
import Botao from "../components/Botao"

export default function Materiais() {

    const [materiais, setMateriais] = useState<Material[]>()
    const [exibeFormCadastro, setExibeFormCadastro] = useState(false)
    const [editando, setEditando] = useState<Material | null>(null)

    async function cadastrarMaterial(nome: string, descricao: string, link: string) {

        if (!(await Material.cadastrar({ nome, descricao, link }))) return
        setExibeFormCadastro(false)
        carregaMateriais()
    }

    async function salvaEdicao(nome: string, descricao: string, link: string) {

        if (!editando || !(await editando.editar({ nome, descricao, link }))) return
        setEditando(null)
        carregaMateriais()
    }

    async function carregaMateriais() {
        
        const response: Material[] = await Material.obtemTodosMateriais()
        setMateriais(response)
    }

    async function deletaMaterial(material: Material) {

        // Sai do site na hora, e nao da para desfazer: pergunta antes.
        if (!window.confirm(`Apagar o material "${material.getNome}"? Ele sai do site.`)) return
        await material.deletar()
        carregaMateriais()
    }

    useEffect(() => {
        carregaMateriais()
    }, [])

    return (
        
        <Layout 
            titulo="Materiais"
            form={editando
                ? <FormCadastrarMaterial
                    key={editando.getId}
                    inicial={{ nome: editando.getNome, descricao: editando.getDescricao, link: editando.getLink }}
                    cadastrarMaterial={salvaEdicao}
                    fechar={() => setEditando(null)}
                  />
                : exibeFormCadastro
                ? <FormCadastrarMaterial 
                    cadastrarMaterial={cadastrarMaterial} 
                    fechar={() => setExibeFormCadastro(false)} 
                  /> 
                : false}
        >
            <Botao nome="Cadastrar Material" onClick={() => setExibeFormCadastro(true)} className="mb-5"/>

            <ul className="flex flex-col gap-5">
                {
                    materiais?.length === 0 ? (
                        <span>Não há materiais cadastrados.</span>
                    ) : (
                        materiais?.map((material) => (
                            <MaterialComponente 
                                deletaMaterial={deletaMaterial} 
                                editaMaterial={setEditando}
                                material={material} 
                                key={material.getId}
                            />
                        ))
                    )
                }
            </ul>
        </Layout>
    )
}
