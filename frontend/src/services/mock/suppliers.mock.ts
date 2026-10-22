/**
 * Fornecedores da DEMO.
 *
 * Os três cards e os números (42 / 88% / 2,1 etc.) são os literais do design
 * — o backend ainda não agrega nada por fornecedor. O que dá para derivar do
 * dataset existente é derivado: o "Histórico de F4's" da tela de detalhe sai
 * de F4_LIST, filtrado pelo fornecedor, ordenado por urgência.
 */
import type { Kpi } from "../../models/dashboard";
import type { SupplierF4, SupplierReport, SupplierSummary } from "../../models/supplier";
import type { F4Summary } from "../../models/f4";
import { decimal, int, percent, signed } from "../../utils/format";
import { F4_LIST } from "./f4.mock";
import { PEOPLE } from "./people";

interface Seed {
  id: string;
  name: string;
  initials: string;
  city: string;
  uf: string;
  tint: SupplierSummary["tint"];
  /** Chave em PEOPLE — liga o fornecedor às F4 do dataset da DEMO. */
  person: string;
  totalF4: number;
  approvalRate: number;
  returnsPerF4: number;
  outcome: SupplierSummary["outcome"];
  insight: string;
  insightHighlight?: string;
  /** KPIs do topo da tela de detalhe (MOCK — dependem do histórico do workflow). */
  avgDaysToApprove: number;
  returnsDelta: number;
  approvalDelta: number;
  daysDelta: string;
}

const SEEDS: Seed[] = [
  {
    id: "metalurgica-andrade",
    name: "Metalúrgica Andrade",
    initials: "MA",
    city: "São Bernardo",
    uf: "SP",
    tint: "purple",
    person: "andrade",
    totalF4: 42,
    approvalRate: 88,
    returnsPerF4: 2.1,
    outcome: { aprovadas: 75, reprovadas: 17, andamento: 8 },
    insight: "Responde rápido e costuma acatar devoluções técnicas em 1 volta.",
    insightHighlight: "Parceiro confiável",
    avgDaysToApprove: 5.4,
    returnsDelta: -0.9,
    approvalDelta: 6,
    daysDelta: "-22%",
  },
  {
    id: "fundicao-tiete",
    name: "Fundição Tietê",
    initials: "FT",
    city: "Piracicaba",
    uf: "SP",
    tint: "orange",
    person: "plasttech",
    totalF4: 31,
    approvalRate: 74,
    returnsPerF4: 4.3,
    outcome: { aprovadas: 67, reprovadas: 23, andamento: 10 },
    insight: "Alta recorrência de idas e voltas por custo.",
    insightHighlight: "Padrão: renegocia após 1ª devolução comercial.",
    avgDaysToApprove: 9.1,
    returnsDelta: 0.4,
    approvalDelta: -3,
    daysDelta: "+8%",
  },
  {
    id: "eletrica-sul",
    name: "Elétrica Sul",
    initials: "EL",
    city: "Gravataí",
    uf: "RS",
    tint: "purple",
    person: "eletrosis",
    totalF4: 27,
    approvalRate: 81,
    returnsPerF4: 2.8,
    outcome: { aprovadas: 76, reprovadas: 15, andamento: 9 },
    insight:
      "Forte em prazo, mas devoluções técnicas concentradas em documentação incompleta.",
    avgDaysToApprove: 6.7,
    returnsDelta: -0.3,
    approvalDelta: 2,
    daysDelta: "-5%",
  },
];

function toSummary(seed: Seed): SupplierSummary {
  return {
    id: seed.id,
    name: seed.name,
    initials: seed.initials,
    city: seed.city,
    uf: seed.uf,
    tint: seed.tint,
    metrics: [
      { id: "total", value: int(seed.totalF4), label: "F4s Totais", tint: "purple" },
      { id: "aprovadas", value: percent(seed.approvalRate), label: "Aprovadas", tint: "green" },
      { id: "voltas", value: decimal(seed.returnsPerF4), label: "Voltas/F4", tint: "orange" },
    ],
    outcome: seed.outcome,
    outcomePeriod: "Últimos 12 meses",
    insight: seed.insight,
    insightHighlight: seed.insightHighlight,
  };
}

function kpisFor(seed: Seed): Kpi[] {
  return [
    {
      id: "total",
      label: "Total no período",
      value: int(seed.totalF4),
      icon: "docsStack",
      delta: { text: "F4's processadas", tone: "positive" },
    },
    {
      id: "voltas",
      label: "Voltas por F4",
      value: decimal(seed.returnsPerF4),
      icon: "arrowsUpDown",
      delta: {
        text: `${signed(seed.returnsDelta, "vs. trimestre anterior", 1)}`,
        tone: seed.returnsDelta <= 0 ? "positive" : "negative",
      },
    },
    {
      id: "aprovacao",
      label: "Taxa de Aprovação",
      value: percent(seed.approvalRate),
      delta: {
        text: signed(seed.approvalDelta, "p.p."),
        tone: seed.approvalDelta >= 0 ? "positive" : "negative",
      },
    },
    {
      id: "tempo",
      label: "Tempo até aprovar (dias)",
      value: decimal(seed.avgDaysToApprove),
      icon: "alarm",
      delta: { text: seed.daysDelta, tone: seed.daysDelta.startsWith("-") ? "positive" : "negative" },
    },
  ];
}

/** Mesma urgência da lista do dashboard: mais voltas primeiro, depois mais parada. */
function byUrgency(a: F4Summary, b: F4Summary): number {
  if (b.returns !== a.returns) return b.returns - a.returns;
  return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
}

function historyFor(seed: Seed): SupplierF4[] {
  const person = PEOPLE[seed.person];
  return F4_LIST.filter((f) => f.supplier.id === person.id)
    .slice()
    .sort(byUrgency)
    .map((f) => ({
      id: f.id,
      code: f.code.replace(/\s/g, "").replace("F4", "F4-"),
      part: f.part,
      reason:
        f.returns > 0
          ? `Fornecedor reenviou ${f.version} — alterou padrão de furação`
          : `${f.version} sem devoluções até aqui`,
      status: f.status,
      /* AttentionList imprime Math.round(h/24) dias; abaixo de 48h sairia
         "parado há 1 dias". Mesmo piso usado em dashboard.mock. */
      stalledHours: Math.max(
        48,
        Math.round((Date.now() - new Date(f.updatedAt).getTime()) / 3600_000)
      ),
    }));
}

export const SUPPLIERS: SupplierSummary[] = SEEDS.map(toSummary);

export function buildSupplierList(): SupplierSummary[] {
  return SUPPLIERS;
}

export function buildSupplierReport(id: string): SupplierReport | null {
  const seed = SEEDS.find((s) => s.id === id);
  if (!seed) return null;
  return { supplier: toSummary(seed), kpis: kpisFor(seed), history: historyFor(seed) };
}
