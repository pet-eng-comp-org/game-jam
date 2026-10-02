import prismaClient from "../../prisma";
import { comSituacao } from "../../utils/season";

class ObtemAtualSeasonService {

    async execute() {

        const seasonAtual = await prismaClient.season.findFirst({

            where:{
                atual: true
            }
        })

        return seasonAtual ? comSituacao(seasonAtual) : null
    }
}

export { ObtemAtualSeasonService }