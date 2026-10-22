import * as Chat from "./chat.service";
import { buildReport } from "./mock/assistant.mock";
import { F4_DETAILS } from "./mock/f4.mock";
import type { AssistantInput, AssistantReport } from "../models/f4Assistant";

/**
 * Duas fontes para a mesma saída.
 *
 * `VITE_AI_ASSISTANT=live` manda o preenchimento atual e um resumo do histórico
 * de F4 para o modelo (via /api/chat, que já existe) e espera JSON de volta.
 * Qualquer outra coisa — inclusive a ausência da variável — usa o motor de
 * regras local, que não depende de chave nenhuma.
 *
 * Desligar a IA depois da gravação é trocar a variável de ambiente: nenhum
 * caminho de código precisa ser removido.
 */
const live = import.meta.env.VITE_AI_ASSISTANT === "live";

/** Resumo factual do histórico, para o modelo não inventar números. */
function datasetBriefing(): string {
  return F4_DETAILS.map(
    (f) =>
      `${f.code} | peça: ${f.part} | fornecedor: ${f.supplier.name} | projeto: ${f.project} | status: ${f.status} | voltas: ${f.returns} (téc ${f.technicalReturns}, com ${f.commercialReturns})`
  ).join("\n");
}

const SYSTEM = `Você é um assistente de preenchimento de F4 (termo de modificação de peça) da Renault Geely do Brasil.
Recebe o preenchimento parcial de uma F4 nova e o histórico de F4 anteriores.
Responda SOMENTE com JSON válido, sem cercas de código, neste formato:
{"level":"baixo|medio|alto","score":0-100,"headline":"uma frase","insights":[{"id":"slug","kind":"risco|precedente|sugestao","level":"baixo|medio|alto","title":"curto","body":"2 frases","field":"nome do campo ou omitido","suggestedValue":"valor ou omitido","sourceF4":{"id":1,"code":"F4 2024 - 0847"}}]}
Regras: no máximo 5 insights; cite apenas F4 que aparecem no histórico fornecido; não invente estatística; escreva em português do Brasil.`;

export async function analyze(input: AssistantInput): Promise<AssistantReport> {
  if (!live) return buildReport(input);

  const preenchido = Object.entries(input.form)
    .filter(([, v]) => v !== undefined && v !== "" && v !== false)
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join("\n");

  try {
    const reply = await Chat.send([
      {
        role: "user",
        content: `${SYSTEM}\n\n## Histórico de F4\n${datasetBriefing()}\n\n## F4 sendo preenchida\n${
          preenchido || "(ainda vazia)"
        }\nImpacto total informado: ${input.totalImpact}`,
      },
    ]);
    const json = reply.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(json) as AssistantReport;
    return { ...parsed, source: "modelo" };
  } catch {
    // sem chave, cota estourada ou JSON malformado: a tela continua útil
    return buildReport(input);
  }
}
