/**
 * Domínio da F4 no frontend.
 *
 * Modelado a partir da MENTORIA (8 status, 4 etapas) e das telas do design
 * (lista, detalhe com abas, partes envolvidas, checkpoints).
 */
import type { F4Status, Tone } from "./status";
import type { Role } from "./roles";

export interface Person {
  id: number;
  name: string;
  email?: string;
  role: Role;
}

export type HistoryKind = "submission" | "return" | "approval" | "comment" | "checkpoint";

export interface F4HistoryEntry {
  id: number;
  author: Person;
  at: string;
  kind: HistoryKind;
  body: string;
  /** Etiqueta abaixo do corpo: "2ª devolução técnica", "v2 → v3 · 3 campos alterados". */
  tag?: string;
  tagTone?: Tone;
}

export interface F4Checkpoint {
  id: string;
  label: string;
  done: boolean;
  at: string | null;
  by: string | null;
}

/** Linha da tabela "Todas as F4's". */
export interface F4Summary {
  id: number;
  /** "F4 2024 - 0847" */
  code: string;
  /** "v3" */
  version: string;
  part: string;
  partNumber: string;
  supplier: Person;
  status: F4Status;
  stagesDone: number;
  stagesTotal: number;
  returns: number;
  responsible: Person | null;
  /** Encerramento, eixo separado do status (como no design). */
  outcome: "concluida" | "encerrada" | null;
  updatedAt: string;
}

export interface F4Detail extends F4Summary {
  project: string;
  parties: Person[];
  history: F4HistoryEntry[];
  checkpoints: F4Checkpoint[];
  technicalReturns: number;
  commercialReturns: number;
}

/** "3ª Volta • 2 Devoluções Técnicas, 1 Comercial" */
export function returnsSummary(d: Pick<F4Detail, "returns" | "technicalReturns" | "commercialReturns">): string {
  const parts: string[] = [];
  if (d.technicalReturns > 0) {
    parts.push(`${d.technicalReturns} ${d.technicalReturns === 1 ? "Devolução Técnica" : "Devoluções Técnicas"}`);
  }
  if (d.commercialReturns > 0) {
    parts.push(`${d.commercialReturns} Comercial${d.commercialReturns > 1 ? "is" : ""}`);
  }
  const round = `${d.returns}ª Volta`;
  return parts.length ? `${round} • ${parts.join(", ")}` : round;
}
