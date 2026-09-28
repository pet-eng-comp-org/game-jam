import prismaClient from "../../prisma"

class ObtemMateriaisService {

    async execute() {

        // Por nome: sem ordem, o banco devolvia na que quisesse, e o site
        // mostrava "Workshop 1/2", "PONG", "Workshop 2/2" intercalados. O nome
        // e o que o organizador controla no painel.
        const materiais = await prismaClient.material.findMany({

            orderBy: { nome: "asc" },
            select: {
                id: true,
                nome: true,
                descricao: true,
                link: true
            }
        })

        return materiais
    }
}

export { ObtemMateriaisService }
