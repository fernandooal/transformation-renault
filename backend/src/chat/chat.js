// Integração com a API do Google Gemini via REST (fetch nativo do Node 18+).
// A chave nunca sai do backend: lida de GEMINI_API_KEY no ambiente.
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const MAX_TOKENS = 1024;

// O prompt de sistema fica escondido no servidor — o front não vê nem altera.
const SYSTEM_PROMPT = `Você é um chatbot da Renault, que deverá oferecer ajuda no sistema.
Responda sempre em português do Brasil, de forma breve e objetiva.
O sistema é o "Renault Transformation Day", plataforma de gestão da documentação F4
(termos contratuais de compra de materiais com terceiros).
Se a pergunta fugir do escopo do sistema, responda educadamente que só pode ajudar com o sistema.`;

/** Erro tipado para a rota mapear em respostas HTTP amigáveis. */
export class ChatError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code; // "missing_key" | "auth" | "rate_limit" | "upstream"
  }
}

/**
 * Envia o histórico de conversa para a LLM e retorna a resposta do assistente.
 *
 * @param {Array<{role: "user"|"assistant", content: string}>} messages
 * @returns {Promise<string>} texto da resposta
 */
export async function chat(messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ChatError("missing_key", "GEMINI_API_KEY não definida no ambiente.");
  }

  // Converte o formato do front (user/assistant) para o do Gemini (user/model).
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  let res;
  try {
    res = await fetch(`${API_BASE}/${MODEL}:generateContent`, {
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
    throw new ChatError("upstream", `Falha de conexão com o Gemini: ${err.message}`);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 401 || res.status === 403 || res.status === 400) {
      throw new ChatError("auth", `Chave/requisição rejeitada pelo Gemini (${res.status}): ${body.slice(0, 300)}`);
    }
    if (res.status === 429) {
      throw new ChatError("rate_limit", "Limite de requisições do Gemini atingido.");
    }
    throw new ChatError("upstream", `Erro do Gemini (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const reply = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();

  if (!reply) {
    throw new ChatError("upstream", "Resposta vazia do Gemini.");
  }
  return reply;
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
