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

const emailValido = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function montaInscricao(
  estado: EstadoFormulario,
  ufesPorParticipante: { [indice: number]: boolean | undefined },
  numParticipantes: number,
): ResultadoInscricao {
  const erros: ErrosFormulario = {};
  const equipe = texto(estado, "equipe");

  if (!equipe) erros.equipe = "Informe o nome da equipe.";

  const participantes: ParticipanteInscricao[] = [];
  const emails: string[] = [];

  for (let i = 1; i <= numParticipantes; i++) {
    const nome = texto(estado, "nome" + i);
    const email = texto(estado, "email" + i);
    const curso = texto(estado, "curso" + i);
    const instituicao = texto(estado, "instituicao" + i);
    // Sem escolha, "nao-informado": antes o padrao era "feminino", e quem nao
    // mexia no campo ficava registrado assim sem ter escolhido.
    const genero = (estado["genero" + i] as string) || "nao-informado";
    // Sem resposta, fica sem resposta: o formulário começava marcado "Sim", e
    // quem era de fora e não reparava ficava registrado como aluno da Ufes.
    const ufes = ufesPorParticipante[i];

    // Participante acrescentado e deixado em branco não entra. Preenchido pela
    // metade é engano de quem preencheu, e antes sumia sem aviso.
    // A instituição só conta se o campo estiver visível (quem não é da Ufes).
    const emBranco = !nome && !email && !curso && (ufes !== false || !instituicao);
    if (emBranco && i > 1) continue;

    if (!nome) erros["nome" + i] = "Informe o nome.";
    if (!email) erros["email" + i] = "Informe o e-mail.";
    else if (!emailValido(email)) erros["email" + i] = "E-mail inválido.";
    // Sem maiusculas e sem acentos, como a API e o banco comparam.
    else if (emails.some((e) => e.localeCompare(email, undefined, { sensitivity: "base" }) === 0)) erros["email" + i] = "E-mail repetido na equipe.";
    if (ufes === undefined) erros["ufes" + i] = "Informe se estuda na Ufes.";
    else if (!ufes && !instituicao) erros["instituicao" + i] = "Informe a instituição de ensino.";
    if (email) emails.push(email);

    participantes.push({
      nome,
      email,
      curso: curso || undefined,
      genero,
      ufes: ufes === true,
      instituicao: ufes === false ? instituicao : undefined,
    });
  }

  if (Object.keys(erros).length > 0) return { ok: false, erros };
  return { ok: true, equipe, participantes };
}
