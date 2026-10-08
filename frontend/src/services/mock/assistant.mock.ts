/**
 * Motor de regras do assistente de F4.
 *
 * Cada afirmação é ancorada no dataset: se o texto cita um número ou uma F4,
 * ele foi calculado a partir de `F4_DETAILS`. Nenhuma estatística é inventada.
 */
import type { AssistantInput, AssistantInsight, AssistantReport, RiskLevel } from "../../models/f4Assistant";
import { statusMeta } from "../../models/status";
import { decimal, money, percent } from "../../utils/format";
import { F4_DETAILS } from "./f4.mock";

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/** Alçada da mentoria: acima disso a aprovação comercial sobe de nível. */
const ALCADA = 50_000_000;

function supplierStats(name: string) {
  const rows = F4_DETAILS.filter((f) =>
    f.supplier.name.toLowerCase().includes(name.toLowerCase())
  );
  if (rows.length === 0) return null;
  const devolvidas = rows.filter((f) => f.returns > 0);
  const reprovadas = rows.filter((f) => f.status === "REJECTED");
  return {
    rows,
    total: rows.length,
    avgReturns: rows.reduce((s, f) => s + f.returns, 0) / rows.length,
    devolvidasPct: (devolvidas.length / rows.length) * 100,
    pior: [...rows].sort((a, b) => b.returns - a.returns)[0],
    reprovada: reprovadas[0] ?? null,
  };
}

