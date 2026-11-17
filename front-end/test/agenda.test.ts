// "Salvar na agenda" (src/lib/agenda.ts): os tres dias do Game Jam 26.
import { test } from "node:test";
import assert from "node:assert/strict";
import { icsDaEdicao, linkGoogleAgenda } from "../src/lib/agenda.ts";
import { DIAS } from "../src/lib/edicao.ts";

test("o arquivo .ics tem os tres dias, com inicio e fim em UTC, o local escapado e linhas curtas", () => {
  const ics = icsDaEdicao(new Date("2026-11-17T12:00:00Z"));
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.equal(ics.match(/BEGIN:VEVENT/g)?.length, 3);
  // 14h em Vitoria e 17h em UTC.
  assert.match(ics, /\r\nDTSTART:20261201T170000Z\r\nDTEND:20261201T210000Z\r\n/);
  assert.match(ics, /\r\nDTSTART:20261202T170000Z\r\nDTEND:20261202T200000Z\r\n/);
  assert.match(ics, /\r\nDTSTART:20261203T170000Z\r\nDTEND:20261203T200000Z\r\n/);
  const desdobrado = ics.replace(/\r\n /g, "");
  assert.match(desdobrado, /LOCATION:Lab 4\\, CT 9\\, Ufes Goiabeiras\r\n/);
  assert.match(desdobrado, /UID:game-jam-26-dia-1@gamejam\.pet\.inf\.ufes\.br/);
  // O Mortal Kombat nao tem hora para acabar: a descricao diz isso.
  assert.match(desdobrado, /DESCRIPTION:A partir das 14h\\, sem hora fixa para acabar\./);
  assert.match(desdobrado, /DESCRIPTION:Das 14h às 17h\. Lab 2/);
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  for (const linha of ics.split("\r\n")) assert.ok(new TextEncoder().encode(linha).length <= 75, `linha longa: ${linha}`);
});

test("o link do Google Agenda abre o dia preenchido, com a sala", () => {
  const u = new URL(linkGoogleAgenda(DIAS[1]));
  assert.equal(u.hostname, "calendar.google.com");
  assert.equal(u.searchParams.get("action"), "TEMPLATE");
  assert.equal(u.searchParams.get("text"), "Game Jam 26 · Dia 2: Workshop de programação de tanques");
  assert.equal(u.searchParams.get("dates"), "20261202T170000Z/20261202T200000Z");
  assert.equal(u.searchParams.get("location"), "Lab 4, CT 9, Ufes Goiabeiras");
});
