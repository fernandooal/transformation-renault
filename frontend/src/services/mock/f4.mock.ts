/**
 * Dataset da DEMO no domínio da mentoria: 10 F4s cobrindo os 8 status,
 * com histórico, checkpoints e partes envolvidas.
 *
 * Existe porque o backend atual devolve apenas 4 documentos com os status
 * antigos (Draft / In approval / Signed / Late) e cargo único "Demo". Quando a
 * API falar o vocabulário canônico, este arquivo sai e o adaptador vira
 * identidade.
 */
import type { F4Checkpoint, F4Detail, F4HistoryEntry, F4Summary, Person } from "../../models/f4";
import type { F4Status } from "../../models/status";
import { PEOPLE } from "./people";
import { documentsFor } from "./documents.mock";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
const daysAgo = (d: number) => hoursAgo(d * 24);

function checkpoints(done: number, by: string): F4Checkpoint[] {
  const base = [
    { id: "created", label: "F4 Criada" },
    { id: "technical", label: "Aprovação Técnica" },
    { id: "commercial", label: "Aprovação Comercial" },
  ];
  return base.map((c, i) => ({
    ...c,
    done: i < done,
    at: i < done ? daysAgo(7 - i * 2) : null,
    by: i < done ? by : null,
  }));
}

let entryId = 0;
function entry(
  author: Person,
  kind: F4HistoryEntry["kind"],
  at: string,
  body: string,
  tag?: string,
  tagTone?: F4HistoryEntry["tagTone"]
): F4HistoryEntry {
  return { id: ++entryId, author, at, kind, body, tag, tagTone };
}

interface Seed {
  id: number;
  code: string;
  version: string;
  part: string;
  partNumber: string;
  supplier: Person;
  project: string;
  status: F4Status;
  stagesDone: number;
  returns: number;
  technicalReturns: number;
  commercialReturns: number;
  responsible: Person | null;
  outcome: F4Summary["outcome"];
  updatedAt: string;
}

const SEEDS: Seed[] = [
  { id: 1, code: "F4 2024 - 0847", version: "v3", part: "Disco de freio dianteiro", partNumber: "7701208466", supplier: PEOPLE.andrade, project: "U79 Oroch", status: "TECH_REVIEW", stagesDone: 2, returns: 3, technicalReturns: 2, commercialReturns: 1, responsible: PEOPLE.leticia, outcome: null, updatedAt: daysAgo(2) },
  { id: 2, code: "F4 2024 - 0851", version: "v1", part: "Suporte do coletor de admissão", partNumber: "8200934112", supplier: PEOPLE.andrade, project: "R1312 Boreal", status: "IN_REWORK", stagesDone: 2, returns: 0, technicalReturns: 0, commercialReturns: 0, responsible: PEOPLE.leticia, outcome: null, updatedAt: hoursAgo(5) },
  { id: 3, code: "F4 2024 - 0839", version: "v2", part: "Chicote elétrico da porta", partNumber: "7711636988", supplier: PEOPLE.andrade, project: "X62 Master", status: "COMMERCIAL_REVIEW", stagesDone: 3, returns: 2, technicalReturns: 1, commercialReturns: 1, responsible: PEOPLE.rafael, outcome: null, updatedAt: daysAgo(1) },
  { id: 4, code: "F4 2024 - 0822", version: "v1", part: "Coxim do motor", partNumber: "1126800422", supplier: PEOPLE.plasttech, project: "HJF Kardian", status: "IN_REWORK", stagesDone: 2, returns: 0, technicalReturns: 0, commercialReturns: 0, responsible: PEOPLE.leticia, outcome: null, updatedAt: hoursAgo(3) },
  { id: 5, code: "F4 2024 - 0810", version: "v4", part: "Alojamento do farol LED", partNumber: "2609011552", supplier: PEOPLE.plasttech, project: "HJD Duster", status: "APPROVED", stagesDone: 4, returns: 1, technicalReturns: 1, commercialReturns: 0, responsible: null, outcome: "concluida", updatedAt: daysAgo(4) },
  { id: 6, code: "F4 2024 - 0798", version: "v2", part: "Cabo do freio de mão", partNumber: "3650402192", supplier: PEOPLE.eletrosis, project: "BBB Kwid", status: "CANCELLED", stagesDone: 3, returns: 0, technicalReturns: 0, commercialReturns: 0, responsible: null, outcome: "encerrada", updatedAt: daysAgo(6) },
  { id: 7, code: "F4 2024 - 0866", version: "v1", part: "Travessa do painel frontal", partNumber: "8201455907", supplier: PEOPLE.eletrosis, project: "U79 Oroch", status: "FINAL_REVIEW", stagesDone: 3, returns: 1, technicalReturns: 0, commercialReturns: 1, responsible: PEOPLE.ana, outcome: null, updatedAt: hoursAgo(9) },
  { id: 8, code: "F4 2024 - 0871", version: "v1", part: "Bucha da bandeja suspensão", partNumber: "5461122871", supplier: PEOPLE.andrade, project: "X62 Master", status: "DRAFT", stagesDone: 0, returns: 0, technicalReturns: 0, commercialReturns: 0, responsible: null, outcome: null, updatedAt: hoursAgo(1) },
  { id: 9, code: "F4 2024 - 0803", version: "v5", part: "Módulo de conforto BCM", partNumber: "2843901145", supplier: PEOPLE.eletrosis, project: "HJF Kardian", status: "REJECTED", stagesDone: 2, returns: 4, technicalReturns: 3, commercialReturns: 1, responsible: PEOPLE.carla, outcome: null, updatedAt: daysAgo(3) },
  { id: 10, code: "F4 2024 - 0858", version: "v2", part: "Defletor de ar do radiador", partNumber: "2148806633", supplier: PEOPLE.plasttech, project: "R1312 Boreal", status: "TECH_REVIEW", stagesDone: 2, returns: 1, technicalReturns: 1, commercialReturns: 0, responsible: PEOPLE.bruno, outcome: null, updatedAt: hoursAgo(16) },
];

