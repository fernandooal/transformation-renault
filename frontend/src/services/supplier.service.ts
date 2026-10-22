import { api } from "./http";
import { buildSupplierList, buildSupplierReport } from "./mock/suppliers.mock";
import type { SupplierReport, SupplierSummary } from "../models/supplier";

const useMock = (import.meta.env.VITE_MOCK_API ?? "true") !== "false";

/**
 * O backend ainda não agrega nada por fornecedor (/api/suppliers não existe).
 * Enquanto não existir, o mock responde; quando existir, basta VITE_MOCK_API=false.
 * Qualquer falha da API também cai no mock, para a DEMO nunca ficar em branco.
 */
export async function list(): Promise<SupplierSummary[]> {
  if (useMock) return buildSupplierList();
  try {
    return await api<SupplierSummary[]>("/api/suppliers");
  } catch {
    return buildSupplierList();
  }
}

export async function report(id: string): Promise<SupplierReport | null> {
  if (useMock) return buildSupplierReport(id);
  try {
    return await api<SupplierReport>(`/api/suppliers/${encodeURIComponent(id)}`);
  } catch {
    return buildSupplierReport(id);
  }
}
