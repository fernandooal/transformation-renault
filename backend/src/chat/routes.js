import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { chat, validateMessages } from "./chat.js";
import { requireAuth, requireRole } from "../auth/middleware.js";

export function chatRouter() {
  const router = Router();

  router.post("/", requireAuth, requireRole("Demo"), async (req, res) => {
    const validationError = validateMessages(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    try {
      const reply = await chat(req.body.messages);
      return res.json({ reply });
    } catch (error) {
      const missingKey = /authentication method|api key/i.test(error?.message ?? "");
      if (error instanceof Anthropic.AuthenticationError || missingKey) {
        console.error("ANTHROPIC_API_KEY inválida ou ausente.");
        return res.status(500).json({ error: "Chatbot indisponível no momento." });
      }
      if (error instanceof Anthropic.RateLimitError) {
        return res.status(429).json({ error: "Muitas requisições. Tente novamente em instantes." });
      }
      if (error instanceof Anthropic.APIConnectionError) {
        return res.status(502).json({ error: "Falha de conexão com o serviço de IA." });
      }
      console.error("Erro no chatbot:", error);
      return res.status(500).json({ error: "Erro interno no chatbot." });
    }
  });

  return router;
}
