import { useState } from "react";
import { useChat } from "../../controllers/useChat";
import { Button } from "./ui";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const { messages, input, setInput, sending, listRef, send } = useChat();

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
            <Button type="submit" size="sm" disabled={sending || !input.trim()}>
              Enviar
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
