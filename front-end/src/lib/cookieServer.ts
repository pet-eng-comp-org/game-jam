import { cookies } from "next/headers";
import { COOKIE_SESSAO } from "./sessao";

export async function getCookieServer() {

    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_SESSAO)?.value

    return token || null
}