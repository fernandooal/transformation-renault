/**
 * Ponto único de verdade dos status da F4.
 *
 * O vocabulário vem da MENTORIA (8 status), não do design — decisão do cliente
 * quando os dois divergiram. O design contribui com a linguagem visual: os
 * pares cor-do-texto / fundo-do-texto do style-guide.
 *
 * Quando o backend passar a falar esses códigos, só STATUS_FROM_API muda.
 */

export const F4_STATUSES = [
  "DRAFT",
  "TECH_REVIEW",
  "COMMERCIAL_REVIEW",
  "FINAL_REVIEW",
  "IN_REWORK",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
] as const;

export type F4Status = (typeof F4_STATUSES)[number];

export type Tone = "purple" | "blue" | "orange" | "green" | "red" | "teal" | "neutral";

export interface StatusMeta {
  id: F4Status;
  /** Rótulo curto, para badge em tabela. */
  label: string;
  /** Rótulo longo, para a tela de detalhe. */
  longLabel: string;
  tone: Tone;
  /** Estado terminal: não admite mais transição. */
  terminal: boolean;
}

export const STATUS_META: Record<F4Status, StatusMeta> = {
  DRAFT: {
    id: "DRAFT",
    label: "Rascunho",
    longLabel: "Rascunho",
    tone: "neutral",
    terminal: false,
  },
  TECH_REVIEW: {
    id: "TECH_REVIEW",
    label: "Revisão técnica",
    longLabel: "Em Revisão Técnica",
    tone: "orange",
    terminal: false,
  },
  COMMERCIAL_REVIEW: {
    id: "COMMERCIAL_REVIEW",
    label: "Revisão compr.",
    longLabel: "Em Revisão Comercial",
    tone: "orange",
    terminal: false,
  },
  FINAL_REVIEW: {
    id: "FINAL_REVIEW",
    label: "Revisão final",
    longLabel: "Em Revisão Final",
    tone: "purple",
    terminal: false,
  },
  IN_REWORK: {
    id: "IN_REWORK",
    label: "Em Análise",
    longLabel: "Em Alteração",
    tone: "blue",
    terminal: false,
  },
  APPROVED: {
    id: "APPROVED",
    label: "Aprovada",
    longLabel: "Aprovada",
    tone: "green",
    terminal: true,
  },
  REJECTED: {
    id: "REJECTED",
    label: "Reprovada",
    longLabel: "Reprovada",
    tone: "red",
    terminal: false,
  },
  CANCELLED: {
    id: "CANCELLED",
    label: "Cancelada",
    longLabel: "Cancelada",
    tone: "neutral",
    terminal: true,
  },
};

export const statusMeta = (s: F4Status): StatusMeta => STATUS_META[s];

/** Vocabulário do backend atual. Some quando a API falar os códigos canônicos. */
export const STATUS_FROM_API: Record<string, F4Status> = {
  Draft: "DRAFT",
  "In approval": "TECH_REVIEW",
  Signed: "APPROVED",
  Late: "TECH_REVIEW",
};

export const toStatus = (raw: string): F4Status =>
  (F4_STATUSES as readonly string[]).includes(raw)
    ? (raw as F4Status)
    : (STATUS_FROM_API[raw] ?? "DRAFT");

/** Chips da tela "Todas as F4's". Agregam status, como no design. */
export interface F4Filter {
  id: string;
  label: string;
  matches: (s: F4Status) => boolean;
}

export const F4_FILTERS: F4Filter[] = [
  { id: "todas", label: "Todas", matches: () => true },
  {
    id: "revisao",
    label: "Em Revisão",
    matches: (s) => s === "TECH_REVIEW" || s === "COMMERCIAL_REVIEW" || s === "FINAL_REVIEW",
  },
  { id: "alteracao", label: "Em Alteração", matches: (s) => s === "IN_REWORK" },
  { id: "aprovadas", label: "Aprovadas", matches: (s) => s === "APPROVED" },
  { id: "reprovadas", label: "Reprovadas", matches: (s) => s === "REJECTED" },
];

/** Etapas do "Fluxo da F4" na tela de detalhe — 4, conforme a mentoria. */
export const FLOW_STAGES = [
  { id: "supplier", label: "Fornecedor", status: null },
  { id: "technical", label: "Revisão Técnica", status: "TECH_REVIEW" },
  { id: "commercial", label: "Revisão Comercial", status: "COMMERCIAL_REVIEW" },
  { id: "final", label: "Revisão Final", status: "FINAL_REVIEW" },
] as const;
