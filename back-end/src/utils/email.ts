import nodemailer, { Transporter } from "nodemailer";

// E-mail de confirmacao da inscricao, pelo SMTP das variaveis abaixo. Sem
// SMTP_HOST o envio fica desligado: a inscricao funciona igual, so nao avisa.
//
//   SMTP_HOST, SMTP_PORTA (465 = TLS direto; 587 = STARTTLS obrigatorio),
//   SMTP_USUARIO, SMTP_SENHA, EMAIL_REMETENTE (padrao: SMTP_USUARIO)
//
// SMTP_SEM_TLS=1 so existe para o servidor de teste (test/api.test.js).

let transporte: Transporter | null | undefined;

function transportador() {
  if (transporte !== undefined) return transporte;
  const host = process.env.SMTP_HOST;
  if (!host) return (transporte = null);
  const porta = Number(process.env.SMTP_PORTA || 465);
  const semTls = process.env.SMTP_SEM_TLS === "1";
  transporte = nodemailer.createTransport({
    host,
    port: porta,
    secure: !semTls && porta === 465,
    requireTLS: !semTls && porta !== 465,
    ignoreTLS: semTls,
    auth: process.env.SMTP_USUARIO ? { user: process.env.SMTP_USUARIO, pass: process.env.SMTP_SENHA } : undefined,
  });
  return transporte;
}

// Texto que veio do formulario vai numa linha so e com tamanho limitado: nada
// de quebra de linha no assunto nem paragrafo inteiro no lugar de um nome.
const linha = (texto: string, max = 80) => texto.replace(/\s+/g, " ").trim().slice(0, max);

interface Confirmacao {
  equipe: string;
  season: { numero: string; dataEvento: Date | null; local?: string | null };
  participantes: { nome: string; email: string }[];
}

const SITE = "https://gamejam.pet.inf.ufes.br";
const fuso = "America/Sao_Paulo";

// "sábado, 28 de novembro, às 12h" (ou "às 9h30"), como o site escreve.
function diaEHora(d: Date) {
  const dia = d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: fuso });
  const [h, m] = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: fuso }).split(":");
  return `${dia}, às ${Number(h)}h${m === "00" ? "" : m}`;
}

// "Ana, Bia e Caio".
const emFrase = (nomes: string[]) =>
  nomes.length < 2 ? nomes.join("") : `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;

// O mesmo que a tela de inscricao recebida diz: quando, onde e o que levar.
export function textoDaConfirmacao({ equipe, season, participantes }: Confirmacao) {
  const nomes = participantes.map((p) => linha(p.nome));
  const local = season.local ? linha(season.local, 120) : null;
  return {
    assunto: `Inscrição recebida: ${linha(equipe)} (Game Jam Season ${season.numero})`,
    texto: [
      `Olá, ${emFrase(nomes)}!`,
      "",
      `Recebemos a inscrição da equipe "${linha(equipe)}" na Season ${season.numero} do Game Jam.`,
      "",
      "Participantes:",
      ...nomes.map((n) => `- ${n}`),
      "",
      ...(season.dataEvento ? [`Quando: ${diaEHora(season.dataEvento)}.`] : []),
      ...(local ? [`Onde: ${local}.`] : []),
      "A competição é presencial, num laboratório com computadores: não precisa levar notebook.",
      "",
      `Regras e materiais para se preparar: ${SITE}/regras`,
      "Os próximos avisos saem no Instagram @petengcomp.",
      "",
      "Se você não fez esta inscrição, responda este e-mail.",
      "",
      "Organização do Game Jam",
      "PET Engenharia de Computação - Ufes",
    ].join("\n"),
  };
}

// Um e-mail so, para todos da equipe. Nao lanca: falha de envio fica no log e
// a inscricao, que ja foi gravada, segue valendo.
export async function enviaConfirmacao(dados: Confirmacao) {
  const t = transportador();
  if (!t) return;
  const { assunto, texto } = textoDaConfirmacao(dados);
  try {
    await t.sendMail({
      from: `Game Jam <${process.env.EMAIL_REMETENTE || process.env.SMTP_USUARIO}>`,
      to: [...new Set(dados.participantes.map((p) => p.email))],
      subject: assunto,
      text: texto,
    });
  } catch (err) {
    // Sem o endereco nem o conteudo no log: sao dados de participante.
    console.error("e-mail de confirmacao nao enviado:", (err as Error).message);
  }
}
