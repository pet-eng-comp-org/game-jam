import fs from "node:fs";
import path from "node:path";
import prismaClient from "../../prisma";

interface JogoRequest {

    id: string
}

class DeletaJogoService {

    async execute({ id }: JogoRequest) {

        const jogo = await prismaClient.jogo.delete({ where: { id } })

        // So apaga capa enviada pelo painel (um nome de arquivo em tmp/). As
        // capas dos jogos antigos sao caminhos do proprio site ("/jogos/x.jpg")
        // e ficam no front-end.
        if (jogo.capa && !jogo.capa.includes("/")) {
            fs.unlink(path.join(__dirname, '..', '..', '..', 'tmp', jogo.capa), (err) => {
                if (err) console.error('Erro ao deletar imagem:', err);
            });
        }

        return jogo
    }
}

export { DeletaJogoService }
