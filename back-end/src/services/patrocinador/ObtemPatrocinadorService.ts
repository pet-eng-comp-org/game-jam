import prismaClient from "../../prisma";
import { Request } from "express";

class ObtemPatrocinadoresService {

    async execute(req?: Request) {

        const patrocinadores = await prismaClient.patrocinador.findMany({

            select: {
                id: true,
                nome: true,
                logo: true,
                site: true
            }
        });

        if (req) {

            const host = `${req.protocol}://${req.get('host')}`;

            return patrocinadores.map(p => ({
                ...p,
                logo: `${host}${p.logo}` 
            }));
        }

        return patrocinadores;
    }
}

export { ObtemPatrocinadoresService };
