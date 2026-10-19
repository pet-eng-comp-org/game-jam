// Titulos dentro da pagina, em Jomhuria caixa alta amarela (a condensada dos
// titulos das seasons). Dois niveis:
//   secao (h2):    as partes da pagina ("Como funciona", "Equipes e inscrição")
//   subsecao (h3): partes de uma secao ("Super PETs", "Vídeos")
// A Jomhuria tem os acentuados, entao a caixa alta vem do CSS.
interface TituloSecaoProps {

    valor: string
    className?: string
    id?: string
    subsecao?: boolean
}

export default function TituloSecao({ valor, className, subsecao = false, id }: TituloSecaoProps) {

    const Tag = subsecao ? "h3" : "h2"
    const tamanho = subsecao ? "text-3xl md:text-4xl" : "text-4xl md:text-6xl"

    return (

        <Tag id={id} className={`font-secao uppercase leading-none text-destaque ${tamanho} ${className ?? ""}`}>
            {valor}
        </Tag>
    )
}