function historyFor(seed: Seed): F4HistoryEntry[] {
  const s = seed.supplier;
  const pfe = seed.responsible ?? PEOPLE.leticia;
  const list: F4HistoryEntry[] = [
    entry(s, "submission", daysAgo(7), `Submissão inicial da F4 (v1) — proposta de fabricação do ${seed.part.toLowerCase()}.`, "v1 · abertura", "neutral"),
  ];

  if (seed.technicalReturns > 0) {
    list.push(
      entry(pfe, "return", daysAgo(5), "Devolvida para revisão técnica. Material proposto abaixo do especificado; solicitado retorno ao grade anterior na v2.", "1ª devolução técnica", "orange")
    );
  }
  if (seed.commercialReturns > 0) {
    list.push(
      entry(PEOPLE.rafael, "comment", daysAgo(3), "Do lado comercial, a v2 fica acima do target por causa da alteração extra. Se a engenharia aprovar a redução, o gap fecha.", "mini-aprovação comercial condicional", "green")
    );
  }
  if (seed.stagesDone >= 2) {
    list.push(
      entry(PEOPLE.rafael, "checkpoint", daysAgo(2), "Validação dimensional concluída — criado em conjunto com a engenharia. Cotas principais dentro da tolerância.", "Marco", "purple")
    );
  }
  if (seed.technicalReturns > 1) {
    list.push(
      entry(pfe, "return", hoursAgo(30), "Devolvida para revisão técnica. A furação atual compromete a dissipação de calor; reduzir o número de furos ou justificar com relatório de ensaio.", `${seed.technicalReturns}ª devolução técnica`, "orange")
    );
  }
  list.push(
    entry(s, "submission", hoursAgo(8), `Reenvio da ${seed.version} atendendo à devolução anterior. Ajustes aplicados e ferramental já validado.`, `${seed.version} · 3 campos alterados`, "blue")
  );

  return list.sort((a, b) => (a.at < b.at ? 1 : -1));
}

function partiesFor(seed: Seed): Person[] {
  const list = [seed.supplier, seed.responsible ?? PEOPLE.leticia];
  if (seed.status === "COMMERCIAL_REVIEW" || seed.commercialReturns > 0) list.push(PEOPLE.rafael);
  if (seed.status === "FINAL_REVIEW") list.push(PEOPLE.ana);
  return list.filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);
}

export const F4_DETAILS: F4Detail[] = SEEDS.map((seed) => ({
  ...seed,
  stagesTotal: 4,
  parties: partiesFor(seed),
  history: historyFor(seed),
  checkpoints: checkpoints(Math.min(seed.stagesDone, 3), (seed.responsible ?? PEOPLE.leticia).name),
  documents: documentsFor(seed),
}));

export const F4_LIST: F4Summary[] = F4_DETAILS;

export const findF4 = (id: number): F4Detail | null =>
  F4_DETAILS.find((d) => d.id === id) ?? null;
