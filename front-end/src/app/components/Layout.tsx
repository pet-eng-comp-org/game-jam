import Navbar from "./Navbar"
import Footer from "./Footer"
import { patrocinadores } from "@/lib/conteudo"

interface LayoutProps {

    children?: React.ReactNode
    className?: string
}

// Componente de servidor: busca os patrocinadores junto com o resto do
// conteudo (mesmo cache), para a barra so mostrar o link quando houver algum.
export default async function Layout({ children, className }: LayoutProps) {

    const temPatrocinadores = (await patrocinadores()).length > 0

    return (

        <div className="relative flex min-h-screen flex-col bg-fundo">

            <Navbar mostraPatrocinadores={temPatrocinadores} />

            <main className={`flex-1 ${className ?? ""}`}>
                {children}
            </main>

            <Footer />
        </div>
    )
}
