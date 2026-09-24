import prismaClient from "../../prisma";

export interface ParticipanteInscricao {
  nome: string;
  email: string;
  genero: string;
  ufes: boolean;
  cpf: string;
  curso?: string;
  instituicao?: string;
}

class CriaInscricaoService {
  // Um create aninhado e uma transacao so: ou a equipe entra com todos os
  // participantes, ou nada entra. Antes eram uma requisicao por equipe e uma por
  // participante, e qualquer falha no meio deixava equipe pela metade no banco.
  async execute(nome: string, seasonId: string, participantes: ParticipanteInscricao[]) {
    const equipe = await prismaClient.equipe.create({
      data: { nome, seasonId, participantes: { create: participantes } },
      select: { id: true, nome: true },
    });

    return { ...equipe, participantes: participantes.length };
  }
}

export { CriaInscricaoService };