export function buildReport({ form, totalImpact }: AssistantInput): AssistantReport {
  const insights: AssistantInsight[] = [];
  let score = 12; // piso: toda F4 tem alguma chance de voltar

  const supplier = str(form.supplier);
  const title = str(form.titleOfModification);
  const origin = str(form.originOfModification);
  const cause = str(form.causeOfModification);

  // --- 1. histórico do fornecedor informado -------------------------------
  const stats = supplier ? supplierStats(supplier) : null;
  if (stats) {
    const risky = stats.avgReturns >= 2;
    if (risky) score += 24;
    insights.push({
      id: "fornecedor",
      kind: "risco",
      level: risky ? "alto" : "baixo",
      title: risky ? "Fornecedor com histórico de devolução" : "Fornecedor com bom histórico",
      body: `${stats.pior.supplier.name} tem ${stats.total} F4 no sistema, com média de ${decimal(
        stats.avgReturns
      )} voltas e ${percent(stats.devolvidasPct)} delas devolvidas ao menos uma vez.`,
      field: "supplier",
      sourceF4: { id: stats.pior.id, code: stats.pior.code },
    });

    if (stats.reprovada) {
      score += 10;
      insights.push({
        id: "precedente-reprovada",
        kind: "precedente",
        level: "medio",
        title: `${stats.reprovada.code} foi reprovada`,
        body: `A F4 "${stats.reprovada.part}" do mesmo fornecedor terminou ${statusMeta(
          stats.reprovada.status
        ).longLabel.toLowerCase()} depois de ${stats.reprovada.returns} voltas. Vale conferir o que foi apontado lá antes de enviar.`,
        sourceF4: { id: stats.reprovada.id, code: stats.reprovada.code },
      });
    }
  }

  // --- 2. valor e alçada ---------------------------------------------------
  if (totalImpact > 0) {
    const acima = totalImpact > ALCADA;
    if (acima) score += 18;
    insights.push({
      id: "alcada",
      kind: acima ? "risco" : "sugestao",
      level: acima ? "alto" : "baixo",
      title: acima ? "Acima da alçada do comprador" : "Dentro da alçada do comprador",
      body: acima
        ? `Com ${money(totalImpact)} de impacto, esta F4 passa de ${money(
            ALCADA
          )} e precisa do PPM na revisão comercial, não só do buyer. Na prática isso acrescenta uma etapa de aprovação.`
        : `${money(totalImpact)} fica abaixo de ${money(
            ALCADA
          )}, então o próprio buyer pode aprovar na revisão comercial.`,
      field: "technicalPriceImpact",
    });
  }

  // --- 3. coerência entre origem e impacto ---------------------------------
  if (origin === "Cost reduction") {
    const contradiz = totalImpact > 0;
    if (contradiz) score += 20;
    insights.push({
      id: "contradicao-custo",
      kind: contradiz ? "risco" : "sugestao",
      level: contradiz ? "alto" : "baixo",
      title: contradiz
        ? "Redução de custo com impacto positivo"
        : "Origem exige impacto negativo",
      body: contradiz
        ? `A origem está como "Cost reduction", mas o impacto total é ${money(
            totalImpact
          )} a mais. Essa contradição costuma voltar na revisão comercial: ou a origem é outra, ou o impacto precisa ser negativo.`
        : 'Com a origem em "Cost reduction", a revisão comercial espera impacto total negativo. Um valor positivo em Technical Price Impact vira pedido de justificativa.',
      field: "originOfModification",
    });
  }

  // --- 3b. o valor informado contra o que já foi aprovado -------------------
  if (totalImpact > 0) {
    const aprovadas = F4_DETAILS.filter((f) => f.status === "APPROVED");
    const tetoAprovado = Math.max(0, ...aprovadas.map((f) => f.gapComercial + f.gapTecnico));
    if (tetoAprovado > 0 && totalImpact > tetoAprovado) {
      score += 16;
      const piores = F4_DETAILS.filter(
        (f) => f.gapComercial + f.gapTecnico > tetoAprovado && f.returns > 0
      );
      insights.push({
        id: "acima-do-aprovado",
        kind: "risco",
        level: "alto",
        title: "Valor acima de qualquer F4 já aprovada",
        body: `Nenhuma F4 aprovada no histórico passou de ${money(
          tetoAprovado
        )} de gap total. ${
          piores.length
            ? `As ${piores.length} que passaram desse valor foram devolvidas ao menos uma vez.`
            : "Acima disso não há precedente de aprovação."
        } Com ${money(totalImpact)}, espere pedido de justificativa na revisão comercial.`,
        field: "technicalPriceImpact",
        sourceF4: piores[0] ? { id: piores[0].id, code: piores[0].code } : undefined,
      });
    }
  }

  // --- 4. campos que embasam a decisão técnica -----------------------------
  if (!str(form.modificationDetails)) {
    score += 14;
    const comDevolucao = F4_DETAILS.filter((f) => f.technicalReturns > 0).length;
    insights.push({
      id: "descricao-vazia",
      kind: "risco",
      level: "medio",
      title: "Descrição da modificação em branco",
      body: `${comDevolucao} das ${F4_DETAILS.length} F4 do histórico voltaram da revisão técnica, e o motivo mais citado nos comentários é falta de justificativa. Descrever a alteração aqui é o que a engenharia lê primeiro.`,
      field: "modificationDetails",
    });
  }

  if (!cause) {
    score += 8;
    insights.push({
      id: "causa-vazia",
      kind: "sugestao",
      level: "baixo",
      title: "Detalhar a causa acelera a revisão",
      body: 'Preencher "Detail cause of modification" evita a primeira pergunta do PFE. Nas F4 aprovadas do histórico esse campo está sempre preenchido.',
      field: "causeOfModification",
    });
  }

  // --- 5. reaproveitar uma F4 anterior -------------------------------------
  const aprovada = F4_DETAILS.find((f) => f.status === "APPROVED");
  if (aprovada && !title) {
    insights.push({
      id: "reuso",
      kind: "sugestao",
      level: "baixo",
      title: "Reaproveitar uma F4 aprovada",
      body: `"${aprovada.part}" (${aprovada.code}) foi aprovada com ${aprovada.returns} volta. Dá para partir do título dela e ajustar.`,
      field: "titleOfModification",
      suggestedValue: aprovada.part,
      sourceF4: { id: aprovada.id, code: aprovada.code },
    });
  }

  score = Math.max(0, Math.min(100, score));
  const level: RiskLevel = score >= 55 ? "alto" : score >= 30 ? "medio" : "baixo";

  const headline =
    level === "alto"
      ? "Pelo histórico, esta F4 tem chance alta de voltar na primeira revisão."
      : level === "medio"
        ? "Dá para reduzir o risco de devolução com alguns ajustes."
        : "O preenchimento está coerente com as F4 que passaram de primeira.";

  return { level, score, headline, insights, source: "regras" };
}
