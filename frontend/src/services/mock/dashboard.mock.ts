/**
 * Números do dashboard, derivados do dataset de F4.
 *
 * Antes quase tudo era semente fixa. Com o filtro por projeto, fornecedor e
 * peça, os números precisam reagir — então o que dá para calcular a partir do
 * dataset passou a ser calculado de verdade: filas por etapa, voltas por mês,
 * resultado, ciclo médio e tempo até aprovar saem do histórico datado de cada
 * F4. O que continua semeado está marcado com `// SEMENTE`.
 */
import type {
  DashboardFilter,
  DashboardOverview,
  MonthlyReturns,
  StageQueue,
} from "../../models/dashboard";
import type { F4Detail } from "../../models/f4";
import { decimal, int, percent } from "../../utils/format";
import { F4_DETAILS } from "./f4.mock";

const ACTIVE = ["TECH_REVIEW", "COMMERCIAL_REVIEW", "FINAL_REVIEW", "IN_REWORK"];
const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/** Código do projeto: "U79 Oroch" -> "U79". */
const codeOf = (project: string): string => project.split(" ")[0];

function matches(f4: F4Detail, filter: DashboardFilter): boolean {
  if (filter.project && codeOf(f4.project) !== filter.project) return false;
  if (filter.supplier && f4.supplier.name !== filter.supplier) return false;
  const q = filter.query.trim().toLowerCase();
  if (q && !`${f4.part} ${f4.code} ${f4.partNumber}`.toLowerCase().includes(q)) return false;
  return true;
}

/** Dias entre o primeiro e o último evento do histórico. */
function cycleDays(f4: F4Detail): number | null {
  if (f4.history.length < 2) return null;
  const times = f4.history.map((h) => new Date(h.at).getTime()).sort((a, b) => a - b);
  return (times[times.length - 1] - times[0]) / 86_400_000;
}

function average(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

/** Em que fila a F4 está parada hoje. */
function queueOf(f4: F4Detail): StageQueue["stage"] | null {
  switch (f4.status) {
    case "DRAFT":
    case "IN_REWORK":
    case "REJECTED":
      return "fornecedor";
    case "TECH_REVIEW":
      return "pfe";
    case "COMMERCIAL_REVIEW":
      return "comprador";
    case "FINAL_REVIEW":
    case "APPROVED":
      return "aprovador";
    default:
      return null;
  }
}

function buildQueues(rows: F4Detail[]): StageQueue[] {
  const base: StageQueue[] = [
    { stage: "fornecedor", label: "Forn.", emAnalise: 0, devolvida: 0, aprovada: 0 },
    { stage: "pfe", label: "PFE", emAnalise: 0, devolvida: 0, aprovada: 0 },
    { stage: "comprador", label: "Compr.", emAnalise: 0, devolvida: 0, aprovada: 0 },
    { stage: "aprovador", label: "Aprov.", emAnalise: 0, devolvida: 0, aprovada: 0 },
  ];
  for (const f4 of rows) {
    const stage = queueOf(f4);
    if (!stage) continue;
    const slot = base.find((b) => b.stage === stage)!;
    if (f4.status === "APPROVED") slot.aprovada += 1;
    else if (f4.returns > 0) slot.devolvida += 1;
    else slot.emAnalise += 1;
  }
  return base;
}

/** Devoluções por mês, lidas dos eventos de devolução do histórico. */
function buildMonthly(rows: F4Detail[]): MonthlyReturns[] {
  const now = new Date();
  const buckets: MonthlyReturns[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ month: MONTHS[d.getMonth()], tecnicas: 0, comerciais: 0 });
  }
  const firstMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1).getTime();

  for (const f4 of rows) {
    for (const entry of f4.history) {
      if (entry.kind !== "return") continue;
      const at = new Date(entry.at);
      if (at.getTime() < firstMonth) continue;
      const idx = buckets.findIndex((b) => b.month === MONTHS[at.getMonth()]);
      if (idx < 0) continue;
      // o cargo de quem devolveu separa técnica de comercial
      const commercial = entry.author.role === "BUYER" || entry.author.role === "PPM";
      if (commercial) buckets[idx].comerciais += 1;
      else buckets[idx].tecnicas += 1;
    }
  }
  return buckets;
}

