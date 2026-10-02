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
  // Uma transacao so: ou a equipe entra com todos os participantes, ou nada
  // entra. Antes eram uma requisicao por equipe e uma por participante, e
  // qualquer falha no meio deixava equipe pela metade no banco.
  //
  // A mesma pessoa nao se inscreve duas vezes na season (o certificado sairia
  // em dobro). O SELECT ... FOR UPDATE trava a linha da season ate o fim da
  // transacao: duas inscricoes ao mesmo tempo com o mesmo CPF nao passam as
  // duas pela conferencia. Devolve o indice do participante repetido.
  async execute(nome: string, seasonId: string, participantes: ParticipanteInscricao[]) {
    return prismaClient.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${seasonId} FOR UPDATE`;

      const ja = await tx.participante.findFirst({
        where: { cpf: { in: participantes.map((p) => p.cpf) }, equipe: { seasonId } },
        select: { cpf: true },
      });
      if (ja) return { cpfRepetido: participantes.findIndex((p) => p.cpf === ja.cpf) };

      const equipe = await tx.equipe.create({
        data: { nome, seasonId, participantes: { create: participantes } },
        select: { id: true, nome: true },
      });
      return { ...equipe, participantes: participantes.length };
    });
  }
}

export { CriaInscricaoService };
