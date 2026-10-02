import { Request, Response, NextFunction } from "express";

// Fica antes do limite de tentativas em /sessao: um pedido sem usuario ou senha
// nao testa senha nenhuma, entao nao deve gastar a cota de quem esta tentando
// entrar. Sem isto, ele chegava ao findUnique como undefined e voltava 500.
export function exigeCredenciais(req: Request, res: Response, next: NextFunction): any {
    const { username, senha } = req.body

    if (typeof username !== "string" || typeof senha !== "string" || !username || !senha) {
        return res.status(400).json({ error: "Informe usuário e senha." })
    }

    return next()
}
