import prismaClient from "../../prisma";
import { comSituacao } from "../../utils/season";

class ObtemSeasonsComJogosService {

    async execute() {

        const seasons = await prismaClient.season.findMany({
            orderBy:{
                numero: "asc"
            },
            include:{
                jogos: { orderBy: [{ ordem: "asc" }, { createdAt: "asc" }] }
            }
        })

        return seasons.map(comSituacao)
    }
}

export { ObtemSeasonsComJogosService }