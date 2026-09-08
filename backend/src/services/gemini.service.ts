import config from "../config/index.ts";
import type { ChatMessage } from "../types/index.ts";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MAX_TOKENS = 1024;

// Fica no servidor: o front não vê nem altera o prompt de sistema.
const SYSTEM_PROMPT = `Você é um chatbot da Renault, que deverá oferecer ajuda no sistema.
Responda sempre em português do Brasil, de forma breve e objetiva.
O sistema é o "Renault Transformation Day", plataforma de gestão da documentação F4
(termos contratuais de compra de materiais com terceiros).
Se a pergunta fugir do escopo do sistema, responda educadamente que só pode ajudar com o sistema.`;

export type ChatErrorCode = "missing_key" | "auth" | "rate_limit" | "upstream";

export class ChatError extends Error {
  code: ChatErrorCode;

  constructor(code: ChatErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
}

export async function chat(messages: ChatMessage[]): Promise<string> {
  const apiKey = config.gemini.apiKey;
  if (!apiKey) {
    throw new ChatError("missing_key", "GEMINI_API_KEY não definida no ambiente.");
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/${config.gemini.model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { maxOutputTokens: MAX_TOKENS },
      }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ChatError("upstream", `Falha de conexão com o Gemini: ${message}`);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 401 || res.status === 403 || res.status === 400) {
      throw new ChatError(
        "auth",
        `Chave/requisição rejeitada pelo Gemini (${res.status}): ${body.slice(0, 300)}`
      );
    }
    if (res.status === 429) {
      throw new ChatError("rate_limit", "Limite de requisições do Gemini atingido.");
    }
    throw new ChatError("upstream", `Erro do Gemini (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as GeminiResponse;
  const reply = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();

  if (!reply) {
    throw new ChatError("upstream", "Resposta vazia do Gemini.");
  }
  return reply;
}
