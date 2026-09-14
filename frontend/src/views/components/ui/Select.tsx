import { useId } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../icons";
import type { FieldTone, FieldVariant } from "./TextField";

export interface SelectOption {
  value: string;
  label: string;
  group?: string;
}

export interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  tone?: FieldTone;
  variant?: FieldVariant;
  error?: string;
  required?: boolean;
  id?: string;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  tone = "light",
  variant = "stacked",
  error,
  required,
  id,
}: SelectProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const dark = tone === "onDark";
  const errorId = `${fieldId}-error`;

  const groups = options.reduce<Record<string, SelectOption[]>>((acc, opt) => {
    const key = opt.group ?? "";
    (acc[key] ??= []).push(opt);
    return acc;
  }, {});
  const grouped = Object.keys(groups).some((k) => k !== "");

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

      <span className={cx("control-wrap", dark && "control-wrap--onDark")}>
        <select
          id={fieldId}
          value={value}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={cx("control", dark && "control--onDark", error && "control--invalid")}
        >
          <option value="" disabled>
            {placeholder ?? label}
          </option>
          {grouped
            ? Object.entries(groups).map(([group, opts]) => (
                <optgroup key={group} label={group}>
                  {opts.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </optgroup>
              ))
            : options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
        </select>
        <span className="control-slot">
          <Icon name="chevronDown" size={20} />
        </span>
      </span>

      {error && (
        <span id={errorId} role="alert" className={cx("field-error", dark && "field-error--onDark")}>
          {error}
        </span>
      )}
    </div>
  );
}
