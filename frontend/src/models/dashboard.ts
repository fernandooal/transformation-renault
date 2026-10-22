/**
 * Contrato do dashboard — o que o backend precisará fornecer.
 * Hoje vem do mock; quando a API existir, só o adaptador muda.
 */
import type { IconName } from "../views/components/icons";
import type { F4Status } from "./status";

export interface KpiDelta {
  text: string;
  tone: "positive" | "negative" | "neutral";
}

export interface Kpi {
  id: string;
  label: string;
  value: string;
  icon?: IconName;
  delta?: KpiDelta;
}

export interface StageQueue {
  stage: "fornecedor" | "pfe" | "comprador" | "aprovador";
  label: string;
  emAnalise: number;
  devolvida: number;
  aprovada: number;
}

export interface AttentionItem {
  id: number;
  code: string;
  part: string;
  reason: string;
  status: F4Status;
  stalledHours: number;
}

export interface MonthlyReturns {
  month: string;
  tecnicas: number;
  comerciais: number;
}

export interface OutcomeSlice {
  id: "aprovadas" | "andamento" | "reprovadas";
  label: string;
  percent: number;
}

/** Filtro do dashboard. Vazio em qualquer campo = sem restrição. */
export interface DashboardFilter {
  /** Modelo de carro, pelo código do projeto ("U79"). */
  project: string;
  supplier: string;
  /** Busca livre em peça, código e part number. */
  query: string;
}

export const EMPTY_FILTER: DashboardFilter = { project: "", supplier: "", query: "" };

export const isFiltered = (f: DashboardFilter): boolean =>
  Boolean(f.project || f.supplier || f.query.trim());

export interface DashboardOptions {
  projects: Array<{ value: string; label: string }>;
  suppliers: Array<{ value: string; label: string }>;
}

export interface DashboardOverview {
  /** Bloco 1: ativas, vai-e-volta, ciclo médio, aguardando você. */
  kpis: Kpi[];
  /** Bloco 3: "Minhas F4". */
  myKpis: Kpi[];
  queues: StageQueue[];
  queuesNote: string;
  attention: AttentionItem[];
  monthlyReturns: MonthlyReturns[];
  monthlyNote: string;
  outcome: OutcomeSlice[];
  /** Quantas F4 o filtro deixou passar, para a tela avisar quando sobra pouco. */
  matched: number;
  options: DashboardOptions;
}
