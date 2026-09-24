import prismaClient from "../../prisma";

class ApagaCpfsSeasonService {

    // O CPF so existe para o certificado da PROEX. Emitidos os certificados de
    // uma season, a organizacao apaga os CPFs dela pelo painel: nome, e-mail e
    // o resto da inscricao ficam.
    async execute(id: string) {

        const { count } = await prismaClient.participante.updateMany({
            where: { equipe: { seasonId: id }, cpf: { not: null } },
            data: { cpf: null },
        })

        return { apagados: count }
    }
}

export { ApagaCpfsSeasonService }
