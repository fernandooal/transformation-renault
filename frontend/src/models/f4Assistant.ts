/**
 * Assistente de preenchimento da F4.
 *
 * POC: por padrão as sugestões saem de um motor de regras local, ancorado no
 * histórico de F4 do dataset — nada é inventado, todo número citado vem de uma
 * F4 que existe. Trocando `VITE_AI_ASSISTANT=live`, as mesmas sugestões passam
 * a ser pedidas ao modelo via /api/chat. Ver services/assistant.service.ts.
 */
import type { FormState } from "./f4Form";

export type RiskLevel = "baixo" | "medio" | "alto";

export type InsightKind =
  /** Algo no preenchimento atual aumenta a chance de devolução. */
  | "risco"
  /** Uma F4 anterior parecida, com o desfecho dela. */
  | "precedente"
  /** Sugestão de valor, aplicável com um clique. */
  | "sugestao";

export interface AssistantInsight {
  id: string;
  kind: InsightKind;
  level: RiskLevel;
  title: string;
  body: string;
  /** Campo de `SECTIONS` a que o insight se refere, quando houver. */
  field?: string;
  /** Valor proposto para esse campo. */
  suggestedValue?: string;
  /** F4 que embasa a afirmação, para o usuário conferir. */
  sourceF4?: { id: number; code: string };
}

export interface AssistantReport {
  level: RiskLevel;
  /** 0 a 100. Quanto maior, maior a chance de devolução. */
  score: number;
  headline: string;
  insights: AssistantInsight[];
  /** Como o relatório foi produzido, para a tela nunca mentir sobre isso. */
  source: "regras" | "modelo";
}

export interface AssistantInput {
  form: FormState;
  totalImpact: number;
}

export const RISK_LABEL: Record<RiskLevel, string> = {
  baixo: "Risco baixo",
  medio: "Risco médio",
  alto: "Risco alto",
};

export const RISK_TONE: Record<RiskLevel, "green" | "orange" | "red"> = {
  baixo: "green",
  medio: "orange",
  alto: "red",
};
