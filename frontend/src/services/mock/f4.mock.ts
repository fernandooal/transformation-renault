/**
 * Dataset da DEMO no domínio da mentoria: 10 F4s cobrindo os 8 status,
 * com histórico, checkpoints e partes envolvidas.
 *
 * Existe porque o backend atual devolve apenas 4 documentos com os status
 * antigos (Draft / In approval / Signed / Late) e cargo único "Demo". Quando a
 * API falar o vocabulário canônico, este arquivo sai e o adaptador vira
 * identidade.
 */
import type {
  F4Checkpoint,
  F4Comparison,
  F4Detail,
  F4HistoryEntry,
  F4Summary,
  Person,
} from "../../models/f4";
import type { F4Status } from "../../models/status";
import { PEOPLE } from "./people";
import { documentsFor } from "./documents.mock";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
const daysAgo = (d: number) => hoursAgo(d * 24);

function checkpoints(done: number, by: string): F4Checkpoint[] {
  // Os checkpoints agora rotulam os conectores entre as etapas do rail,
  // então o texto é o marco que fez o fluxo avançar, não o nome da etapa.
  const base = [
    { id: "created", label: "Proposta enviada" },
    { id: "technical", label: "Validação dimensional" },
    { id: "commercial", label: "Aprovação comercial" },
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
  gapComercial: number;
  gapTecnico: number;
}

const SEEDS: Seed[] = [
  { id: 1, code: "F4 2024 - 0847", version: "v3", part: "Disco de freio dianteiro", partNumber: "7701208466", supplier: PEOPLE.andrade, project: "U79 Oroch", status: "TECH_REVIEW", stagesDone: 2, returns: 3, technicalReturns: 2, commercialReturns: 1, responsible: PEOPLE.leticia, outcome: null, updatedAt: daysAgo(2), gapComercial: 1937.5, gapTecnico: 791.3 },
  { id: 2, code: "F4 2024 - 0851", version: "v1", part: "Suporte do coletor de admissão", partNumber: "8200934112", supplier: PEOPLE.andrade, project: "R1312 Boreal", status: "IN_REWORK", stagesDone: 2, returns: 0, technicalReturns: 0, commercialReturns: 0, responsible: PEOPLE.leticia, outcome: null, updatedAt: hoursAgo(5), gapComercial: 2675.0, gapTecnico: 1102.6 },
  { id: 3, code: "F4 2024 - 0839", version: "v2", part: "Chicote elétrico da porta", partNumber: "7711636988", supplier: PEOPLE.andrade, project: "X62 Master", status: "COMMERCIAL_REVIEW", stagesDone: 3, returns: 2, technicalReturns: 1, commercialReturns: 1, responsible: PEOPLE.rafael, outcome: null, updatedAt: daysAgo(1), gapComercial: 3412.5, gapTecnico: 1413.9 },
  { id: 4, code: "F4 2024 - 0822", version: "v1", part: "Coxim do motor", partNumber: "1126800422", supplier: PEOPLE.plasttech, project: "HJF Kardian", status: "IN_REWORK", stagesDone: 2, returns: 0, technicalReturns: 0, commercialReturns: 0, responsible: PEOPLE.leticia, outcome: null, updatedAt: hoursAgo(3), gapComercial: 4150.0, gapTecnico: 1725.2 },
  { id: 5, code: "F4 2024 - 0810", version: "v4", part: "Alojamento do farol LED", partNumber: "2609011552", supplier: PEOPLE.plasttech, project: "HJD Duster", status: "APPROVED", stagesDone: 4, returns: 1, technicalReturns: 1, commercialReturns: 0, responsible: null, outcome: "concluida", updatedAt: daysAgo(4), gapComercial: 4887.5, gapTecnico: 2036.5 },
  { id: 6, code: "F4 2024 - 0798", version: "v2", part: "Cabo do freio de mão", partNumber: "3650402192", supplier: PEOPLE.eletrosis, project: "BBB Kwid", status: "CANCELLED", stagesDone: 3, returns: 0, technicalReturns: 0, commercialReturns: 0, responsible: null, outcome: "encerrada", updatedAt: daysAgo(6), gapComercial: 5625.0, gapTecnico: 2347.8 },
  { id: 7, code: "F4 2024 - 0866", version: "v1", part: "Travessa do painel frontal", partNumber: "8201455907", supplier: PEOPLE.eletrosis, project: "U79 Oroch", status: "FINAL_REVIEW", stagesDone: 3, returns: 1, technicalReturns: 0, commercialReturns: 1, responsible: PEOPLE.ana, outcome: null, updatedAt: hoursAgo(9), gapComercial: 6362.5, gapTecnico: 2659.1 },
  { id: 8, code: "F4 2024 - 0871", version: "v1", part: "Bucha da bandeja suspensão", partNumber: "5461122871", supplier: PEOPLE.andrade, project: "X62 Master", status: "DRAFT", stagesDone: 0, returns: 0, technicalReturns: 0, commercialReturns: 0, responsible: null, outcome: null, updatedAt: hoursAgo(1), gapComercial: 7100.0, gapTecnico: 2970.4 },
  { id: 9, code: "F4 2024 - 0803", version: "v5", part: "Módulo de conforto BCM", partNumber: "2843901145", supplier: PEOPLE.eletrosis, project: "HJF Kardian", status: "REJECTED", stagesDone: 2, returns: 4, technicalReturns: 3, commercialReturns: 1, responsible: PEOPLE.carla, outcome: null, updatedAt: daysAgo(3), gapComercial: 7837.5, gapTecnico: 3281.7 },
  { id: 10, code: "F4 2024 - 0858", version: "v2", part: "Defletor de ar do radiador", partNumber: "2148806633", supplier: PEOPLE.plasttech, project: "R1312 Boreal", status: "TECH_REVIEW", stagesDone: 2, returns: 1, technicalReturns: 1, commercialReturns: 0, responsible: PEOPLE.bruno, outcome: null, updatedAt: hoursAgo(16), gapComercial: 8575.0, gapTecnico: 3593.0 },
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

/**
 * Histórico de valores por versão, para a aba "Comparar Versões".
 * Os campos e os valores são os do design; o diff real depende de um
 * histórico de alterações que o backend ainda não expõe.
 */
export function comparisonFor(f4: F4Detail): F4Comparison {
  const count = Math.max(Number(f4.version.replace(/\D/g, "")) || 1, 1);
  const versions = Array.from({ length: count }, (_, i) => `v${i + 1}`);
  const cut = <T,>(xs: T[]): T[] => xs.slice(0, count);

  return {
    versions,
    currentIndex: count - 1,
    rows: [
      { label: "Material", values: cut(["FC250", "FC300", "FC300", "FC300", "FC300"]) },
      { label: "Furação (nº de furos)", values: cut(["6 furos", "3 furos", "4 furos", "5 furos", "5 furos"]) },
      { label: "Ø do furo de ventilação", values: cut(["8,0 mm", "7,0 mm", "9,0 mm", "9,2 mm", "9,2 mm"]) },
      { label: "Espessura do disco", values: cut(["24,0 mm", "24,0 mm", "24,0 mm", "24,0 mm", "24,0 mm"]) },
      { label: "Custo unitário", values: cut(["R$ 47,80", "R$ 47,80", "R$ 45,20", "R$ 44,10", "R$ 44,10"]) },
      { label: "Tratamento superficial", values: cut(["Geomet 321", "Geomet 321", "Geomet 321", "Geomet 321", "Geomet 321"]) },
    ],
  };
}
