import { Request, Response } from "express";
import prismaClient from "../../prisma";
import { dadosDoJogo } from "../../utils/jogo";

// Edita os textos de um jogo (nome, equipe, participantes, descricao, link,
// ordem). A capa so muda apagando e cadastrando de novo.
class EditaJogoController {
    async handle(req: Request, res: Response): Promise<any> {
        const id = req.query.id
        if (typeof id !== "string" || !id) return res.status(400).json({ error: "Informe o jogo." })
        if (!(await prismaClient.jogo.findUnique({ where: { id } }))) return res.status(404).json({ error: "Jogo não encontrado." })

        const dados = dadosDoJogo(req.body)
        if (typeof dados === "string") return res.status(400).json({ error: dados })

        return res.json(await prismaClient.jogo.update({ where: { id }, data: dados }))
    }
}

export { EditaJogoController }
