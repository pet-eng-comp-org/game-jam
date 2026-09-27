// A CAIXA do texto importa: no PacFont a maiuscula e um desenho vazado e a
// minuscula e solida, entao trocar o caso troca o estilo do titulo. Por isso
// nao existe text-transform aqui — quem chama decide, como no mockup.
// No celular o tamanho acompanha a largura da tela (ate os 30px de antes):
// "patrocinadores" e uma palavra so e passava da tela em 390px.
interface TituloProps {

    valor: string
    className?: string
}

export default function Titulo(props: TituloProps) {

    return (

        <h2
            className={`font-titulo text-[min(30px,6.3vw)] leading-tight text-destaque md:text-[53px] md:leading-[71px] ${props.className ?? ""}`}
        >
            {props.valor}
        </h2>
    )
}
