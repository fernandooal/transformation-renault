import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";

// Campos mock do F4 — a estrutura definitiva será definida com o time de Compras.
// Editar aqui é suficiente para mudar o formulário inteiro.
const SECTIONS = [
  {
    title: "Identificação",
    fields: [
      { name: "number", label: "Número do F4", placeholder: "F4-2026-0000" },
      { name: "title", label: "Título do contrato", required: true, span: 2 },
      {
        name: "contractType",
        label: "Tipo de contrato",
        type: "select",
        options: ["Compra de materiais", "Ferramental", "Serviço", "Aditivo", "Renovação"],
      },
      { name: "contract", label: "Contrato de referência", placeholder: "CT-2026-0000" },
      { name: "costCenter", label: "Centro de custo", placeholder: "CC-4471" },
      { name: "project", label: "Projeto / Veículo", placeholder: "Kardian Ph2" },
      { name: "plant", label: "Planta", type: "select", options: ["Curitiba (Ayrton Senna)", "São José dos Pinhais", "Cacia", "Valladolid", "Outra"] },
      { name: "issuedAt", label: "Data de emissão", type: "date" },
      { name: "deadline", label: "Prazo de conclusão", type: "date" },
    ],
  },
  {
    title: "Fornecedor",
    fields: [
      { name: "supplier", label: "Razão social", required: true, span: 2 },
      { name: "cnpj", label: "CNPJ", placeholder: "00.000.000/0001-00" },
      { name: "supplierCode", label: "Código do fornecedor", placeholder: "FRN-00921" },
      { name: "contactName", label: "Contato responsável" },
      { name: "contactEmail", label: "E-mail do contato", type: "email" },
      { name: "contactPhone", label: "Telefone", type: "tel" },
      { name: "country", label: "País", type: "select", options: ["Brasil", "Argentina", "França", "Espanha", "Romênia", "Marrocos"] },
    ],
  },
  {
    title: "Condições comerciais",
    fields: [
      { name: "value", label: "Valor total", type: "number", placeholder: "0,00" },
      { name: "currency", label: "Moeda", type: "select", options: ["BRL", "EUR", "USD"] },
      { name: "unitPrice", label: "Preço unitário", type: "number" },
      { name: "quantity", label: "Quantidade estimada", type: "number" },
      { name: "paymentTerms", label: "Condições de pagamento", type: "select", options: ["30 dias", "45 dias", "60 dias", "90 dias", "Contra entrega"] },
      { name: "incoterm", label: "Incoterm", type: "select", options: ["EXW", "FOB", "CIF", "DAP", "DDP"] },
      { name: "deliveryTerm", label: "Prazo de entrega (dias)", type: "number" },
      { name: "readjustment", label: "Índice de reajuste", type: "select", options: ["Nenhum", "IPCA", "IGP-M", "Fórmula paramétrica"] },
    ],
  },
  {
    title: "Escopo técnico",
    fields: [
      { name: "partNumber", label: "Código da peça", placeholder: "77 11 ..." },
      { name: "technicalNorm", label: "Norma técnica", placeholder: "NF R 10-xxx" },
      { name: "description", label: "Descrição do material / serviço", type: "textarea", span: 3 },
      { name: "qualityLevel", label: "Nível de qualidade", type: "select", options: ["Standard", "Crítico (SC)", "Segurança/Regulamentar"] },
      { name: "toolingOwner", label: "Propriedade do ferramental", type: "select", options: ["Renault", "Fornecedor", "Compartilhado"] },
      { name: "attachments", label: "Anexos", type: "file", multiple: true },
    ],
  },
  {
    title: "Governança e assinatura",
    fields: [
      { name: "buyer", label: "Comprador responsável" },
      { name: "approver", label: "Aprovador" },
      { name: "dependsOn", label: "Depende do F4", placeholder: "F4-2026-0091" },
      { name: "confidentiality", label: "Confidencialidade", type: "select", options: ["Interno", "Restrito", "Confidencial"] },
      { name: "signatureType", label: "Tipo de assinatura", type: "select", options: ["Assinatura digital (ICP-Brasil)", "Certificado digital A1", "Certificado digital A3", "Manual"] },
      { name: "notifyLate", label: "Notificar responsável se atrasar", type: "checkbox" },
      { name: "requiresSignature", label: "Exige assinatura digital", type: "checkbox" },
      { name: "notes", label: "Observações", type: "textarea", span: 3 },
    ],
  },
];

function Field({ field, value, onChange }) {
  const common = {
    id: field.name,
    name: field.name,
    required: field.required,
    placeholder: field.placeholder,
    onChange: (e) =>
      onChange(field.name, field.type === "checkbox" ? e.target.checked : e.target.value),
  };

  if (field.type === "checkbox") {
    return (
      <label className="field field-inline">
        <input type="checkbox" checked={!!value} {...common} />
        <span>{field.label}</span>
      </label>
    );
  }

  return (
    <label className={`field span-${field.span || 1}`} htmlFor={field.name}>
      <span>
        {field.label}
        {field.required && <b className="req"> *</b>}
      </span>
      {field.type === "select" ? (
        <select value={value || ""} {...common}>
          <option value="">Selecione...</option>
          {field.options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea rows={3} value={value || ""} {...common} />
      ) : field.type === "file" ? (
        <input type="file" multiple={field.multiple} {...common} onChange={undefined} />
      ) : (
        <input type={field.type || "text"} value={value || ""} {...common} />
      )}
    </label>
  );
}

export default function NewF4() {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api("/api/documents", { method: "POST", body: JSON.stringify(form) });
      navigate("/");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  /** Preenchimento assistido por IA — mock: sugere valores a partir do fornecedor. */
  function fillWithAI() {
    setForm((f) => ({
      ...f,
      number: f.number || "F4-2026-0117",
      title: f.title || "F4 — Fornecimento de conjunto estampado",
      supplier: f.supplier || "MetalSul Estamparia S.A.",
      cnpj: f.cnpj || "12.345.678/0001-90",
      contractType: f.contractType || "Compra de materiais",
      currency: f.currency || "BRL",
      paymentTerms: f.paymentTerms || "60 dias",
      incoterm: f.incoterm || "DAP",
      plant: f.plant || "Curitiba (Ayrton Senna)",
      country: f.country || "Brasil",
      qualityLevel: f.qualityLevel || "Crítico (SC)",
      confidentiality: f.confidentiality || "Restrito",
      signatureType: f.signatureType || "Assinatura digital (ICP-Brasil)",
      notifyLate: true,
      requiresSignature: true,
    }));
  }

  return (
    <div className="page">
      <header className="topbar">
        <Link to="/" className="ghost">
          ← Voltar
        </Link>
        <h1>
          Nova <span>F4</span>
        </h1>
        <button type="button" className="ghost" onClick={fillWithAI}>
          ✨ Preencher com IA
        </button>
      </header>

      <main className="form-page">
        <p className="muted">
          Campos de demonstração — a estrutura definitiva do F4 será ajustada com o time de
          Compras.
        </p>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {SECTIONS.map((section) => (
            <fieldset key={section.title}>
              <legend>{section.title}</legend>
              <div className="field-grid">
                {section.fields.map((field) => (
                  <Field
                    key={field.name}
                    field={field}
                    value={form[field.name]}
                    onChange={setField}
                  />
                ))}
              </div>
            </fieldset>
          ))}

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
