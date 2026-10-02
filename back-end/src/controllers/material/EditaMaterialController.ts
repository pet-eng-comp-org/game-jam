import { Request, Response } from "express";
import prismaClient from "../../prisma";
import { dadosDoMaterial } from "../../utils/material";

// Edita nome, descricao e link de um material. Antes so dava para cadastrar e
// apagar: corrigir um erro de digitacao pedia migration.
class EditaMaterialController {
    async handle(req: Request, res: Response): Promise<any> {
        const id = req.query.id
        if (typeof id !== "string" || !id) return res.status(400).json({ error: "Informe o material." })
        if (!(await prismaClient.material.findUnique({ where: { id } }))) return res.status(404).json({ error: "Material não encontrado." })

        const dados = dadosDoMaterial(req.body)
        if (typeof dados === "string") return res.status(400).json({ error: dados })

        return res.json(await prismaClient.material.update({ where: { id }, data: { ...dados, updatedAt: new Date() } }))
    }
}

export { EditaMaterialController }
