/**
 * Números do dashboard.
 *
 * Os KPIs de fluxo (voltas, ciclo médio, tempo até aprovar) só são calculáveis
 * a partir do histórico do workflow, que não existe no backend. Aqui eles são
 * derivados do dataset de F4 quando dá, e semeados com os valores do design
 * quando não dá — cada caso está marcado.
 */
import type { DashboardOverview } from "../../models/dashboard";
import { decimal, int, percent, signed } from "../../utils/format";
import { F4_LIST } from "./f4.mock";

const activeStatuses = ["TECH_REVIEW", "COMMERCIAL_REVIEW", "FINAL_REVIEW", "IN_REWORK"] as const;

export function buildOverview(): DashboardOverview {
  const active = F4_LIST.filter((f) => (activeStatuses as readonly string[]).includes(f.status));
  const withReturns = F4_LIST.filter((f) => f.returns > 0);
  const avgReturns =
    withReturns.reduce((sum, f) => sum + f.returns, 0) / (withReturns.length || 1);

  return {
    kpis: [
      {
        id: "ativas",
        label: "F4's Ativas",
        value: int(active.length),
        icon: "docsStack",
        delta: { text: `${signed(3)} essa semana`, tone: "positive" },
      },
      {
        id: "vaievolta",
        label: "Em vai e volta",
        value: int(withReturns.length),
        icon: "arrowsUpDown",
        delta: { text: `média de ${decimal(avgReturns)} voltas`, tone: "neutral" },
      },
      {
        // MOCK — depende do histórico do workflow
        id: "ciclo",
        label: "Ciclo médio (dias)",
        value: decimal(6.2),
        icon: "clockRotate",
        delta: { text: `${signed(-1.8, "dia vs. mês anterior", 1)}`, tone: "positive" },
      },
      {
        // MOCK — depende de "de quem é a vez", que é regra de workflow
        id: "aguardando",
        label: "Aguardando você",
        value: int(4),
        icon: "alarm",
        delta: { text: "1 há mais de 48h", tone: "negative" },
      },
    ],

    myKpis: [
      { id: "total", label: "Total no período", value: int(48), icon: "docsStack", delta: { text: "F4's processadas", tone: "neutral" } },
      { id: "voltas", label: "Voltas por F4", value: decimal(3.4), icon: "arrowsUpDown", delta: { text: `${signed(-0.9, "vs. trimestre anterior", 1)}`, tone: "positive" } },
      { id: "aprovacao", label: "Taxa de Aprovação", value: percent(23), delta: { text: `${signed(6, "p.p.")}`, tone: "positive" } },
      { id: "tempo", label: "Tempo até aprovar (dias)", value: decimal(6.2), icon: "alarm", delta: { text: "-22%", tone: "positive" } },
    ],

    // MOCK — filas por etapa exigem saber em que etapa cada F4 parou
    queues: [
      { stage: "fornecedor", label: "Forn.", emAnalise: 4, devolvida: 0, aprovada: 0 },
      { stage: "pfe", label: "PFE", emAnalise: 3, devolvida: 6, aprovada: 0 },
      { stage: "comprador", label: "Compr.", emAnalise: 2, devolvida: 4, aprovada: 0 },
      { stage: "aprovador", label: "Aprov.", emAnalise: 0, devolvida: 0, aprovada: 3 },
    ],
    queuesNote:
      "A maior fila está no PFE — e boa parte é reincidência de devolução. É exatamente o gargalo que o histórico por F4 ajuda a encurtar.",

    attention: F4_LIST.filter((f) => f.returns > 0 && f.status !== "APPROVED" && f.status !== "CANCELLED")
      .slice(0, 4)
      .map((f) => ({
        id: f.id,
        code: f.code.replace(/\s/g, "").replace("F4", "F4-"),
        part: f.part,
        reason: `Fornecedor reenviou ${f.version} — alterou padrão de furação`,
        status: f.status,
        stalledHours: 48,
      })),

    // MOCK — série temporal exige histórico datado
    monthlyReturns: [
      { month: "Mar", tecnicas: 7, comerciais: 5 },
      { month: "Abr", tecnicas: 9, comerciais: 6 },
      { month: "Mai", tecnicas: 8, comerciais: 4 },
      { month: "Jun", tecnicas: 5, comerciais: 3 },
      { month: "Jul", tecnicas: 4, comerciais: 2 },
      { month: "Ago", tecnicas: 3, comerciais: 2 },
    ],
    monthlyNote: "Tendência de queda desde a adoção do ambiente por F4 e dos checkpoints.",

    outcome: [
      { id: "aprovadas", label: "Aprovadas", percent: 82 },
      { id: "andamento", label: "Em andamento", percent: 10 },
      { id: "reprovadas", label: "Reprovadas", percent: 8 },
    ],
  };
}
