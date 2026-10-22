import { api } from "./http";
import { PROJECTS, f4sOfProject, findProject, permissionsOfProject } from "./mock/projects.mock";
import type { F4Summary } from "../models/f4";
import type { ProjectSummary, RolePermission } from "../models/project";

const useMock = (import.meta.env.VITE_MOCK_API ?? "true") !== "false";

/**
 * O backend não tem nenhuma rota de projeto ainda. Enquanto não tiver, o mock
 * responde; quando tiver, basta VITE_MOCK_API=false. Qualquer falha da API
 * também cai no mock, para a DEMO nunca ficar com a tela em branco — é o mesmo
 * contrato de f4.service e dashboard.service.
 */
export async function list(): Promise<ProjectSummary[]> {
  if (useMock) return PROJECTS;
  try {
    const data = await api<{ projects: ProjectSummary[] }>("/api/projects");
    return data.projects;
  } catch {
    return PROJECTS;
  }
}

export async function detail(code: string): Promise<ProjectSummary | null> {
  if (useMock) return findProject(code);
  try {
    const data = await api<{ project: ProjectSummary }>(`/api/projects/${code}`);
    return data.project;
  } catch {
    return findProject(code);
  }
}

/** As F4 do projeto — mesma forma de linha da tela "Todas as F4's". */
export async function f4s(code: string): Promise<F4Summary[]> {
  if (useMock) return f4sOfProject(code);
  try {
    const data = await api<{ documents: F4Summary[] }>(`/api/projects/${code}/documents`);
    return data.documents;
  } catch {
    return f4sOfProject(code);
  }
}

/** Matriz "Permissões por Papel". */
export async function permissions(code: string): Promise<RolePermission[]> {
  if (useMock) return permissionsOfProject(code);
  try {
    const data = await api<{ permissions: RolePermission[] }>(`/api/projects/${code}/permissions`);
    return data.permissions;
  } catch {
    return permissionsOfProject(code);
  }
}
