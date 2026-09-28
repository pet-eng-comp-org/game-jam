interface TituloProps {

    valor: string
    // 1 no titulo da pagina (Layout), 2 nos formularios que abrem por cima.
    // Antes era um <span>: o painel nao tinha titulo nenhum para leitor de tela.
    nivel?: 1 | 2
}

export default function Titulo({ valor, nivel = 1 }: TituloProps) {

    const Tag = nivel === 1 ? "h1" : "h2"
    return (

        <Tag className="text-4xl font-extrabold mb-10">
            {valor}
        </Tag>
    )
}