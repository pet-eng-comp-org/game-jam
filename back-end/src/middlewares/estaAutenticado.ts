import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import prismaClient from "../prisma";

interface PayLoad{
    sub: string
}

export async function estaAutenticado(req: Request, res: Response, next: NextFunction): Promise<any>{

    // Receber o token
    const authToken = req.headers.authorization

    if(!authToken) return res.status(401).end()

    const [, token] = authToken.split(" ")

    try{
        //Validar esse token
        const { sub } = verify(
            token,
            process.env.JWT_SECRET
        ) as PayLoad

        // O token vale 1 dia e nao ha revogacao: sem esta consulta, um organizador
        // apagado no painel continuava entrando (e vendo os dados dos inscritos) ate o token vencer.
        const existe = await prismaClient.user.count({ where: { id: sub } })
        if(!existe) return res.status(401).end()

        // Recuperar o id do token e colocar dentro de uma variavel user_id dentro do req
        req.user_id = sub

        return next()
    }
    catch(err){
        return res.status(401).end()
    }
}