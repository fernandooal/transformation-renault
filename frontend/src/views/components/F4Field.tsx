import type { ChangeEvent } from "react";
import { str, type F4Field as Field, type FormState } from "../../models/f4Form";

interface F4FieldProps {
  field: Field;
  form: FormState;
  onChange: (name: string, value: string | boolean) => void;
}

export default function F4Field({ field, form, onChange }: F4FieldProps) {
  const value = form[field.name];
  const common = {
    id: field.name,
    name: field.name,
    required: field.required,
    placeholder: field.placeholder,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange(
        field.name,
        field.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value
      ),
  };

  if (field.type === "checkbox") {
    return (
      <label className="field field-inline span-3">
        <input type="checkbox" checked={!!value} {...common} />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === "yesno" || field.type === "radio") {
    const options = field.type === "yesno" ? ["Yes", "No"] : field.options ?? [];
    return (
      <div className={`field span-${field.span || 1}`}>
        <span>{field.label}</span>
        <div className="radio-row">
          {options.map((opt) => (
            <label key={opt} className="radio">
              <input
                type="radio"
                name={field.name}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(field.name, opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "impact") {
    const flag = `${field.name}Flag`;
    return (
      <div className="field impact-row span-3">
        <span>{field.label}</span>
        <div className="radio-row">
          {["Yes", "No"].map((opt) => (
            <label key={opt} className="radio">
              <input
                type="radio"
                name={flag}
                checked={form[flag] === opt}
                onChange={() => onChange(flag, opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
        <div className="amount">
          <input
            type="number"
            step="0.001"
            placeholder="0.000"
            disabled={form[flag] !== "Yes"}
            value={str(value)}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
          <span className="muted small">{str(form.offerCurrency) || "EUR"}</span>
        </div>
      </div>
    );
  }

  return (
    <label className={`field span-${field.span || 1}`} htmlFor={field.name}>
      <span>
        {field.label}
        {field.required && <b className="req"> *</b>}
      </span>
      {field.type === "select" ? (
        <select value={str(value)} {...common}>
          <option value="">Selecione...</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea rows={3} value={str(value)} {...common} />
      ) : (
        <input type={field.type || "text"} value={str(value)} {...common} />
      )}
    </label>
  );
}
