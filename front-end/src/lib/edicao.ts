// O Game Jam 26 (1 a 3 de dezembro de 2026), num lugar so: as paginas, a
// agenda e a marcacao para o Google leem daqui.
//
// Fica no codigo, e nao no painel, porque o modelo da season do painel tem uma
// data e um local, e esta edicao tem tres dias, cada um com atividade, horario
// e sala proprios. A inscricao e por e-mail (o formulario saiu). Fonte: o
// documento "Correcoes do site gamejam.pet.inf.ufes.br" do Bernardo, lider do
// Game Jam (12/11/2026), que segue o Cronograma de Conteudo da Comissao Pulga.

import { dia } from "./datas.ts";

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
}

export const DIAS: Dia[] = [
  { numero: 1, inicio: "2026-12-01T14:00:00-03:00", fim: "2026-12-01T18:00:00-03:00", fimEstimado: true, atividade: "Campeonato de Mortal Kombat", sala: "Sala do PET", detalhe: "Chaveamento decidido na hora." },
  { numero: 2, inicio: "2026-12-02T14:00:00-03:00", fim: "2026-12-02T17:00:00-03:00", fimEstimado: false, atividade: "Workshop de programação de tanques", sala: "Lab 4" },
  { numero: 3, inicio: "2026-12-03T14:00:00-03:00", fim: "2026-12-03T17:00:00-03:00", fimEstimado: false, atividade: "Workshop de programação de tanques", sala: "Lab 2" },
];

export const INICIO = DIAS[0].inicio;
export const FIM = DIAS[DIAS.length - 1].fim;

// "Python, C, C++ ou Java"
export const linguagensPorExtenso = () => `${LINGUAGENS.slice(0, -1).join(", ")} ou ${LINGUAGENS[LINGUAGENS.length - 1]}`;

// O e-mail de inscricao ja aberto e preenchido: quem le so completa nome e dias.
export const EMAIL_DE_INSCRICAO =
  `mailto:${EMAILS[0]}?` +
  new URLSearchParams({ cc: EMAILS[1], subject: `Inscrição ${NOME}`, body: "Nome:\nDias:\n" }).toString().replace(/\+/g, "%20");

// "terça, 1 de dezembro": o "-feira" sobra quando a data vem com o horario.
export const quando = (d: Dia) => dia(d.inicio, true).replace("-feira", "");

// "14h"
const hora = (iso: string) =>
  `${Number(new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", timeZone: "America/Sao_Paulo" }).slice(0, 2))}h`;

// "das 14h às 17h", ou "a partir das 14h, sem hora fixa para acabar".
export const horario = (d: Dia) =>
  d.fimEstimado ? `a partir das ${hora(d.inicio)}, sem hora fixa para acabar` : `das ${hora(d.inicio)} às ${hora(d.fim)}`;
