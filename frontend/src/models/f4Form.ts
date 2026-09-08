export type FieldKind =
  | "text"
  | "date"
  | "number"
  | "radio"
  | "select"
  | "yesno"
  | "checkbox"
  | "textarea"
  | "impact";

export interface F4Field {
  name: string;
  label: string;
  type?: FieldKind;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  span?: number;
}

export interface F4Section {
  title: string;
  fields: F4Field[];
}

export type FormValue = string | boolean | undefined;
export type FormState = Record<string, FormValue>;

// Campos do formulário real "F4 sheet - Cost of Modification" (págs. 1 e 2).
// Editar SECTIONS é suficiente para alterar o formulário inteiro.
export const SECTIONS: F4Section[] = [
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
export const SET_ROWS = [
  "Project (hour)",
  "Design",
  "Industrialisation",
  "Validation costs",
  "Tooling fees",
  "Amortized tooling amount",
  "Others (anticipated production...)",
  "Additional quantities for VC...",
];

export const IMPACT_FIELDS = [
  "technicalPriceImpact",
  "toolingImpact",
  "entryTicketImpact",
  "massProdPdsImpact",
  "aftersalesPdsImpact",
  "packagingImpact",
];

export const AI_SUGGESTIONS: FormState = {
  scope: "PROJECT (inc. MY/Ph x) & Aftersales",
  titleOfModification: "Engine Harness routing update",
  ecoId: "234",
  modificationNumber: "2",
  renaultF4Manager: "PFE Renault",
  vehicles: "JFC, NFK, HJB",
  projectLeader: "JFC",
  description: "Engine Harness",
  originOfModification: "Renault request",
  crossDisciplinarity: "Mono-supplier",
  lupNumber: "Q00001234",
  causeOfModification: "Design evolution",
  setPaymentMode: "Cash or Instalments",
  lupCustomerQuality: "No",
  supplier: "Supplier Name",
  f4Version: "Rev 00",
  supplierF4Manager: "KAM Name",
  supplierPlant: "Curitiba plant",
  position: "Key Account Manager",
  supplierAccount: "123456-00",
  implementationLeadtime: "12 weeks after F4 signature",
  diversityAdded: "No",
  csrImpact: "No",
  estimatedDuration: "24 months",
};

export const slug = (label: string) => "set_" + label.replace(/[^a-zA-Z]/g, "").toLowerCase();
export const num = (v: FormValue) => Number(v) || 0;
export const str = (v: FormValue) => (typeof v === "string" ? v : "");
export const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
