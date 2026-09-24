import prismaClient from "../../prisma";

class ObtemEquipesService {

  // As inscricoes de uma season, para o painel. E a unica leitura de dado de
  // participante (com CPF) da API, e fica atras do login.
  async execute(seasonId: string) {

    return prismaClient.equipe.findMany({
      where: { seasonId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        nome: true,
        createdAt: true,
        participantes: {
          orderBy: { createdAt: "asc" },
          select: { id: true, nome: true, email: true, cpf: true, curso: true, genero: true, ufes: true, instituicao: true },
        },
      },
    });
  }
}

export { ObtemEquipesService };
