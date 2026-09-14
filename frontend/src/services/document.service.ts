import { api } from "./http";

/**
 * O que ainda fala com a API real de documentos: criação de F4 (useF4Form) e o
 * PDF do visualizador. A listagem migrou para f4.service, que fala o
 * vocabulário canônico da mentoria.
 */
export function create(payload: Record<string, unknown>): Promise<{ document: unknown }> {
  return api<{ document: unknown }>("/api/documents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fileSource(id: string | undefined): string {
  return `/api/documents/${id}/file`;
}
