/**
 * Cargos e departamentos — os 7 da mentoria mais o Fornecedor.
 * Substitui o "Usuário Comum / Administrador" que aparecia no design:
 * decisão do cliente foi seguir a mentoria.
 */

export const DEPARTMENTS = ["Compras", "Engenharia", "Supply Chain"] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const RENAULT_ROLES = ["BUYER", "PPM", "RSPM", "PFE", "CVE", "IST", "CPSC"] as const;
export const ROLES = [...RENAULT_ROLES, "SUPPLIER"] as const;

export type RenaultRole = (typeof RENAULT_ROLES)[number];
export type Role = (typeof ROLES)[number];

export interface RoleMeta {
  id: Role;
  /** Sigla exibida em badge. */
  short: string;
  /** Nome por extenso, para o select de cadastro. */
  label: string;
  department: Department | null;
  description: string;
}

export const ROLE_META: Record<Role, RoleMeta> = {
  BUYER: {
    id: "BUYER",
    short: "Compr.",
    label: "Buyer — Comprador",
    department: "Compras",
    description: "Negocia o preço na revisão comercial. Aprova até a alçada definida.",
  },
  PPM: {
    id: "PPM",
    short: "PPM",
    label: "PPM — Project Purchasing Manager",
    department: "Compras",
    description: "Dono do projeto pelo lado comercial. Aprova acima da alçada do buyer.",
  },
  RSPM: {
    id: "RSPM",
    short: "RSPM",
    label: "RSPM — Regional Strategic Purchasing Manager",
    department: "Compras",
    description: "Supervisiona os buyers e acompanha as F4 deles. Somente visualização.",
  },
  PFE: {
    id: "PFE",
    short: "PFE",
    label: "PFE — Product Flow Engineer",
    department: "Engenharia",
    description: "Faz a revisão técnica. Vê apenas as próprias F4 e nunca cria uma.",
  },
  CVE: {
    id: "CVE",
    short: "CVE",
    label: "CVE — Cost and Value Engineering",
    department: "Engenharia",
    description: "Dono do projeto pela engenharia. Decide o que entra e sai do carro.",
  },
  IST: {
    id: "IST",
    short: "IST",
    label: "IST — Industrial Systems Technology",
    department: "Engenharia",
    description: "Coordena os PFEs e acompanha as F4 deles. Somente visualização.",
  },
  CPSC: {
    id: "CPSC",
    short: "CPSC",
    label: "CPSC — Central Planning & Supply Chain",
    department: "Supply Chain",
    description: "Acompanha as F4 do seu projeto pelo fluxo logístico.",
  },
  SUPPLIER: {
    id: "SUPPLIER",
    short: "Fornecedor",
    label: "Fornecedor",
    department: null,
    description: "Preenche e reenvia a F4. Único que enxerga o rascunho.",
  },
};

export const roleMeta = (r: Role): RoleMeta => ROLE_META[r];

/** Opções do select "tipo de usuário" no cadastro, agrupadas por departamento. */
export const ROLE_OPTIONS = ROLES.map((id) => ({
  value: id,
  label: ROLE_META[id].label,
  group: ROLE_META[id].department ?? "Externo",
}));
