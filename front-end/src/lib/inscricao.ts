// Monta a inscrição a partir do estado do formulário. Fica fora do componente
// para poder ser testada sem navegador (test/inscricao.test.ts).
//
// Confere tudo de uma vez e devolve um erro por campo, para o formulário mostrar
// cada um ao lado do campo, em vez de um aviso por vez.

export type EstadoFormulario = { [campo: string]: string | boolean };
export type ErrosFormulario = { [campo: string]: string };

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
  | { ok: false; erros: ErrosFormulario };

const texto = (estado: EstadoFormulario, campo: string) =>
  ((estado[campo] as string) ?? "").trim();

// Mesma conta do back-end (back-end/src/utils/cpf.ts): 11 dígitos e os dois
// verificadores certos.
export function cpfValido(valor: string) {
  const cpf = valor.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (const tamanho of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(cpf[i]) * (tamanho + 1 - i);
    if (((soma * 10) % 11) % 10 !== Number(cpf[tamanho])) return false;
  }
  return true;
}

// Máscara do campo: 000.000.000-00, montada enquanto a pessoa digita ou cola.
export function formataCpf(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

const emailValido = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function montaInscricao(
  estado: EstadoFormulario,
  ufesPorParticipante: { [indice: number]: boolean },
  numParticipantes: number,
): ResultadoInscricao {
  const erros: ErrosFormulario = {};
  const equipe = texto(estado, "equipe");

  if (!equipe) erros.equipe = "Informe o nome da equipe.";

  const participantes: ParticipanteInscricao[] = [];
  const cpfs = new Set<string>();

  for (let i = 1; i <= numParticipantes; i++) {
    const nome = texto(estado, "nome" + i);
    const email = texto(estado, "email" + i);
    const cpf = texto(estado, "cpf" + i).replace(/\D/g, "");
    const curso = texto(estado, "curso" + i);
    const instituicao = texto(estado, "instituicao" + i);
    const genero = (estado["genero" + i] as string) || "feminino";
    // Sem valor, conta como da Ufes, o mesmo padrão que o formulário mostra.
    const ufes = ufesPorParticipante[i] ?? true;

    // Participante acrescentado e deixado em branco não entra. Preenchido pela
    // metade é engano de quem preencheu, e antes sumia sem aviso.
    // A instituição só conta se o campo estiver visível (quem não é da Ufes).
    const emBranco = !nome && !email && !cpf && !curso && (ufes || !instituicao);
    if (emBranco && i > 1) continue;

    if (!nome) erros["nome" + i] = "Informe o nome.";
    if (!email) erros["email" + i] = "Informe o e-mail.";
    else if (!emailValido(email)) erros["email" + i] = "E-mail inválido.";
    if (!cpf) erros["cpf" + i] = "Informe o CPF.";
    else if (!cpfValido(cpf)) erros["cpf" + i] = "CPF inválido. Confira os números.";
    else if (cpfs.has(cpf)) erros["cpf" + i] = "CPF repetido na equipe.";
    if (!ufes && !instituicao) erros["instituicao" + i] = "Informe a instituição de ensino.";
    cpfs.add(cpf);

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

  // A declaração é uma só para a equipe inteira, no campo "termo".
  if (estado["termo"] !== true) erros.termo = "Marque a declaração para se inscrever.";

  if (Object.keys(erros).length > 0) return { ok: false, erros };
  return { ok: true, equipe, participantes };
}
