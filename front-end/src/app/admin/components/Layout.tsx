import Menu from "./Menu"
import Titulo from "./Título"

interface LayoutProps {

    titulo: string
    form?: React.ReactNode
    children?: React.ReactNode
}

export default function Layout({ titulo, form, children }: LayoutProps) {

    return (

        // text-blue-950: o body do site usa texto amarelo claro (visual da Season
        // 4), e sem isto o painel, de fundo cinza, herdava essa cor e ficava ilegivel.
        <div className="flex text-blue-950">
            <Menu />

            {form}

            <div className="flex min-w-0 flex-col border p-10 w-full bg-gray-200">

                <Titulo valor={titulo}/>

                {children}
            </div>
        </div>
    )
}