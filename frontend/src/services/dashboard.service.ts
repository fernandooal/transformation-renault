import { api } from "./http";
import { buildOverview } from "./mock/dashboard.mock";
import type { DashboardOverview } from "../models/dashboard";

const useMock = (import.meta.env.VITE_MOCK_API ?? "true") !== "false";

/**
 * O backend ainda não tem /api/dashboard/overview. Enquanto não tiver, o mock
 * responde; quando tiver, basta VITE_MOCK_API=false. Qualquer falha da API
 * também cai no mock, para a DEMO nunca ficar com a tela em branco.
 */
export async function overview(): Promise<DashboardOverview> {
  if (useMock) return buildOverview();
  try {
    return await api<DashboardOverview>("/api/dashboard/overview");
  } catch {
    return buildOverview();
  }
}
