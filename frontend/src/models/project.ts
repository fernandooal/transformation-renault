/**
 * Domínio de Projeto.
 *
 * O projeto é o guarda-chuva das F4: a lista mostra os KPIs agregados de cada
 * veículo e o detalhe reaproveita a tabela de "Todas as F4's" filtrada pelo
 * código do projeto.
 *
 * Os cargos e seus departamentos NÃO são redigitados aqui — vêm de
 * `models/roles.ts` (ROLE_META), que é o ponto único de verdade.
 */
import type { Department, RenaultRole } from "./roles";
import { ROLE_META } from "./roles";
import type { Tone } from "./status";

/** Os quatro tiles do card de projeto, na ordem do design. */
export interface ProjectKpis {
  /** "F4's Ativas" — contagem absoluta. */
  activeF4: number;
  /** "Voltas (média)" — devoluções médias por F4. */
  avgReturns: number;
  /** "Aprovadas" — percentual das F4 do projeto já aprovadas. */
  approvedPct: number;
  /** "Diferença $" — desvio percentual contra o target de custo. */
  costDeltaPct: number;
}

export interface ProjectSummary {
  /** Código do veículo ("R1312"). É também o `:id` da rota. */
  code: string;
  /** Nome comercial ("Boreal"). */
  name: string;
  kpis: ProjectKpis;
}

/** As três ações da matriz de permissões, na ordem do design. */
export const PERMISSION_ACTIONS = [
  { id: "view", label: "Visualizar" },
  { id: "comment", label: "Comentar" },
  { id: "approve", label: "Aprovar" },
] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number]["id"];

/** Uma linha de "Permissões por Papel". */
export interface RolePermission {
  role: RenaultRole;
  /** Quantas pessoas ocupam o cargo neste projeto. */
  people: number;
  grants: Record<PermissionAction, boolean>;
}

/**
 * Departamento do cargo. Os 7 cargos da mentoria sempre têm departamento
 * (só SUPPLIER é null), e SUPPLIER não entra na matriz de permissões.
 */
export function departmentOf(role: RenaultRole): Department {
  return ROLE_META[role].department as Department;
}

/** "Buyer — Comprador" -> "Buyer"; "PFE — Product Flow Engineer" -> "PFE". */
export function roleDisplayName(role: RenaultRole): string {
  return ROLE_META[role].label.split("—")[0].trim();
}

/**
 * Chip de departamento por área, conforme o design:
 * Compras laranja, Engenharia azul, Supply Chain roxo. Os pares de cor já
 * existem no Badge como tons.
 */
const DEPARTMENT_TONE: Record<Department, Tone> = {
  Compras: "orange",
  Engenharia: "blue",
  "Supply Chain": "purple",
};

export const departmentTone = (d: Department): Tone => DEPARTMENT_TONE[d];

/** Aplica um toggle da matriz sem mutar a lista recebida. */
export function setGrant(
  rows: RolePermission[],
  role: RenaultRole,
  action: PermissionAction,
  value: boolean
): RolePermission[] {
  return rows.map((r) =>
    r.role === role ? { ...r, grants: { ...r.grants, [action]: value } } : r
  );
}
