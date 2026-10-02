// Titulo da pagina: um por pagina, e e o <h1> dela. Mesma letra e tamanho do
// titulo da pagina inicial (Jomhuria em caixa alta); os titulos de secao
// (TituloSecao) sao a mesma letra, menor.
interface TituloProps {

    valor: string
    className?: string
}

export default function Titulo(props: TituloProps) {

    return (

        <h1
            className={`font-secao text-5xl uppercase leading-none text-destaque md:text-7xl lg:text-8xl ${props.className ?? ""}`}
        >
            {props.valor}
        </h1>
    )
}
