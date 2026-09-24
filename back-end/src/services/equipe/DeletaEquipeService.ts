import prismaClient from "../../prisma";

class DeletaEquipeService {

  // Apaga a equipe com os participantes, numa transacao: inscricao de teste,
  // duplicada ou desistente sai inteira do banco.
  async execute(id: string) {

    const [participantes] = await prismaClient.$transaction([
      prismaClient.participante.deleteMany({ where: { equipeId: id } }),
      prismaClient.equipe.deleteMany({ where: { id } }),
    ]);

    return { participantesApagados: participantes.count };
  }
}

export { DeletaEquipeService };
