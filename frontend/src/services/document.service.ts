import { api, storage } from "./http";
import type { F4Document, Metrics } from "../models/index";

export async function list(): Promise<F4Document[]> {
  const data = await api<{ documents: F4Document[] }>("/api/documents");
  return data.documents;
}

export function metrics(): Promise<Metrics> {
  return api<Metrics>("/api/documents/metrics");
}

export function create(payload: Record<string, unknown>): Promise<{ document: F4Document }> {
  return api<{ document: F4Document }>("/api/documents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// O PDF vem de rota autenticada; o react-pdf precisa do token no header.
export function fileSource(id: string | undefined) {
  return {
    url: `/api/documents/${id}/file`,
    httpHeaders: { Authorization: `Bearer ${storage.getToken()}` },
  };
}
