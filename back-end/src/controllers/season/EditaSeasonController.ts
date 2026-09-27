import { Request, Response } from "express";
import prismaClient from "../../prisma";
import { EditaSeasonService, EdicaoSeason } from "../../services/season/EditaSeasonService";
import { comSituacao } from "../../utils/season";

// Data em ISO 8601 ("2026-11-15T09:00:00-03:00"), null para apagar, ausente para manter.
function data(valor: unknown): Date | null | undefined | "invalida" {
  if (valor === undefined) return undefined;
  if (valor === null || valor === "") return null;
  if (typeof valor !== "string") return "invalida";
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? "invalida" : d;
}

function texto(valor: unknown, max: number): string | null | undefined | "invalido" {
  if (valor === undefined) return undefined;
  if (valor === null) return null;
  if (typeof valor !== "string" || valor.length > max) return "invalido";
  return valor.trim() || null;
}

// Edicao da season pelo painel: numero de participantes, dados da edicao,
// regulamento e o periodo de inscricao. Campo ausente fica como esta.
class EditaSeasonController {
  async handle(req: Request, res: Response): Promise<any> {
    const id = req.query.id;
    if (typeof id !== "string" || !id) return res.status(400).json({ error: "Informe a season." });

    const atual = await prismaClient.season.findUnique({ where: { id } });
    if (!atual) return res.status(404).json({ error: "Season não encontrada." });

    const corpo = req.body ?? {};
    const dados: EdicaoSeason = {};

    if (corpo.numParticipantesPorEquipe !== undefined) {
      const n = Number(corpo.numParticipantesPorEquipe);
      if (!Number.isInteger(n) || n < 1 || n > 10) return res.status(400).json({ error: "Número de participantes inválido." });
      dados.numParticipantesPorEquipe = String(n);
    }

    for (const campo of ["dataEvento", "inscricoesAbrem", "inscricoesFecham"] as const) {
      const d = data(corpo[campo]);
      if (d === "invalida") return res.status(400).json({ error: `Data inválida em ${campo}.` });
      if (d !== undefined) dados[campo] = d;
    }

    const linguagens = texto(corpo.linguagens, 191);
    if (linguagens === "invalido") return res.status(400).json({ error: "Linguagens: no máximo 191 caracteres." });
    if (linguagens !== undefined) dados.linguagens = linguagens;

    const regulamento = texto(corpo.regulamento, 60000);
    if (regulamento === "invalido") return res.status(400).json({ error: "Regulamento grande demais." });
    if (regulamento !== undefined) dados.regulamento = regulamento;

    const abrem = dados.inscricoesAbrem !== undefined ? dados.inscricoesAbrem : atual.inscricoesAbrem;
    const fecham = dados.inscricoesFecham !== undefined ? dados.inscricoesFecham : atual.inscricoesFecham;
    if (abrem && fecham && abrem >= fecham) {
      return res.status(400).json({ error: "As inscrições precisam fechar depois de abrir." });
    }

    const season = await new EditaSeasonService().execute(id, dados);
    return res.json(comSituacao(season));
  }
}

export { EditaSeasonController };
