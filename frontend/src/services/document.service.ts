import { api } from "./http";

const useMock = (import.meta.env.VITE_MOCK_API ?? "true") !== "false";

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

/**
 * Sob mock, o PDF vem de public/: a rota real exige Bearer, que o react-pdf
 * não manda, e o backend só tem 4 documentos contra as 10 F4s do dataset.
 */
export function fileSource(id: string | undefined): string {
  if (useMock) return "/samples/f4-exemplo.pdf";
  return `/api/documents/${id}/file`;
}
