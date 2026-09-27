import prismaClient from "../../prisma";
import { comSituacao } from "../../utils/season";

class ObtemSeasonsComJogosService {

    async execute() {

        const seasons = await prismaClient.season.findMany({
            orderBy:{
                numero: "asc"
            },
            include:{
                jogos: true
            }
        })

        return seasons.map(comSituacao)
    }
}

export { ObtemSeasonsComJogosService }