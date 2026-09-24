// Monta a inscrição a partir do estado do formulário. Fica fora do componente
// para poder ser testada sem navegador (test/inscricao.test.ts).
//
// Tudo que o back-end recusaria é barrado aqui, antes de criar a equipe: a
// equipe e os participantes são gravados em chamadas separadas, então um
// participante recusado depois deixaria a equipe criada pela metade.

export type EstadoFormulario = { [campo: string]: string | boolean };

export interface ParticipanteInscricao {
  nome: string;
  email: string;
  cpf: string;
  curso?: string;
  genero: string;
  ufes: boolean;
  instituicao?: string;
}

export type ResultadoInscricao =
  | { ok: true; equipe: string; participantes: ParticipanteInscricao[] }
  | { ok: false; erro: string };

const texto = (estado: EstadoFormulario, campo: string) =>
  ((estado[campo] as string) ?? "").trim();

export function montaInscricao(
  estado: EstadoFormulario,
  ufesPorParticipante: { [indice: number]: boolean },
  numParticipantes: number,
): ResultadoInscricao {
  const equipe = texto(estado, "equipe");

  if (!equipe) return { ok: false, erro: "Preencha o nome da equipe!" };

  // A declaração é uma só para a equipe inteira, no campo "termo".
  if (estado["termo"] !== true) {
    return { ok: false, erro: "Você deve aceitar o termo para realizar a inscrição!" };
  }

  const participantes: ParticipanteInscricao[] = [];

  for (let i = 1; i <= numParticipantes; i++) {
    const nome = texto(estado, "nome" + i);
    const email = texto(estado, "email" + i);
    const cpf = texto(estado, "cpf" + i);
    const curso = texto(estado, "curso" + i);
    const instituicao = texto(estado, "instituicao" + i);
    const genero = (estado["genero" + i] as string) || "feminino";
    const ufes = ufesPorParticipante[i] ?? true;

    // Participante opcional totalmente em branco não entra. Preenchido pela
    // metade é engano de quem preencheu, e antes sumia sem aviso.
    // A instituição só conta se o campo estiver visível (quem não é da Ufes).
    const emBranco = !nome && !email && !cpf && !curso && (ufes || !instituicao);
    if (emBranco && i > 1) continue;

    if (!nome || !email || !cpf) {
      return { ok: false, erro: `Participante ${i}: Nome, CPF e Email são obrigatórios!` };
    }

    if (!ufes && !instituicao) {
      return { ok: false, erro: `Participante ${i}: informe a instituição de ensino.` };
    }

    participantes.push({
      nome,
      email,
      cpf,
      curso: curso || undefined,
      genero,
      ufes,
      instituicao: ufes ? undefined : instituicao,
    });
  }

  return { ok: true, equipe, participantes };
}
