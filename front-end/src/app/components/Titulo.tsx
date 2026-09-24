import { semAcento } from "@/lib/texto"

// O titulo recebe o texto CERTO, com acento; ver semAcento em lib/texto.ts.
// A CAIXA do texto importa: no PacFont a maiuscula e um desenho vazado e a
// minuscula e solida, entao trocar o caso troca o estilo do titulo. Por isso
// nao existe text-transform aqui — quem chama decide, como no mockup.
interface TituloProps {

    valor: string
    className?: string
}

export default function Titulo(props: TituloProps) {

    const exibido = semAcento(props.valor)
    const mudou = exibido !== props.valor

    return (

        <h2
            aria-label={mudou ? props.valor : undefined}
            className={`font-titulo text-3xl leading-tight text-destaque md:text-[53px] md:leading-[71px] ${props.className ?? ""}`}
        >
            {exibido}
        </h2>
    )
}
