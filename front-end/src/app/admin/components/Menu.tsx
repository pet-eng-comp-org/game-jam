"use client"

import MenuItem from "./MenuItem"
import Image from "next/image"
import logoPET from "../../../../public/logo-pet.png"
import { IconeUsuarios, IconeSair, IconePerfil, IconeDinheiro, IconeComputador, IconeEquipe, IconeMaterial } from "./Icones"
import { useRouter } from "next/navigation"

export default function Menu() {

    const router = useRouter()

    async function logout() {
        
        // O cookie da sessao e httpOnly: quem apaga e o servidor.
        await fetch("/api/sessao", { method: "DELETE" })
        router.replace("/login")
    }

    return (

        // No celular o menu vira uma faixa no topo: os itens rolam para o lado e
        // o Sair fica fixo a direita (antes ele ficava fora da tela). A partir
        // de md, a coluna lateral de sempre. A ordem vai do mais usado (equipes,
        // na epoca de inscricao) ao menos usado.
        <aside className={`
            sticky top-0 z-40 flex bg-blue-950 text-white
            md:h-screen md:flex-col
        `}>

            <div className="hidden h-16 p-3 md:flex justify-center items-center">
                <Image src={logoPET} alt="Logo do PET Engenharia de Computação" height={50}/>
            </div>
            <ul className="flex min-w-0 flex-1 overflow-x-auto md:grow md:flex-col md:overflow-visible">
                <MenuItem url="/admin" texto="Início" icone={IconePerfil}/>
                <MenuItem url="/admin/equipes" texto="Equipes" icone={IconeEquipe}/>
                <MenuItem url="/admin/seasons" texto="Season" icone={IconeComputador}/>
                <MenuItem url="/admin/jogos" texto="Jogos" icone={IconeComputador}/>
                <MenuItem url="/admin/materiais" texto="Materiais" icone={IconeMaterial}/>
                <MenuItem url="/admin/patrocinadores" texto="Patrocínio" icone={IconeDinheiro}/>
                <MenuItem url="/admin/usuarios" texto="Usuários" icone={IconeUsuarios}/>
            </ul>
            <ul className="flex shrink-0 border-l border-white/15 md:flex-col md:border-l-0">
                <MenuItem 
                    onClick={logout} 
                    texto="Sair" 
                    icone={IconeSair}
                    className={`
                        hover:bg-red-400 hover:text-white
                    `}
                />
            </ul>
        </aside>
    )
}