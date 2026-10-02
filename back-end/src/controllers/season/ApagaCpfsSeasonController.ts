import { Request, Response } from "express";
import { ApagaCpfsSeasonService } from "../../services/season/ApagaCpfsSeasonService";

class ApagaCpfsSeasonController {

    async handle(req: Request, res: Response): Promise<any> {

        const id = req.query.id

        if (typeof id !== "string" || !id) {
            return res.status(400).json({ error: "Informe a season." })
        }

        return res.json(await new ApagaCpfsSeasonService().execute(id))
    }
}

export { ApagaCpfsSeasonController }
