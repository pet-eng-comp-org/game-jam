// Titulo da pagina: PacFont, um por pagina, e e o <h1> dela.
//
// A CAIXA do texto importa: no PacFont a maiuscula e um desenho vazado, fino e
// dificil de ler, e a minuscula e solida. O site usa sempre a solida: quem
// chama passa o texto em minusculas.
// No celular o tamanho acompanha a largura da tela: "patrocinadores" e uma
// palavra so e passava da tela em 390px.
interface TituloProps {

    valor: string
    className?: string
}

export default function Titulo(props: TituloProps) {

    return (

        <h1
            className={`font-titulo text-[min(30px,6.3vw)] leading-tight text-destaque md:text-[53px] md:leading-[71px] ${props.className ?? ""}`}
        >
            {props.valor}
        </h1>
    )
}
