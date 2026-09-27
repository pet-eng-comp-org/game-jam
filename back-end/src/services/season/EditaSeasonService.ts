import prismaClient from "../../prisma";

export interface EdicaoSeason {
  numParticipantesPorEquipe?: string;
  dataEvento?: Date | null;
  linguagens?: string | null;
  regulamento?: string | null;
  inscricoesAbrem?: Date | null;
  inscricoesFecham?: Date | null;
}

class EditaSeasonService {
  async execute(id: string, dados: EdicaoSeason) {
    return prismaClient.season.update({ where: { id }, data: dados });
  }
}

export { EditaSeasonService };
