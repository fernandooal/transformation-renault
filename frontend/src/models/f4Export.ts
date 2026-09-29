/** O que vai no arquivo exportado. Ponto único de verdade das colunas. */
import type { SheetColumn } from "../utils/spreadsheet";
import type { F4Summary } from "./f4";
import { STATUS_META } from "./status";
import { roleMeta } from "./roles";
import { partNumber } from "../utils/format";

export type ExportScope = "todas" | "periodo" | "selecao";
export type ExportFormat = "xlsx" | "csv";

export const EXPORT_SCOPES: Array<{ id: ExportScope; label: string; hint: string }> = [
  { id: "todas", label: "Todas as F4's", hint: "O acervo inteiro, ignorando filtro e busca." },
  { id: "periodo", label: "Por período", hint: "Pela data da última atualização." },
  { id: "selecao", label: "Escolher na tabela", hint: "Marque as F4's que quer levar." },
];

export const EXPORT_FORMATS: Array<{ id: ExportFormat; label: string }> = [
  { id: "xlsx", label: "Excel (.xlsx)" },
  { id: "csv", label: "CSV (.csv)" },
];

const OUTCOME_LABEL = { concluida: "Concluída", encerrada: "Encerrada" } as const;

const date = (iso: string): string => new Date(iso).toLocaleDateString("pt-BR");

export const EXPORT_COLUMNS: Array<SheetColumn<F4Summary>> = [
  { header: "Código", value: (f) => f.code },
  { header: "Versão", value: (f) => f.version },
  { header: "Peça", value: (f) => f.part },
  { header: "Part Number", value: (f) => partNumber(f.partNumber) },
  { header: "Fornecedor", value: (f) => f.supplier.name },
  { header: "Status", value: (f) => STATUS_META[f.status].longLabel },
  { header: "Etapa", value: (f) => `${f.stagesDone}/${f.stagesTotal}` },
  { header: "Voltas", value: (f) => f.returns },
  { header: "Responsável", value: (f) => f.responsible?.name ?? "" },
  { header: "Cargo", value: (f) => (f.responsible ? roleMeta(f.responsible.role).short : "") },
  { header: "Encerramento", value: (f) => (f.outcome ? OUTCOME_LABEL[f.outcome] : "") },
  { header: "Atualizado em", value: (f) => date(f.updatedAt) },
];

/** `updatedAt` é a única data da F4Summary — é por ela que o período filtra. */
export function filterByPeriod(rows: F4Summary[], from: string, to: string): F4Summary[] {
  const start = from ? new Date(`${from}T00:00:00`).getTime() : -Infinity;
  const end = to ? new Date(`${to}T23:59:59.999`).getTime() : Infinity;
  return rows.filter((f) => {
    const at = new Date(f.updatedAt).getTime();
    return at >= start && at <= end;
  });
}

export function exportFilename(
  scope: ExportScope,
  format: ExportFormat,
  range?: { from: string; to: string }
): string {
  const today = new Date().toISOString().slice(0, 10);
  const suffix =
    scope === "periodo" && range
      ? `${range.from || "inicio"}_a_${range.to || today}`
      : scope === "selecao"
        ? `selecionadas-${today}`
        : `todas-${today}`;
  return `f4s-${suffix}.${format}`;
}
