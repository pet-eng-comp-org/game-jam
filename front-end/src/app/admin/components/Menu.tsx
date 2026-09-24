"use client"

import MenuItem from "./MenuItem"
import Image from "next/image"
import logoPET from "../../../../public/logo-pet.png"
import { IconeUsuarios, IconeSair, IconePerfil, IconeDinheiro, IconeComputador, IconeEquipe, IconeMaterial } from "./Icones"
import { deleteCookieClient } from "@/lib/cookieClient"
import { useRouter } from "next/navigation"

export default function Menu() {

    const router = useRouter()

    async function logout() {
        
        deleteCookieClient()
        router.replace("/login")
    }

    return (

        <aside className={`
            sticky top-0
            flex flex-col h-screen
            bg-blue-950 text-white
        `}>

            <div className="h-16 p-3 flex justify-center items-center">
                <Image src={logoPET} alt="Logo do PET Engenharia de Computação" height={50}/>
            </div>
            <ul className="grow">
                <MenuItem url="/admin/usuarios" texto="Usuários" icone={IconeUsuarios}/>
                <MenuItem url="/admin/seasons" texto="Season" icone={IconeComputador}/>
                <MenuItem url="/admin/jogos" texto="Jogos" icone={IconeComputador}/>
                <MenuItem url="/admin/equipes" texto="Equipes" icone={IconeEquipe}/>
                <MenuItem url="/admin/materiais" texto="Materiais" icone={IconeMaterial}/>
                <MenuItem url="/admin/patrocinadores" texto="Patrocínio" icone={IconeDinheiro}/>
            </ul>
            <ul>
                <MenuItem
                    url="/admin"
                    texto="Perfil"
                    icone={IconePerfil}
                />
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