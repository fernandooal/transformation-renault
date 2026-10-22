/**
 * Contrato das telas de Fornecedores — o que o backend precisará fornecer.
 * Hoje vem do mock; quando a API existir, só o adaptador muda.
 *
 * O histórico de F4 do fornecedor reaproveita `AttentionItem` de propósito: a
 * lista "Histórico de F4's" do design é o mesmo componente do "Precisa da sua
 * atenção" do dashboard, então os dois falam a mesma forma de linha.
 */
import type { AttentionItem, Kpi } from "./dashboard";

/** Tinta de um círculo de métrica / do avatar. Vira token em supplier.css. */
export type SupplierTint = "purple" | "green" | "orange";

/** Um dos três círculos do card: valor grande + rótulo pequeno. */
export interface SupplierMetric {
  id: string;
  /** Já formatado em pt-BR pelo mock/adaptador ("42", "88%", "2,1"). */
  value: string;
  label: string;
  tint: SupplierTint;
}

/** Barra "Distribuição de resultado" — percentuais que somam 100. */
export interface SupplierOutcome {
  aprovadas: number;
  reprovadas: number;
  andamento: number;
}

export interface SupplierSummary {
  id: string;
  name: string;
  /** "MA" — iniciais do avatar quadrado. */
  initials: string;
  city: string;
  uf: string;
  tint: SupplierTint;
  metrics: SupplierMetric[];
  outcome: SupplierOutcome;
  /** Rótulo do período à direita da barra ("Últimos 12 meses"). */
  outcomePeriod: string;
  /** Texto-insight de duas linhas. */
  insight: string;
  /** Parte final do insight, em negrito roxo. Opcional: nem todo card tem. */
  insightHighlight?: string;
}

/** Linha do "Histórico de F4's". Mesma forma da lista de atenção. */
export type SupplierF4 = AttentionItem;

export interface SupplierReport {
  supplier: SupplierSummary;
  /** Os quatro KPIs do topo. Mesmo contrato do dashboard. */
  kpis: Kpi[];
  history: SupplierF4[];
}
