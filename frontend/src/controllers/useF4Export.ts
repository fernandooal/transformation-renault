import { useMemo, useState } from "react";
import { downloadBlob, toCsv, toXlsx } from "../utils/spreadsheet";
import {
  EXPORT_COLUMNS,
  exportFilename,
  filterByPeriod,
  type ExportFormat,
  type ExportScope,
} from "../models/f4Export";
import type { F4Summary } from "../models/f4";

/**
 * `all` é o acervo sem filtro (escopo "todas"); `visible` é o que o chip e a
 * busca deixaram na tela, base da seleção manual.
 */
export function useF4Export(all: F4Summary[], visible: F4Summary[]) {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<ExportScope>("todas");
  const [format, setFormat] = useState<ExportFormat>("xlsx");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const rows = useMemo(() => {
    if (scope === "periodo") return filterByPeriod(all, from, to);
    if (scope === "selecao") return visible.filter((f) => selectedSet.has(f.id));
    return all;
  }, [scope, all, visible, from, to, selectedSet]);

  const invalidRange = scope === "periodo" && from !== "" && to !== "" && from > to;
  const error = invalidRange
    ? "A data final é anterior à inicial."
    : rows.length === 0
      ? "Nenhuma F4 corresponde a esse recorte."
      : null;

  function toggle(id: number): void {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleAll(): void {
    const ids = visible.map((f) => f.id);
    setSelected((prev) => (ids.every((id) => prev.includes(id)) ? [] : ids));
  }

  function startSelection(): void {
    setScope("selecao");
    setSelectionMode(true);
    setOpen(false);
  }

  function cancelSelection(): void {
    setSelectionMode(false);
    setSelected([]);
    setScope("todas");
  }

  function run(): void {
    if (error) return;
    const blob =
      format === "xlsx" ? toXlsx(EXPORT_COLUMNS, rows, "F4s") : toCsv(EXPORT_COLUMNS, rows);
    downloadBlob(blob, exportFilename(scope, format, { from, to }));
    setOpen(false);
  }

  return {
    open,
    setOpen,
    scope,
    setScope,
    format,
    setFormat,
    from,
    setFrom,
    to,
    setTo,
    selected: selectedSet,
    selectionMode,
    toggle,
    toggleAll,
    startSelection,
    cancelSelection,
    count: rows.length,
    error,
    run,
  };
}
