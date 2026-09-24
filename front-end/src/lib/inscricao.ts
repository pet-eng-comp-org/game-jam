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

// So os digitos, se for um CPF valido; senao, null. A API confere de novo
// (back-end/src/utils/cpf.ts): o CPF vai para o certificado emitido pela PROEX.
export function cpfNormalizado(valor: string): string | null {
  const cpf = valor.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return null;

  for (const tamanho of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(cpf[i]) * (tamanho + 1 - i);
    if (((soma * 10) % 11) % 10 !== Number(cpf[tamanho])) return null;
  }
  return cpf;
}

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
    // Sem valor, conta como da Ufes, o mesmo padrão que o formulário mostra.
    const ufes = ufesPorParticipante[i] ?? true;

    // Participante opcional totalmente em branco não entra. Preenchido pela
    // metade é engano de quem preencheu, e antes sumia sem aviso.
    // A instituição só conta se o campo estiver visível (quem não é da Ufes).
    const emBranco = !nome && !email && !cpf && !curso && (ufes || !instituicao);
    if (emBranco && i > 1) continue;

    if (!nome || !email || !cpf) {
      return { ok: false, erro: `Participante ${i}: Nome, CPF e Email são obrigatórios!` };
    }

    const cpfValido = cpfNormalizado(cpf);
    if (!cpfValido) {
      return { ok: false, erro: `Participante ${i}: CPF inválido. Confira os números.` };
    }

    if (!ufes && !instituicao) {
      return { ok: false, erro: `Participante ${i}: informe a instituição de ensino.` };
    }

    participantes.push({
      nome,
      email,
      cpf: cpfValido,
      curso: curso || undefined,
      genero,
      ufes,
      instituicao: ufes ? undefined : instituicao,
    });
  }

  return { ok: true, equipe, participantes };
}
