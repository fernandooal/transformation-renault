/**
 * Dataset da DEMO para Projetos.
 *
 * O backend ainda não tem /api/projects — nem projetos, nem matriz de
 * permissões. Enquanto não tiver, este arquivo responde. Os seis projetos são
 * os da mentoria; os três que aparecem no design (R1312, U79, HJD) vêm
 * primeiro.
 *
 * As F4 de cada projeto NÃO são inventadas aqui: saem de `f4.mock`, pelo campo
 * `project` do seed ("R1312 Boreal"), para que clicar numa linha caia numa F4
 * que existe de verdade em /f4/:id.
 */
import { F4_DETAILS } from "./f4.mock";
import type { F4Summary } from "../../models/f4";
import type { ProjectSummary, RolePermission } from "../../models/project";

/**
 * KPIs semeados, não derivados das F4 do mock: o dataset de F4 tem 10 linhas no
 * total e o design pede números de projeto real (42 F4 ativas). R1312 carrega
 * exatamente os valores do design; os outros variam para a lista não parecer
 * um card repetido. Quando a API existir, isto vira um agregado de verdade.
 */
export const PROJECTS: ProjectSummary[] = [
  { code: "R1312", name: "Boreal", kpis: { activeF4: 42, avgReturns: 5, approvedPct: 15, costDeltaPct: -3 } },
  { code: "U79", name: "Oroch", kpis: { activeF4: 31, avgReturns: 4, approvedPct: 22, costDeltaPct: -1 } },
  { code: "HJD", name: "Duster", kpis: { activeF4: 27, avgReturns: 3, approvedPct: 38, costDeltaPct: 2 } },
  { code: "X62", name: "Master", kpis: { activeF4: 19, avgReturns: 6, approvedPct: 11, costDeltaPct: -5 } },
  { code: "HJF", name: "Kardian", kpis: { activeF4: 24, avgReturns: 2, approvedPct: 41, costDeltaPct: 1 } },
  { code: "BBB", name: "Kwid", kpis: { activeF4: 12, avgReturns: 4, approvedPct: 29, costDeltaPct: -2 } },
];

export const findProject = (code: string): ProjectSummary | null =>
  PROJECTS.find((p) => p.code.toLowerCase() === code.toLowerCase()) ?? null;

/** "R1312 Boreal" -> "R1312" */
const codeOf = (project: string): string => project.split(" ")[0];

export const f4sOfProject = (code: string): F4Summary[] =>
  F4_DETAILS.filter((d) => codeOf(d.project).toLowerCase() === code.toLowerCase());

/**
 * Matriz de permissões de partida, exatamente como o design.
 * A ordem das linhas é a do design (Buyer, PFE, CVE, IST, PPM, RSPM, CPSC),
 * que difere da ordem de RENAULT_ROLES — por isso é dado, não derivação.
 *
 * Mesmo seed para todos os projetos: a API ainda não distingue. O argumento
 * `code` já existe na assinatura para o dia em que distinguir.
 */
const SEED: RolePermission[] = [
  { role: "BUYER", people: 5, grants: { view: true, comment: true, approve: true } },
  { role: "PFE", people: 5, grants: { view: true, comment: true, approve: true } },
  { role: "CVE", people: 5, grants: { view: true, comment: true, approve: true } },
  { role: "IST", people: 5, grants: { view: true, comment: false, approve: true } },
  { role: "PPM", people: 5, grants: { view: true, comment: true, approve: true } },
  { role: "RSPM", people: 5, grants: { view: true, comment: true, approve: true } },
  { role: "CPSC", people: 5, grants: { view: true, comment: false, approve: false } },
];

/** Cópia profunda: a página mexe no estado local e não pode sujar o seed. */
export const permissionsOfProject = (_code: string): RolePermission[] =>
  SEED.map((r) => ({ ...r, grants: { ...r.grants } }));
