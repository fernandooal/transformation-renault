import { api } from "./http";
import type { ChatMessage } from "../models/index";

// A API é stateless: o histórico completo vai a cada mensagem.
export async function send(history: ChatMessage[]): Promise<string> {
  const data = await api<{ reply: string }>("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
  });
  return data.reply;
}
