import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../../utils/cx";

export type FieldTone = "light" | "onDark";
/** `inField` esconde o rótulo visualmente (autenticação); `stacked` mostra acima. */
export type FieldVariant = "inField" | "stacked";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  tone?: FieldTone;
  variant?: FieldVariant;
  error?: string;
  rightSlot?: ReactNode;
}

export default function TextField({
  label,
  value,
  onChange,
  tone = "light",
  variant = "stacked",
  error,
  rightSlot,
  id,
  className,
  required,
  ...rest
}: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const dark = tone === "onDark";
  const errorId = `${fieldId}-error`;

  const input = (
    <input
      id={fieldId}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      placeholder={variant === "inField" ? `${label}${required ? "*" : ""}` : rest.placeholder}
      className={cx("control", dark && "control--onDark", error && "control--invalid", className)}
      {...rest}
    />
  );

  return (
    <div className="field-group">
      <label
        htmlFor={fieldId}
        className={cx(
          variant === "inField" ? "sr-only" : "field-label",
          variant === "stacked" && dark && "field-label--onDark"
        )}
      >
        {label}
        {required ? "*" : ""}
      </label>

      {rightSlot ? (
        <span className={cx("control-wrap", dark && "control-wrap--onDark")}>
          {input}
          <span className="control-slot control-slot--interactive">{rightSlot}</span>
        </span>
      ) : (
        input
      )}

      {error && (
        <span id={errorId} role="alert" className={cx("field-error", dark && "field-error--onDark")}>
          {error}
        </span>
      )}
    </div>
  );
}
