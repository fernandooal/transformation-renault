import { useId } from "react";
import { cx } from "../../../utils/cx";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Obrigatório: não há texto visível ao lado do controle. */
  label: string;
  disabled?: boolean;
}

/** Interruptor da matriz de permissões: cinza desligado, verde ligado. */
export default function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  const id = useId();
  return (
    <span className={cx("toggle", checked && "is-on", disabled && "is-disabled")}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
    </span>
  );
}
