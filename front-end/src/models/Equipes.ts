import { painel } from "@/services/painel"
import { toast } from "sonner"
import type { EquipeInscrita } from "@/lib/planilha"

// Os inscritos de uma season, para o painel (rota com login).
export async function obtemEquipes(seasonId: string): Promise<EquipeInscrita[]> {

    try {
        const response = await painel.get("/equipes", {
            params: { seasonId }
        })

        return response.data
    }
    catch (err) {
        console.log(err)
        toast.error("Não foi possível carregar as equipes.")
        return []
    }
}

export async function aprovaEquipe(id: string, aprovada: boolean) {

    try {
        await painel.put("/equipe/aprovada", { aprovada }, { params: { id } })
        return true
    }
    catch (err) {
        console.log(err)
        toast.error("Não foi possível mudar a aprovação.")
        return false
    }
}

export async function deletaEquipe(id: string) {

    try {
        await painel.delete("/equipe", {
            params: { id }
        })

        toast.success("Equipe apagada.")
    }
    catch (err) {
        console.log(err)
        toast.error("Não foi possível apagar a equipe.")
    }
}
