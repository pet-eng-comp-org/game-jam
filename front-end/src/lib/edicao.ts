// O Game Jam 26 (1 a 3 de dezembro de 2026), num lugar so: as paginas, a
// agenda e a marcacao para o Google leem daqui.
//
// Fica no codigo, e nao no painel, porque o modelo da season do painel tem uma
// data e um local, e esta edicao tem tres dias, cada um com atividade, horario
// e sala proprios. A inscricao e por e-mail (o formulario saiu). Fonte: o
// documento "Correcoes do site gamejam.pet.inf.ufes.br" do Bernardo, lider do
// Game Jam (12/11/2026), que segue o Cronograma de Conteudo da Comissao Pulga.

import { dia, ehHoje, hora } from "./datas.ts";

export const NOME = "Game Jam 26";
export const LOCAL = "CT 9, Ufes Goiabeiras";
export const LINGUAGENS = ["Python", "C", "C++", "Java"];

// O primeiro recebe a inscricao; o do PET vai em copia.
export const EMAILS = ["petgamejamufes@gmail.com", "petengcomp@inf.ufes.br"] as const;

export interface Dia {
  numero: number;
  // Horario de Vitoria (UTC-3, sem horario de verao).
  inicio: string;
  fim: string;
  // O Mortal Kombat nao tem hora para acabar: o fim e uma estimativa, so para
  // a agenda, e o site escreve "a partir das 14h".
  fimEstimado: boolean;
  atividade: string;
  sala: string;
  detalhe?: string;
  // Dia em que se envia codigo pelo BOCA: o botao da barra leva a ele.
  boca?: boolean;
}

export const DIAS: Dia[] = [
  { numero: 1, inicio: "2026-12-01T14:00:00-03:00", fim: "2026-12-01T18:00:00-03:00", fimEstimado: true, atividade: "Campeonato de Mortal Kombat", sala: "Sala do PET", detalhe: "Chaveamento decidido na hora." },
  { numero: 2, inicio: "2026-12-02T14:00:00-03:00", fim: "2026-12-02T17:00:00-03:00", fimEstimado: false, atividade: "Workshop de programação de tanques", sala: "Lab 4", boca: true },
  { numero: 3, inicio: "2026-12-03T14:00:00-03:00", fim: "2026-12-03T17:00:00-03:00", fimEstimado: false, atividade: "Workshop de programação de tanques", sala: "Lab 2", boca: true },
];

export const INICIO = DIAS[0].inicio;

// O BOCA do workshop, onde cada pessoa envia o codigo do tanque, direto na
// tela de login (a raiz so redireciona para ca). A organizacao entrega o login.
export const BOCA = "https://boca.pet.inf.ufes.br/boca/";

// Nos dias de envio pelo BOCA, o botao da barra leva a ele em vez da
// inscricao: quem esta no laboratorio nao precisa digitar o endereco. No Dia 2
// a inscricao para o Dia 3 continua aberta, mas sai da barra de proposito: ali
// esta quem veio programar, e a inscricao segue no "Como participar" e nas
// Regras.
export const diaDeWorkshop = () => DIAS.some((d) => d.boca && ehHoje(d.inicio));
export const FIM = DIAS[DIAS.length - 1].fim;

// "Python, C, C++ ou Java"
export const linguagensPorExtenso = () => `${LINGUAGENS.slice(0, -1).join(", ")} ou ${LINGUAGENS[LINGUAGENS.length - 1]}`;

// O e-mail de inscricao ja aberto e preenchido: quem le so completa nome e dias.
export const EMAIL_DE_INSCRICAO =
  `mailto:${EMAILS[0]}?` +
  new URLSearchParams({ cc: EMAILS[1], subject: `Inscrição ${NOME}`, body: "Nome:\r\nDias:\r\n" }).toString().replace(/\+/g, "%20");

// "terça, 1 de dezembro": o "-feira" sobra quando a data vem com o horario.
export const quando = (d: Dia) => dia(d.inicio, true).replace("-feira", "");

// "das 14h às 17h", ou "a partir das 14h, sem hora fixa para acabar".
export const horario = (d: Dia) =>
  d.fimEstimado ? `a partir das ${hora(d.inicio)}, sem hora fixa para acabar` : `das ${hora(d.inicio)} às ${hora(d.fim)}`;

// "1 a 3 de dezembro, a partir das 14h" (o mes do primeiro dia; a edicao cabe
// num mes so).
export const periodo = () =>
  `${Number(dia(INICIO).split(" ")[0])} a ${dia(FIM)}, a partir das ${hora(INICIO)}`;

// "Sala do PET no Dia 1, Lab 4 no Dia 2 e Lab 2 no Dia 3"
export const salasPorDia = (dias: Dia[] = DIAS) => {
  const partes = dias.map((d) => `${d.sala} no Dia ${d.numero}`);
  return partes.length > 1 ? `${partes.slice(0, -1).join(", ")} e ${partes[partes.length - 1]}` : partes.join("");
};
