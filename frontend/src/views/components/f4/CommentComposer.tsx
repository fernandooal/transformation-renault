import { useState } from "react";
import Button from "../ui/Button";
import { Icon } from "../icons";

export interface CommentComposerProps {
  onComment: (text: string) => void;
}

export default function CommentComposer({ onComment }: CommentComposerProps) {
  const [text, setText] = useState("");
  const empty = text.trim().length === 0;

  function send(action: (t: string) => void) {
    if (empty) return;
    action(text.trim());
    setText("");
  }

  return (
    <div className="composer">
      <label className="sr-only" htmlFor="composer-text">
        Comentário ou nota técnica
      </label>
      <textarea
        id="composer-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escreva um comentário ou uma nota técnica para esta etapa..."
      />
      <div className="composer__actions">
        <Button variant="ghost" size="sm" icon={<Icon name="attach" size={16} />} disabled>
          Anexar
        </Button>
        <Button
          className="composer__send"
          disabled={empty}
          onClick={() => send(onComment)}
        >
          Enviar
        </Button>
      </div>
    </div>
  );
}
