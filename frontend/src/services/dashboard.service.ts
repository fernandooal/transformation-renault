import { api } from "./http";
import { buildOverview } from "./mock/dashboard.mock";
import type { DashboardFilter, DashboardOverview } from "../models/dashboard";

const useMock = (import.meta.env.VITE_MOCK_API ?? "true") !== "false";

/**
 * O backend ainda não tem /api/dashboard/overview. Enquanto não tiver, o mock
 * responde; quando tiver, basta VITE_MOCK_API=false. Qualquer falha da API
 * também cai no mock, para a DEMO nunca ficar com a tela em branco.
 */
export async function overview(filter: DashboardFilter): Promise<DashboardOverview> {
  if (useMock) return buildOverview(filter);
  try {
    const qs = new URLSearchParams(
      Object.entries(filter).filter(([, v]) => v) as [string, string][]
    ).toString();
    return await api<DashboardOverview>(`/api/dashboard/overview${qs ? `?${qs}` : ""}`);
  } catch {
    return buildOverview(filter);
  }
}
