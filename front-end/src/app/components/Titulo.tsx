// A CAIXA do texto importa: no PacFont a maiuscula e um desenho vazado e a
// minuscula e solida, entao trocar o caso troca o estilo do titulo. Por isso
// nao existe text-transform aqui — quem chama decide, como no mockup.
interface TituloProps {

    valor: string
    className?: string
}

export default function Titulo(props: TituloProps) {

    return (

        <h2
            className={`font-titulo text-3xl leading-tight text-destaque md:text-[53px] md:leading-[71px] ${props.className ?? ""}`}
        >
            {props.valor}
        </h2>
    )
}