export function buildOverview(filter: DashboardFilter): DashboardOverview {
  const rows = F4_DETAILS.filter((f) => matches(f, filter));

  const active = rows.filter((f) => ACTIVE.includes(f.status));
  const withReturns = rows.filter((f) => f.returns > 0);
  const approved = rows.filter((f) => f.status === "APPROVED");
  const rejected = rows.filter((f) => f.status === "REJECTED");
  const closed = approved.length + rejected.length;

  const avgReturns = average(withReturns.map((f) => f.returns));
  const cycle = average(rows.map(cycleDays).filter((d): d is number => d !== null));
  const timeToApprove = average(approved.map(cycleDays).filter((d): d is number => d !== null));
  const waiting = rows.filter((f) =>
    ["TECH_REVIEW", "COMMERCIAL_REVIEW", "FINAL_REVIEW"].includes(f.status)
  );
  const stale = waiting.filter((f) => (Date.now() - new Date(f.updatedAt).getTime()) > 48 * 3600_000);

  const total = rows.length || 1;
  const inProgress = rows.length - closed;

  return {
    kpis: [
      {
        id: "ativas",
        label: "F4's Ativas",
        value: int(active.length),
        icon: "docsStack",
        delta: { text: `de ${int(rows.length)} no recorte`, tone: "neutral" },
      },
      {
        id: "vaievolta",
        label: "Em vai e volta",
        value: int(withReturns.length),
        icon: "arrowsUpDown",
        delta: { text: `média de ${decimal(avgReturns)} voltas`, tone: "neutral" },
      },
      {
        id: "ciclo",
        label: "Ciclo médio (dias)",
        value: decimal(cycle),
        icon: "clockRotate",
        delta: { text: "do 1º ao último evento", tone: "neutral" },
      },
      {
        id: "aguardando",
        label: "Aguardando ação",
        value: int(waiting.length),
        icon: "alarm",
        delta: {
          text: stale.length ? `${int(stale.length)} há mais de 48h` : "nada parado há 48h",
          tone: stale.length ? "negative" : "positive",
        },
      },
    ],

    myKpis: [
      {
        id: "total",
        label: "Total no período",
        value: int(rows.length),
        icon: "docsStack",
        delta: { text: "F4's no recorte", tone: "neutral" },
      },
      {
        id: "voltas",
        label: "Voltas por F4",
        value: decimal(average(rows.map((f) => f.returns))),
        icon: "arrowsUpDown",
        delta: { text: `${int(withReturns.length)} com devolução`, tone: "neutral" },
      },
      {
        id: "aprovacao",
        label: "Taxa de Aprovação",
        value: percent(closed ? (approved.length / closed) * 100 : 0),
        delta: {
          text: closed ? `${int(closed)} encerradas` : "nenhuma encerrada",
          tone: "neutral",
        },
      },
      {
        id: "tempo",
        label: "Tempo até aprovar (dias)",
        value: decimal(timeToApprove),
        icon: "alarm",
        delta: {
          text: approved.length ? `${int(approved.length)} aprovadas` : "sem aprovações",
          tone: approved.length ? "positive" : "neutral",
        },
      },
    ],

    queues: buildQueues(rows),
    queuesNote:
      "A barra mostra onde cada F4 está parada agora. Devolvida é a que já voltou ao menos uma vez — é a fila que o histórico por F4 ajuda a encurtar.",

    attention: rows
      .filter((f) => f.returns > 0 && f.status !== "APPROVED" && f.status !== "CANCELLED")
      .sort((a, b) => b.returns - a.returns)
      .slice(0, 4)
      .map((f) => ({
        id: f.id,
        code: f.code.replace(/\s/g, "").replace("F4", "F4-"),
        part: f.part,
        reason: `Fornecedor reenviou ${f.version} — ${f.returns} ${f.returns === 1 ? "volta" : "voltas"} até aqui`,
        status: f.status,
        stalledHours: Math.max(
          48,
          Math.round((Date.now() - new Date(f.updatedAt).getTime()) / 3600_000)
        ),
      })),

    monthlyReturns: buildMonthly(rows),
    monthlyNote: "Devoluções registradas no histórico de cada F4, separadas por quem devolveu.",

    outcome: [
      { id: "aprovadas", label: "Aprovadas", percent: (approved.length / total) * 100 },
      { id: "andamento", label: "Em andamento", percent: (inProgress / total) * 100 },
      { id: "reprovadas", label: "Reprovadas", percent: (rejected.length / total) * 100 },
    ],

    matched: rows.length,
    options: {
      projects: [...new Set(F4_DETAILS.map((f) => codeOf(f.project)))]
        .sort()
        .map((code) => ({
          value: code,
          label: F4_DETAILS.find((f) => codeOf(f.project) === code)!.project,
        })),
      suppliers: [...new Set(F4_DETAILS.map((f) => f.supplier.name))]
        .sort()
        .map((name) => ({ value: name, label: name })),
    },
  };
}
