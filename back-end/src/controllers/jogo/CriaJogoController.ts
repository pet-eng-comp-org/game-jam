import { Request, Response } from "express";
import prismaClient from "../../prisma";
import { dadosDoJogo } from "../../utils/jogo";

class CriaJogoController {
    async handle(req: Request, res: Response): Promise<any> {
        if (!req.file) return res.status(400).json({ error: "Envie a capa do jogo." })

        const seasonId = typeof req.body?.seasonId === "string" ? req.body.seasonId : ""
        const season = seasonId ? await prismaClient.season.findUnique({ where: { id: seasonId } }) : null
        if (!season) return res.status(400).json({ error: "Season não encontrada." })

        const dados = dadosDoJogo(req.body)
        if (typeof dados === "string") return res.status(400).json({ error: dados })

        const jogo = await prismaClient.jogo.create({ data: { ...dados, capa: req.file.filename, seasonId } })
        return res.status(201).json(jogo)
    }
}

export { CriaJogoController }
