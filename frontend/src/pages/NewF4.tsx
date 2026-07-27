import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

type FieldKind =
  | "text"
  | "date"
  | "number"
  | "radio"
  | "select"
  | "yesno"
  | "checkbox"
  | "textarea"
  | "impact";

interface F4Field {
  name: string;
  label: string;
  type?: FieldKind;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  span?: number;
}

interface F4Section {
  title: string;
  fields: F4Field[];
}

type FormValue = string | boolean | undefined;
type FormState = Record<string, FormValue>;

// Campos baseados no formulário real "F4 sheet - Cost of Modification" (págs. 1 e 2).
// Editar SECTIONS é suficiente para alterar o formulário inteiro.
const SECTIONS: F4Section[] = [
  {
    title: "Escopo",
    fields: [
      {
        name: "scope",
        label: "Perímetro",
        type: "radio",
        options: ["PROJECT (inc. MY/Ph x) & Aftersales", "MASS PROD. (& Aftersales)"],
        span: 3,
      },
    ],
  },
  {
    title: "Informações Renault",
    fields: [
      { name: "titleOfModification", label: "Title of Modification", required: true, span: 3 },
      { name: "ecoId", label: "SCOPP Dev GAP ECO ID", placeholder: "234" },
      { name: "modificationNumber", label: "Modification number", placeholder: "2" },
      { name: "renaultF4Manager", label: "Renault F4 Manager", placeholder: "PFE Renault" },
      { name: "vehicles", label: "Vehicles / Organes", placeholder: "JFC, NFK, HJB" },
      { name: "projectLeader", label: "Project leader", placeholder: "JFC" },
      { name: "description", label: "Description", placeholder: "Engine Harness" },
      {
        name: "originOfModification",
        label: "Origin of modification",
        type: "select",
        options: [
          "Renault request",
          "Supplier request",
          "Regulatory",
          "Quality / Customer claim",
          "Cost reduction",
          "Obsolescence",
        ],
      },
      {
        name: "crossDisciplinarity",
        label: "F4 cross-disciplinarity",
        type: "select",
        options: ["Mono-supplier", "Multi-supplier", "Multi-perimeter", "Multi-project"],
      },
      { name: "lupNumber", label: "LUP Number", placeholder: "Q0000XXXXX" },
      {
        name: "causeOfModification",
        label: "Detail cause of modification",
        type: "select",
        options: [
          "Design evolution",
          "Process evolution",
          "Material change",
          "Supplier plant transfer",
          "Volume evolution",
          "Standard / norm update",
        ],
        span: 2,
      },
      {
        name: "setPaymentMode",
        label: "SET payment mode (RG request)",
        type: "select",
        options: ["Cash or Instalments", "Tolics"],
      },
      { name: "lupCustomerQuality", label: "LUP Customer Quality (QC)", type: "yesno" },
    ],
  },
  {
    title: "Informações do Fornecedor",
    fields: [
      { name: "supplier", label: "Corporate Name", required: true, span: 2 },
      { name: "f4Version", label: "F4 version", placeholder: "Rev 00" },
      { name: "supplierF4Manager", label: "Supplier F4 Manager", placeholder: "KAM Name" },
      { name: "supplierPlant", label: "Supplier Plant", placeholder: "City plant" },
      { name: "date", label: "Date", type: "date" },
      { name: "position", label: "Position", placeholder: "Key Account Manager" },
      { name: "supplierAccount", label: "Supplier Account", placeholder: "123456-00" },
      { name: "supplierAccountSet", label: "Supplier Account for SET order", placeholder: "123456-00" },
      {
        name: "implementationLeadtime",
        label: "Implementation Leadtime",
        placeholder: "12 weeks after F4 signature",
        span: 3,
      },
    ],
  },
  {
    title: "Description of the modification",
    fields: [
      {
        name: "modificationDetails",
        label: "Modification Details (short description)",
        type: "textarea",
        span: 3,
      },
      {
        name: "impactedRefs",
        label: "Impacted references (detalhamento na aba «Impacted refs»)",
        placeholder: "XXXXX",
        span: 2,
      },
      { name: "diversityAdded", label: "Diversity added with the modification?", type: "yesno" },
    ],
  },
  {
    title: "Economical Synthesis",
    fields: [
      { name: "offerCurrency", label: "Offer Currency", type: "select", options: ["EUR", "BRL", "USD"] },
      { name: "units", label: "Units", type: "select", options: ["Part", "Set", "Kg"] },
      {
        name: "multiCurrency",
        label: "Impacto em várias moedas para o preço da peça",
        type: "checkbox",
      },
      { name: "technicalPriceImpact", label: "Technical Price Impact (pág. 2 & Apêndice)", type: "impact" },
      { name: "toolingImpact", label: "Tooling Impact (OSF / não amortizado)", type: "impact" },
      { name: "entryTicketImpact", label: "Supplier Entry Ticket Impact", type: "impact" },
      { name: "massProdPdsImpact", label: "Mass Production PDS additional impact", type: "impact" },
      { name: "aftersalesPdsImpact", label: "Aftersales PDS additional impact", type: "impact" },
      { name: "packagingImpact", label: "Specific packaging total Cost impact", type: "impact" },
    ],
  },
  {
    title: "CSR Impact (pág. 2)",
    fields: [
      { name: "csrImpact", label: "CSR Impact", type: "yesno" },
      { name: "weightImpact", label: "Weight Impact (g)", type: "number", placeholder: "+/- XX" },
      { name: "refIdo", label: "Tooling Gap — Réf IDO" },
    ],
  },
  {
    title: "Part Price Gap Costbreakdown (pág. 2)",
    fields: [
      { name: "cbMaterial", label: "Material", type: "number" },
      { name: "cbDirectCost", label: "Direct Cost (labour force...)", type: "number" },
      { name: "cbUndirectCost", label: "Undirect Cost", type: "number" },
      { name: "cbGeneralFees", label: "General Fees + Margin", type: "number" },
      { name: "cbPackaging", label: "Packaging", type: "number" },
    ],
  },
  {
    title: "Amortização (pág. 2)",
    fields: [
      { name: "amortizationQty", label: "Amortization Quantity (Nb of PCS)", type: "number" },
      {
        name: "estimatedDuration",
        label: "Estimated Duration",
        type: "select",
        options: ["6 months", "12 months", "24 months", "36 months", "48 months"],
      },
      { name: "financialFees", label: "Financial Fees (%)", type: "number", placeholder: "XX" },
    ],
  },
];

