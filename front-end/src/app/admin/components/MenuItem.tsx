import Link from "next/link"

interface MenuItemProps {
    texto: string
    icone: React.ReactNode
    url?: string
    className?: string
    onClick?: () => void
}

export default function MenuItem(props: MenuItemProps) {

    const conteudo = (
        <span className={`
            flex flex-col justify-center items-center
            h-20 w-20 text-gray-200 hover:text-gray-700
            ${props.className ?? ""}
        `}>
            {props.icone}
            <span className="text-xs font-light">
                {props.texto}
            </span>
        </span>
    )

    // Link quando leva a uma pagina, botao quando faz uma acao (Sair). Antes o
    // clique ficava num <li>, que o teclado nao alcanca.
    return (
        <li className="shrink-0 hover:bg-gray-100">
            {props.url ? (
                <Link href={props.url}>{conteudo}</Link>
            ) : (
                <button type="button" onClick={props.onClick} className="cursor-pointer">
                    {conteudo}
                </button>
            )}
        </li>
    )
}
