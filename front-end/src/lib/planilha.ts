// Planilha dos inscritos de uma season, para o certificado da PROEX. Fica fora
// da pagina para ser testada sem navegador (test/planilha.test.ts).

export interface ParticipanteInscrito {
  id: string;
  nome: string;
  email: string;
  cpf: string | null;
  curso: string | null;
  genero: string;
  ufes: boolean;
  instituicao: string | null;
}

export interface EquipeInscrita {
  id: string;
  nome: string;
  createdAt: string | null;
  participantes: ParticipanteInscrito[];
}

// Formatado de proposito: so com digitos, o Excel le o CPF como numero e come o
// zero a esquerda.
export function cpfFormatado(cpf: string | null) {
  if (!cpf) return "";
  return /^\d{11}$/.test(cpf) ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : cpf;
}

// Aspas em todo campo, com as internas dobradas: nome de equipe com ";" ou
// aspas nao quebra a coluna. Campo que comeca com =, +, - ou @ ganha um
// apostrofo, senao o Excel o executaria como formula.
function campo(valor: string) {
  const seguro = /^[=+\-@]/.test(valor) ? `'${valor}` : valor;
  return `"${seguro.replace(/"/g, '""')}"`;
}

// Separador ";" e BOM: e o que o Excel em portugues abre direto, com acentos.
export function planilhaDeInscritos(equipes: EquipeInscrita[]) {
  const linhas = [["Equipe", "Nome", "E-mail", "CPF", "Curso", "Instituição", "Gênero"]];

  for (const equipe of equipes) {
    for (const p of equipe.participantes) {
      linhas.push([
        equipe.nome,
        p.nome,
        p.email,
        cpfFormatado(p.cpf),
        p.curso ?? "",
        p.ufes ? "Ufes" : p.instituicao ?? "",
        p.genero,
      ]);
    }
  }

  return "﻿" + linhas.map((l) => l.map(campo).join(";")).join("\r\n") + "\r\n";
}
