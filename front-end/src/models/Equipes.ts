import { getCookieClient } from "@/lib/cookieClient"
import { api } from "@/services/api"
import { toast } from "sonner"
import type { EquipeInscrita } from "@/lib/planilha"

// Os inscritos de uma season, para o painel (rota com login).
export async function obtemEquipes(seasonId: string): Promise<EquipeInscrita[]> {

    const token = getCookieClient()

    if (!token) return []

    try {
        const response = await api.get("/equipes", {
            params: { seasonId },
            headers: { Authorization: `Bearer ${token}` }
        })

        return response.data
    }
    catch (err) {
        console.log(err)
        toast.error("Não foi possível carregar as equipes.")
        return []
    }
}

export async function deletaEquipe(id: string) {

    const token = getCookieClient()

    if (!token) return

    try {
        await api.delete("/equipe", {
            params: { id },
            headers: { Authorization: `Bearer ${token}` }
        })

        toast.success("Equipe apagada.")
    }
    catch (err) {
        console.log(err)
        toast.error("Não foi possível apagar a equipe.")
    }
}
