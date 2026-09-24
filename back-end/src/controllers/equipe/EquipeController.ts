import { Request, Response } from "express";
import { ObtemEquipesService } from "../../services/equipe/ObtemEquipeService";
import { DeletaEquipeService } from "../../services/equipe/DeletaEquipeService";

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

export { ObtemEquipesController, DeletaEquipeController }
