import type { ChatMessage } from "../types/index.ts";

const MAX_CONTENT_LENGTH = 4000;

export function validateMessages(body: unknown): string | null {
  const messages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return "O corpo deve conter um array 'messages' não vazio.";
  }
  for (const m of messages as Array<Partial<ChatMessage> | null>) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) {
      return "Cada mensagem precisa de role 'user' ou 'assistant'.";
    }
    if (typeof m.content !== "string" || m.content.trim() === "") {
      return "Cada mensagem precisa de um 'content' em texto, não vazio.";
    }
    if (m.content.length > MAX_CONTENT_LENGTH) {
      return `Mensagem muito longa (máximo ${MAX_CONTENT_LENGTH} caracteres).`;
    }
  }
  if ((messages[messages.length - 1] as ChatMessage).role !== "user") {
    return "A última mensagem deve ser do usuário.";
  }
  return null;
}
