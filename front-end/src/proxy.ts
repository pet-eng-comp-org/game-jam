import { NextResponse, NextRequest } from "next/server";
import { getCookieServer } from "./lib/cookieServer";
import { api } from "./services/api";
import { isAxiosError } from "axios";

export async function proxy(req: NextRequest) {

    const { pathname } = req.nextUrl

    if(pathname.startsWith("/_next") || pathname === "/") {
        return NextResponse.next()
    }

    const token = await getCookieServer()

    if(pathname.startsWith("/admin")) {

        if(!token) {
            return NextResponse.redirect(new URL("/login", req.url))
        }

        const isValid = await validateToken(token)

        if(!isValid) {
            return NextResponse.redirect(new URL("/login", req.url))
        }
    }

    return NextResponse.next()
}

async function validateToken(token: string) {
    
    if(!token) return false

    try {

        await api.get('/eu', {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        return true
    }
    catch(err) {

        // So o status: o erro do axios carrega o cabecalho Authorization, com o
        // token da sessao, e ia inteiro para o log do servidor.
        console.log("sessao recusada:", isAxiosError(err) ? err.response?.status ?? err.code : err)
        return false
    }
}