import { useRef, useState } from "react";
import { api } from "../api.js";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  function scrollDown() {
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  }

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const history = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    setSending(true);
    scrollDown();

    try {
      // A API é stateless: o histórico completo vai a cada mensagem.
      const data = await api("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: history }),
      });
      setMessages([...history, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([
        ...history,
        { role: "assistant", content: `⚠️ ${err.message}`, isError: true },
      ]);
    } finally {
      setSending(false);
      scrollDown();
    }
  }

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="chatbot-panel">
          <header>Assistente Renault</header>
          <div className="chatbot-messages" ref={listRef}>
            {messages.length === 0 && (
              <p className="muted small">Olá! Sou o chatbot da Renault. Como posso ajudar no sistema?</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`bubble ${m.role} ${m.isError ? "is-error" : ""}`}
              >
                {m.content}
              </div>
            ))}
            {sending && <div className="bubble assistant muted">Digitando...</div>}
          </div>
          <form onSubmit={send} className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida..."
              maxLength={4000}
            />
            <button type="submit" disabled={sending || !input.trim()}>
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
}
