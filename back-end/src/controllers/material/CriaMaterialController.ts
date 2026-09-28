import { Request, Response } from "express";
import { CriaMaterialService } from '../../services/material/CriaMaterialService';
import { dadosDoMaterial } from '../../utils/material';

class CriaMaterialController {

    async handle(req: Request, res: Response) : Promise<any>{

        // Mesma validacao da edicao: nome obrigatorio e link so http(s).
        const dados = dadosDoMaterial(req.body)
        if (typeof dados === "string") return res.status(400).json({ error: dados })

        const material = await new CriaMaterialService().execute(dados)

        return res.json(material)
    }
}

export { CriaMaterialController }

