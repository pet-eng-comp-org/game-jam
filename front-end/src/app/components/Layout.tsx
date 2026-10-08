import Navbar from "./Navbar"
import Footer from "./Footer"

interface LayoutProps {

    children?: React.ReactNode
    className?: string
}

export default function Layout({ children, className }: LayoutProps) {

    return (

        <div className="relative flex min-h-screen flex-col bg-fundo">

            <Navbar />

            <main className={`flex-1 ${className ?? ""}`}>
                {children}
            </main>

            <Footer />
        </div>
    )
}