// SET Gap Costbreakdown — TOTAL por linha é calculado (Quantity × Unit cost).
const SET_ROWS = [
  "Project (hour)",
  "Design",
  "Industrialisation",
  "Validation costs",
  "Tooling fees",
  "Amortized tooling amount",
  "Others (anticipated production...)",
  "Additional quantities for VC...",
];

const slug = (label: string) => "set_" + label.replace(/[^a-zA-Z]/g, "").toLowerCase();
const num = (v: FormValue) => Number(v) || 0;
const str = (v: FormValue) => (typeof v === "string" ? v : "");
const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

interface FieldProps {
  field: F4Field;
  form: FormState;
  onChange: (name: string, value: string | boolean) => void;
}

function Field({ field, form, onChange }: FieldProps) {
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

  // Linha de impacto: Yes/No + valor na moeda da oferta.
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

export default function NewF4() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ offerCurrency: "EUR", units: "Part" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setField = (name: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [name]: value }));

  const setTotal = useMemo(
    () =>
      SET_ROWS.reduce(
        (sum, row) => sum + num(form[`${slug(row)}_qty`]) * num(form[`${slug(row)}_unit`]),
        0
      ),
    [form]
  );

  // Impacto unitário na moeda da oferta, sem SET (apenas informativo).
  const totalImpact =
    num(form.technicalPriceImpact) +
    num(form.toolingImpact) +
    num(form.entryTicketImpact) +
    num(form.massProdPdsImpact) +
    num(form.aftersalesPdsImpact) +
    num(form.packagingImpact);
  const unitImpact = num(form.annualVolume) ? totalImpact / num(form.annualVolume) : 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api("/api/documents", {
        method: "POST",
        body: JSON.stringify({ ...form, setTotal, totalImpact, unitImpact }),
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
      setSaving(false);
    }
  }

  /** Preenchimento assistido por IA — mock: sugere valores a partir de F4s anteriores. */
  function fillWithAI() {
    setForm((f) => ({
      ...f,
      scope: f.scope || "PROJECT (inc. MY/Ph x) & Aftersales",
      titleOfModification: f.titleOfModification || "Engine Harness routing update",
      ecoId: f.ecoId || "234",
      modificationNumber: f.modificationNumber || "2",
      renaultF4Manager: f.renaultF4Manager || "PFE Renault",
      vehicles: f.vehicles || "JFC, NFK, HJB",
      projectLeader: f.projectLeader || "JFC",
      description: f.description || "Engine Harness",
      originOfModification: f.originOfModification || "Renault request",
      crossDisciplinarity: f.crossDisciplinarity || "Mono-supplier",
      lupNumber: f.lupNumber || "Q00001234",
      causeOfModification: f.causeOfModification || "Design evolution",
      setPaymentMode: f.setPaymentMode || "Cash or Instalments",
      lupCustomerQuality: f.lupCustomerQuality || "No",
      supplier: f.supplier || "Supplier Name",
      f4Version: f.f4Version || "Rev 00",
      supplierF4Manager: f.supplierF4Manager || "KAM Name",
      supplierPlant: f.supplierPlant || "Curitiba plant",
      position: f.position || "Key Account Manager",
      supplierAccount: f.supplierAccount || "123456-00",
      implementationLeadtime: f.implementationLeadtime || "12 weeks after F4 signature",
      diversityAdded: f.diversityAdded || "No",
      csrImpact: f.csrImpact || "No",
      estimatedDuration: f.estimatedDuration || "24 months",
    }));
  }

  return (
    <div className="page">
      <header className="topbar">
        <Link to="/" className="ghost">
          ← Voltar
        </Link>
        <h1>
          F4 sheet — <span>Cost of Modification</span>
        </h1>
        <button type="button" className="ghost" onClick={fillWithAI}>
          Preencher com IA
        </button>
      </header>

      <main className="form-page">
        <p className="muted small">
          RPIFDASIA20170007 — V251028 · RENAULT — CONFIDENTIAL C
        </p>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {SECTIONS.map((section) => (
            <fieldset key={section.title}>
              <legend>{section.title}</legend>
              <div className="field-grid">
                {section.fields.map((field) => (
                  <Field key={field.name} field={field} form={form} onChange={setField} />
                ))}
              </div>
            </fieldset>
          ))}

          <fieldset>
            <legend>SET Gap Costbreakdown (pág. 2)</legend>
            <table className="set-table">
              <thead>
                <tr>
                  <th>Sections</th>
                  <th>Quantity</th>
                  <th>Unit cost</th>
                  <th>TOTAL (Automatic)</th>
                </tr>
              </thead>
              <tbody>
                {SET_ROWS.map((row) => {
                  const key = slug(row);
                  const total = num(form[`${key}_qty`]) * num(form[`${key}_unit`]);
                  return (
                    <tr key={row}>
                      <td>{row}</td>
                      <td>
                        <input
                          type="number"
                          value={str(form[`${key}_qty`])}
                          onChange={(e) => setField(`${key}_qty`, e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.001"
                          value={str(form[`${key}_unit`])}
                          onChange={(e) => setField(`${key}_unit`, e.target.value)}
                        />
                      </td>
                      <td className="total-cell">{fmt(total)}</td>
                    </tr>
                  );
                })}
                <tr className="total-row">
                  <td colSpan={3}>TOTAL SET Amount Without Financial Fees (Automatic)</td>
                  <td className="total-cell">{fmt(setTotal)}</td>
                </tr>
              </tbody>
            </table>
          </fieldset>

          <fieldset>
            <legend>Total Impact</legend>
            <div className="field-grid">
              <label className="field" htmlFor="annualVolume">
                <span>
                  Average Full Year volume of units (12 months) — {str(form.units) || "Part"}/year
                </span>
                <input
                  id="annualVolume"
                  type="number"
                  value={str(form.annualVolume)}
                  onChange={(e) => setField("annualVolume", e.target.value)}
                />
              </label>
              <label className="field">
                <span>Total impact — {str(form.offerCurrency) || "EUR"}</span>
                <input readOnly value={fmt(totalImpact)} />
              </label>
              <label className="field">
                <span>
                  Unit impact w/o SET, for information only — {str(form.offerCurrency) || "EUR"}/
                  {str(form.units) || "Part"}
                </span>
                <input readOnly value={fmt(unitImpact)} />
              </label>
            </div>
          </fieldset>

          <div className="form-actions">
            <Link to="/" className="ghost button-like">
              Cancelar
            </Link>
            <button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Criar F4"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
