import prismaClient from "../../prisma";
import { mesmoEmail } from "../../utils/participante";

export interface ParticipanteInscricao {
  nome: string;
  email: string;
  genero: string;
  ufes: boolean;
  curso?: string;
  instituicao?: string;
}

class CriaInscricaoService {
  // Uma transacao so: ou a equipe entra com todos os participantes, ou nada
  // entra. Antes eram uma requisicao por equipe e uma por participante, e
  // qualquer falha no meio deixava equipe pela metade no banco.
  //
  // A mesma pessoa (o mesmo e-mail) nao se inscreve duas vezes na season. O
  // SELECT ... FOR UPDATE trava a linha da season ate o fim da transacao: duas
  // inscricoes ao mesmo tempo com o mesmo e-mail nao passam as duas pela
  // conferencia. A collation da coluna ignora maiusculas, como a comparacao
  // abaixo. Devolve o indice do participante repetido.
  async execute(nome: string, seasonId: string, participantes: ParticipanteInscricao[]) {
    return prismaClient.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM seasons WHERE id = ${seasonId} FOR UPDATE`;

      const ja = await tx.participante.findFirst({
        where: { email: { in: participantes.map((p) => p.email) }, equipe: { seasonId } },
        select: { email: true },
      });
      // -1 se o banco achou um repetido que mesmoEmail nao reconhece.
      if (ja) return { emailRepetido: participantes.findIndex((p) => mesmoEmail(p.email, ja.email)) };

      const equipe = await tx.equipe.create({
        data: { nome, seasonId, participantes: { create: participantes } },
        select: { id: true, nome: true },
      });
      return { ...equipe, participantes: participantes.length };
    });
  }
}

export { CriaInscricaoService };
