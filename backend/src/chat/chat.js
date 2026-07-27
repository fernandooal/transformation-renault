import Anthropic from "@anthropic-ai/sdk";

// A chave nunca sai do backend: o SDK lê ANTHROPIC_API_KEY do ambiente.
const client = new Anthropic();

const MODEL = "claude-opus-5";
const MAX_TOKENS = 1024;

// O prompt de sistema fica escondido no servidor — o front não vê nem altera.
const SYSTEM_PROMPT = `Você é um chatbot da Renault, que deverá oferecer ajuda no sistema.
Responda sempre em português do Brasil, de forma breve e objetiva.
O sistema é o "Renault Transformation Day", plataforma de gestão da documentação F4
(termos contratuais de compra de materiais com terceiros).
Se a pergunta fugir do escopo do sistema, responda educadamente que só pode ajudar com o sistema.`;

/**
 * Envia o histórico de conversa para a LLM e retorna a resposta do assistente.
 *
 * @param {Array<{role: "user"|"assistant", content: string}>} messages
 * @returns {Promise<string>} texto da resposta
 */
export async function chat(messages) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages,
  });

  return response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
}

/** Valida o corpo recebido do front antes de repassar à LLM. */
export function validateMessages(body) {
  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return "O corpo deve conter um array 'messages' não vazio.";
  }
  for (const m of messages) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) {
      return "Cada mensagem precisa de role 'user' ou 'assistant'.";
    }
    if (typeof m.content !== "string" || m.content.trim() === "") {
      return "Cada mensagem precisa de um 'content' em texto, não vazio.";
    }
    if (m.content.length > 4000) {
      return "Mensagem muito longa (máximo 4000 caracteres).";
    }
  }
  if (messages[messages.length - 1].role !== "user") {
    return "A última mensagem deve ser do usuário.";
  }
  return null;
}
