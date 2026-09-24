import { NextResponse, NextRequest } from "next/server";
import { getCookieServer } from "./lib/cookieServer";
import { api } from "./services/api";

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

        console.log(err)
        return false
    }
}