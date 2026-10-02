// "Salvar na agenda" (src/lib/agenda.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { icsDoEvento, linkGoogleAgenda } from "../src/lib/agenda.ts";

const evento = { numero: "4", dataEvento: "2026-11-28T15:00:00.000Z", local: "CT 9, Ufes Goiabeiras" };

test("o arquivo .ics tem o inicio em UTC, o local escapado e linhas curtas", () => {
  const ics = icsDoEvento(evento, new Date("2026-09-28T12:00:00Z"));
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /\r\nDTSTART:20261128T150000Z\r\n/);
  assert.match(ics, /\r\nLOCATION:CT 9\\, Ufes Goiabeiras\r\n/);
  assert.match(ics, /\r\nUID:game-jam-season-4@gamejam\.pet\.inf\.ufes\.br\r\n/);
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  for (const linha of ics.split("\r\n")) assert.ok(new TextEncoder().encode(linha).length <= 75, `linha longa: ${linha}`);
  // Desdobrar devolve o texto inteiro.
  assert.match(ics.replace(/\r\n /g, ""), /DESCRIPTION:Competição de programação em equipes\\, organizada/);
});

test("sem local, nao inventa um", () => {
  assert.doesNotMatch(icsDoEvento({ ...evento, local: null }), /LOCATION/);
});

test("o link do Google Agenda abre o evento preenchido", () => {
  const u = new URL(linkGoogleAgenda(evento));
  assert.equal(u.hostname, "calendar.google.com");
  assert.equal(u.searchParams.get("action"), "TEMPLATE");
  assert.equal(u.searchParams.get("text"), "PET Game Jam · Season 4");
  assert.equal(u.searchParams.get("dates"), "20261128T150000Z/20261128T150000Z");
  assert.equal(u.searchParams.get("location"), "CT 9, Ufes Goiabeiras");
});
