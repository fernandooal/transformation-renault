import { api } from "./http";
import { F4_LIST, findF4 } from "./mock/f4.mock";
import type { F4Detail, F4Summary } from "../models/f4";

const useMock = (import.meta.env.VITE_MOCK_API ?? "true") !== "false";

export async function list(): Promise<F4Summary[]> {
  if (useMock) return F4_LIST;
  try {
    const data = await api<{ documents: F4Summary[] }>("/api/documents");
    return data.documents;
  } catch {
    return F4_LIST;
  }
}

export async function detail(id: number): Promise<F4Detail | null> {
  if (useMock) return findF4(id);
  try {
    const data = await api<{ document: F4Detail }>(`/api/documents/${id}`);
    return data.document;
  } catch {
    return findF4(id);
  }
}
