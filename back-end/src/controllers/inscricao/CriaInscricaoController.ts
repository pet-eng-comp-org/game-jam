import { Request, Response } from "express";
import prismaClient from "../../prisma";
import { CriaInscricaoService, ParticipanteInscricao } from "../../services/inscricao/CriaInscricaoService";
import { cpfNormalizado } from "../../utils/cpf";

const texto = (valor: unknown) => (typeof valor === "string" ? valor.trim() : "");

// Monta o participante campo a campo: nada do corpo da requisicao vai direto
// para o banco (um "id" ou "equipeId" enviado pelo cliente e ignorado).
function participanteDe(bruto: any): ParticipanteInscricao | string {
  const nome = texto(bruto?.nome);
  const email = texto(bruto?.email);
  const genero = texto(bruto?.genero);
  const ufes = bruto?.ufes;
  const instituicao = texto(bruto?.instituicao);

  if (!nome || !email || !genero || typeof ufes !== "boolean") return "Campos obrigatórios faltando.";

  // Obrigatorio: sem CPF nao ha certificado (emitido pela PROEX).
  const cpf = cpfNormalizado(bruto?.cpf);
  if (!cpf) return "CPF inválido.";
  if (!ufes && !instituicao) return "Informe a instituição para participantes externos.";

  return {
    nome,
    email,
    genero,
    ufes,
    cpf,
    curso: texto(bruto?.curso) || undefined,
    instituicao: ufes ? undefined : instituicao,
  };
}

class CriaInscricaoController {
  async handle(req: Request, res: Response): Promise<any> {
    const nome = texto(req.body?.equipe);
    const brutos = req.body?.participantes;

    if (!nome) return res.status(400).json({ error: "O nome da equipe é obrigatório." });
    if (!Array.isArray(brutos) || brutos.length === 0) {
      return res.status(400).json({ error: "Informe ao menos um participante." });
    }

    // Esta rota e publica, porque ninguem tem login antes de se inscrever. A
    // guarda contra escrita fora do periodo e a flag da propria temporada.
    const season = await prismaClient.season.findFirst({ where: { atual: true } });
    if (!season) return res.status(400).json({ error: "Nenhuma temporada atual encontrada." });
    if (!season.inscricoesAbertas) return res.status(403).json({ error: "As inscrições não estão abertas." });

    const limite = Number(season.numParticipantesPorEquipe);
    if (Number.isFinite(limite) && limite > 0 && brutos.length > limite) {
      return res.status(409).json({ error: `A equipe pode ter no máximo ${limite} participantes.` });
    }

    const participantes: ParticipanteInscricao[] = [];
    for (const [i, bruto] of brutos.entries()) {
      const p = participanteDe(bruto);
      if (typeof p === "string") return res.status(400).json({ error: `Participante ${i + 1}: ${p}` });
      participantes.push(p);
    }

    const inscricao = await new CriaInscricaoService().execute(nome, season.id, participantes);
    return res.status(201).json(inscricao);
  }
}

export { CriaInscricaoController };
