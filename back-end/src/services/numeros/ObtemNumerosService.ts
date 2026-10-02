import prismaClient from "../../prisma";

// Numeros do evento para a pagina de patrocinio: so contagens, nenhum dado de
// participante. "Ultima" e a edicao mais recente que ja terminou e teve
// inscricoes pelo site (as Seasons 1 e 2 sao de antes dele e nao tem equipes
// no banco).
class ObtemNumerosService {

    async execute() {

        const [edicoes, jogos, passadas] = await Promise.all([
            prismaClient.season.count(),
            prismaClient.jogo.count(),
            prismaClient.season.findMany({
                where: { atual: false, equipes: { some: {} } },
                select: { id: true, numero: true, ano: true },
            }),
        ]);

        const recente = passadas.sort((a, b) => Number(b.numero) - Number(a.numero))[0];
        if (!recente) return { edicoes, jogos, ultima: null };

        const daSeason = { equipe: { seasonId: recente.id } };
        const [quantasEquipes, quantasPessoas, deFora] = await Promise.all([
            prismaClient.equipe.count({ where: { seasonId: recente.id } }),
            prismaClient.participante.count({ where: daSeason }),
            prismaClient.participante.count({ where: { ...daSeason, ufes: false } }),
        ]);

        return {
            edicoes,
            jogos,
            ultima: { numero: recente.numero, ano: recente.ano, quantasEquipes, quantasPessoas, deFora },
        };
    }
}

export { ObtemNumerosService };
