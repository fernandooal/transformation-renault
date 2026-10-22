import type { ChangeEvent } from "react";
import { str, type F4Field as Field, type FormState } from "../../models/f4Form";
import { Icon } from "./icons";

interface F4FieldProps {
  field: Field;
  form: FormState;
  onChange: (name: string, value: string | boolean) => void;
}

export default function F4Field({ field, form, onChange }: F4FieldProps) {
  const value = form[field.name];
  const span = `span-${field.span || 1}`;

  // Rótulo acima do campo; o asterisco de obrigatório é vermelho (var(--c-red-500)).
  const caption = (
    <>
      {field.label}
      {field.required && <b className="f4-field__req"> *</b>}
    </>
  );

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
      <label className="f4-field f4-field--inline span-3">
        <input type="checkbox" className="f4-check" checked={!!value} {...common} />
        <span className="f4-field__label">{caption}</span>
      </label>
    );
  }

  if (field.type === "yesno" || field.type === "radio") {
    const options = field.type === "yesno" ? ["Yes", "No"] : field.options ?? [];
    return (
      <div className={`f4-field ${span}`} role="radiogroup" aria-label={field.label}>
        <span className="f4-field__label">{caption}</span>
        <div className="f4-radio-row">
          {options.map((opt) => (
            <label key={opt} className="f4-radio">
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
      <div className="f4-field f4-impact span-3">
        <span className="f4-field__label">{caption}</span>
        <div className="f4-radio-row" role="radiogroup" aria-label={field.label}>
          {["Yes", "No"].map((opt) => (
            <label key={opt} className="f4-radio">
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
        <div className="f4-amount">
          <input
            type="number"
            className="f4-control"
            step="0.001"
            placeholder="0.000"
            aria-label={`${field.label} — valor`}
            disabled={form[flag] !== "Yes"}
            value={str(value)}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
          <span className="f4-amount__unit">{str(form.offerCurrency) || "EUR"}</span>
        </div>
      </div>
    );
  }

  return (
    <label className={`f4-field ${span}`} htmlFor={field.name}>
      <span className="f4-field__label">{caption}</span>
      {field.type === "select" ? (
        <span className="f4-control-wrap">
          <select className="f4-control f4-control--select" value={str(value)} {...common}>
            <option value="">Selecione...</option>
            {(field.options ?? []).map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <span className="f4-control__chevron">
            <Icon name="chevronDown" size={18} />
          </span>
        </span>
      ) : field.type === "textarea" ? (
        <textarea className="f4-control f4-textarea" rows={4} value={str(value)} {...common} />
      ) : (
        <input className="f4-control" type={field.type || "text"} value={str(value)} {...common} />
      )}
    </label>
  );
}
