import { Request, Response } from "express";
import { ObtemEquipesService } from "../../services/equipe/ObtemEquipeService";
import { DeletaEquipeService } from "../../services/equipe/DeletaEquipeService";
import prismaClient from "../../prisma";

// A lista de inscritos do painel. Antes dela, a organizacao so via as equipes
// pelo phpMyAdmin.
class ObtemEquipesController {

  async handle(req: Request, res: Response): Promise<any> {

    const seasonId = req.query.seasonId

    if (typeof seasonId !== "string" || !seasonId) {
      return res.status(400).json({ error: "Informe a season." })
    }

    return res.json(await new ObtemEquipesService().execute(seasonId))
  }
}

class DeletaEquipeController {

  async handle(req: Request, res: Response): Promise<any> {

    const id = req.query.id

    if (typeof id !== "string" || !id) {
      return res.status(400).json({ error: "Informe a equipe." })
    }

    return res.json(await new DeletaEquipeService().execute(id))
  }
}

// Marca a equipe como aprovada (ou tira a marca). A inscricao chega sempre
// sem aprovacao; quem decide e a organizacao, pelo painel.
class AprovaEquipeController {

  async handle(req: Request, res: Response): Promise<any> {

    const id = req.query.id
    const aprovada = req.body?.aprovada

    if (typeof id !== "string" || !id) return res.status(400).json({ error: "Informe a equipe." })
    if (typeof aprovada !== "boolean") return res.status(400).json({ error: "Informe se a equipe está aprovada." })

    const { count } = await prismaClient.equipe.updateMany({ where: { id }, data: { aprovada } })
    if (count === 0) return res.status(404).json({ error: "Equipe não encontrada." })

    return res.json({ id, aprovada })
  }
}

export { ObtemEquipesController, DeletaEquipeController, AprovaEquipeController }
