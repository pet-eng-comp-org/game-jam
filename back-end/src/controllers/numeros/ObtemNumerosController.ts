import { Request, Response } from "express";
import { ObtemNumerosService } from "../../services/numeros/ObtemNumerosService";

class ObtemNumerosController {

    async handle(req: Request, res: Response): Promise<any> {

        const numeros = await new ObtemNumerosService().execute();

        return res.json(numeros);
    }
}

export { ObtemNumerosController };
