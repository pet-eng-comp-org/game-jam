// Planilha dos inscritos de uma season, para a organizacao. Fica fora
// da pagina para ser testada sem navegador (test/planilha.test.ts).

export interface ParticipanteInscrito {
  id: string;
  nome: string;
  email: string;
  curso: string | null;
  genero: string;
  ufes: boolean;
  instituicao: string | null;
}

export interface EquipeInscrita {
  id: string;
  nome: string;
  aprovada: boolean;
  createdAt: string | null;
  participantes: ParticipanteInscrito[];
}

const GENEROS: { [valor: string]: string } = {
  feminino: "Feminino",
  masculino: "Masculino",
  outros: "Outro",
  "nao-informado": "Não informado",
};

// Valor gravado -> texto da planilha. Valor desconhecido (inscricoes antigas)
// sai como esta.
export const generoLegivel = (genero: string) => GENEROS[genero] ?? genero;

// Aspas em todo campo, com as internas dobradas: nome de equipe com ";" ou
// aspas nao quebra a coluna. Campo que comeca com =, +, -, @, tabulacao ou
// quebra de linha ganha um apostrofo, senao o Excel o executaria como formula
// (as inscricoes antigas nao tinham os espacos das pontas aparados).
function campo(valor: string) {
  const seguro = /^[=+\-@\t\r]/.test(valor) ? `'${valor}` : valor;
  return `"${seguro.replace(/"/g, '""')}"`;
}

// Separador ";" e BOM: e o que o Excel em portugues abre direto, com acentos.
export function planilhaDeInscritos(equipes: EquipeInscrita[]) {
  const linhas = [["Equipe", "Aprovada", "Nome", "E-mail", "Curso", "Instituição", "Gênero"]];

  for (const equipe of equipes) {
    for (const p of equipe.participantes) {
      linhas.push([
        equipe.nome,
        equipe.aprovada ? "Sim" : "Não",
        p.nome,
        p.email,
        p.curso ?? "",
        p.ufes ? "Ufes" : p.instituicao ?? "",
        generoLegivel(p.genero),
      ]);
    }
  }

  return "﻿" + linhas.map((l) => l.map(campo).join(";")).join("\r\n") + "\r\n";
}
