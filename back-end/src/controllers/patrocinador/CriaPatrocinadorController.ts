import { Request, Response } from "express";
import { CriaPatrocinadorService } from "../../services/patrocinador/CriaPatrocinadorService";
import { dadosDoPatrocinador } from "../../utils/patrocinador";

class CriaPatrocinadorController {
    
    async handle(req: Request, res: Response): Promise<any> {

        if (!req.file) {
            return res.status(400).json({ error: "Arquivo de logo é obrigatório" });
        }

        const dados = dadosDoPatrocinador(req.body);
        if (typeof dados === "string") return res.status(400).json({ error: dados });

        const logoPath = `/files/${req.file.filename}`;

        const criaPatrocinadorService = new CriaPatrocinadorService();

        const patrocinador = await criaPatrocinadorService.execute({
            ...dados,
            logo: logoPath
        });

        return res.status(201).json(patrocinador);
    }
}

export { CriaPatrocinadorController };
