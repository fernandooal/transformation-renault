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

export interface F4Signature {
  signer: Person;
  /** Ordem da fila de assinatura. */
  order: number;
  signedAt: string | null;
}

export type F4DocumentKind = "TERMO" | "ANEXO_TECNICO" | "PLANILHA_CUSTOS" | "RELATORIO";

export interface F4DocumentFile {
  id: string;
  name: string;
  kind: F4DocumentKind;
  version: string;
  addedAt: string;
  sizeKb: number;
  requiresSignature: boolean;
  signatures: F4Signature[];
  /** Rota do visualizador de PDF; null quando o arquivo é só anexo. */
  pdfPath: string | null;
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
  /** Diferença de preço negociada, em BRL. Não existe no backend: vem do mock. */
  gapComercial: number;
  gapTecnico: number;
}

export interface F4Detail extends F4Summary {
  project: string;
  parties: Person[];
  history: F4HistoryEntry[];
  checkpoints: F4Checkpoint[];
  documents: F4DocumentFile[];
  technicalReturns: number;
  commercialReturns: number;
}

export interface DocumentState {
  total: number;
  signed: number;
  pending: F4Signature[];
  /** Próximo da fila: só ele pode assinar. */
  next: F4Signature | null;
  complete: boolean;
}

export function documentState(doc: F4DocumentFile): DocumentState {
  const ordered = [...doc.signatures].sort((a, b) => a.order - b.order);
  const pending = ordered.filter((s) => !s.signedAt);
  return {
    total: ordered.length,
    signed: ordered.length - pending.length,
    pending,
    next: pending[0] ?? null,
    complete: doc.requiresSignature && pending.length === 0,
  };
}

/** Progresso da aba: documentos que exigem assinatura e já estão completos. */
export function signatureProgress(docs: F4DocumentFile[]): { done: number; total: number } {
  const required = docs.filter((d) => d.requiresSignature);
  return {
    done: required.filter((d) => documentState(d).complete).length,
    total: required.length,
  };
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

/** Uma linha da matriz campo × versão da aba "Comparar Versões". */
export interface F4ComparisonRow {
  label: string;
  /** Valor por versão, na mesma ordem de `F4Comparison.versions`. */
  values: string[];
}

export interface F4Comparison {
  versions: string[];
  /** Índice da versão corrente em `versions`. */
  currentIndex: number;
  rows: F4ComparisonRow[];
}

/**
 * Direção da mudança de um valor em relação à versão anterior.
 * Compara o primeiro número do texto ("5 furos", "9,2 mm", "R$ 47,80");
 * valores sem número, ou iguais, não geram seta.
 */
export function valueTrend(current: string, previous: string | undefined): "up" | "down" | null {
  if (previous === undefined || current === previous) return null;
  const num = (v: string): number | null => {
    const m = v.replace(/\./g, "").match(/-?\d+(?:,\d+)?/);
    return m ? Number(m[0].replace(",", ".")) : null;
  };
  const a = num(current);
  const b = num(previous);
  if (a === null || b === null || a === b) return null;
  return a > b ? "up" : "down";
}
