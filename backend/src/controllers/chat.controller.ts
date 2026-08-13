import type { Request, Response } from "express";
import { chat, ChatError } from "../services/gemini.service.ts";
import { validateMessages } from "../validators/chat.validator.ts";
import type { ChatMessage } from "../types/index.ts";

export async function send(req: Request, res: Response): Promise<Response> {
  const validationError = validateMessages(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const reply = await chat((req.body as { messages: ChatMessage[] }).messages);
    return res.json({ reply });
  } catch (error) {
    if (error instanceof ChatError) {
      console.error(`[chat] ${error.code}: ${error.message}`);
      switch (error.code) {
        case "missing_key":
        case "auth":
          return res.status(500).json({ error: "Chatbot indisponível no momento." });
        case "rate_limit":
          return res.status(429).json({ error: "Muitas requisições. Tente novamente em instantes." });
        default:
          return res.status(502).json({ error: "Falha de conexão com o serviço de IA." });
      }
    }
    console.error("Erro no chatbot:", error);
    return res.status(500).json({ error: "Erro interno no chatbot." });
  }
}
