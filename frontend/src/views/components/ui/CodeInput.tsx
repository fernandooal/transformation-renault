import { useRef } from "react";

export interface CodeInputProps {
  /** Um único string como valor — nunca N estados independentes. */
  value: string;
  onChange: (value: string) => void;
  length?: number;
  label?: string;
  autoFocus?: boolean;
}

export default function CodeInput({
  value,
  onChange,
  length = 4,
  label = "Código de verificação",
  autoFocus,
}: CodeInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(length, " ").slice(0, length).split("");

  const setAt = (index: number, digit: string) => {
    const next = digits.map((d, i) => (i === index ? digit : d)).join("").trimEnd();
    onChange(next.replace(/\s/g, ""));
  };

  const focus = (index: number) => refs.current[index]?.focus();

  return (
    <div className="code-input" role="group" aria-label={label}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={digits[i]?.trim() ?? ""}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          autoFocus={autoFocus && i === 0}
          aria-label={`Dígito ${i + 1} de ${length}`}
          onChange={(e) => {
            const digit = e.target.value.replace(/\D/g, "").slice(-1);
            if (!digit) return;
            setAt(i, digit);
            if (i < length - 1) focus(i + 1);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              e.preventDefault();
              if (digits[i]?.trim()) setAt(i, " ");
              else if (i > 0) {
                setAt(i - 1, " ");
                focus(i - 1);
              }
            }
            if (e.key === "ArrowLeft" && i > 0) focus(i - 1);
            if (e.key === "ArrowRight" && i < length - 1) focus(i + 1);
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            if (!pasted) return;
            onChange(pasted);
            focus(Math.min(pasted.length, length - 1));
          }}
        />
      ))}
    </div>
  );
}
