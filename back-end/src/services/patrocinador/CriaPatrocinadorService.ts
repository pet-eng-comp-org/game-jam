import prismaClient from "../../prisma";

interface PatrocinadorRequest {
    nome: string;
    logo: string;
    site: string | null;
}

class CriaPatrocinadorService {

    async execute({ nome, logo, site }: PatrocinadorRequest) {

        const patrocinador = await prismaClient.patrocinador.create({
            data: {
                nome,
                logo,
                site
            }
        });

        return patrocinador;
    }
}

export { CriaPatrocinadorService };
