import { useRef, useState, type FormEvent } from "react";
import * as ChatService from "../services/chat.service";
import type { ChatMessage } from "../models/index";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  function scrollDown() {
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  }

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const history: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    setSending(true);
    scrollDown();

    try {
      const reply = await ChatService.send(history);
      setMessages([...history, { role: "assistant", content: reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro no chatbot.";
      setMessages([...history, { role: "assistant", content: `⚠️ ${message}`, isError: true }]);
    } finally {
      setSending(false);
      scrollDown();
    }
  }

  return { messages, input, setInput, sending, listRef, send };
}
