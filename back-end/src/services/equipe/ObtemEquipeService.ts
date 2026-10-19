import prismaClient from "../../prisma";

class ObtemEquipesService {

  // As inscricoes de uma season, para o painel. E a unica leitura de dado de
  // participante (nome e e-mail) da API, e fica atras do login.
  async execute(seasonId: string) {

    return prismaClient.equipe.findMany({
      where: { seasonId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        nome: true,
        aprovada: true,
        createdAt: true,
        participantes: {
          orderBy: { createdAt: "asc" },
          select: { id: true, nome: true, email: true, curso: true, genero: true, ufes: true, instituicao: true },
        },
      },
    });
  }
}

export { ObtemEquipesService };
