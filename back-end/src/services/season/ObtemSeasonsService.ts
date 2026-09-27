import prismaClient from "../../prisma";
import { comSituacao } from "../../utils/season";

class ObtemSeasonsService {

    async execute() {

        const seasons = await prismaClient.season.findMany({
            orderBy:{
                numero: "asc"
            }
        })

        return seasons.map(comSituacao)
    }
}

export { ObtemSeasonsService }