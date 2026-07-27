import { Router } from "express";
import { chat, validateMessages, ChatError } from "./chat.js";
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
  });

  return router;
}
