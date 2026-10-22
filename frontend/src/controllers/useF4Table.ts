import { useMemo, useState } from "react";
import type { F4Summary } from "../models/f4";

export type SortDir = "asc" | "desc";

/**
 * Ordenação e reordenação de colunas da tabela de F4.
 *
 * O design mostra um caret por coluna e um controle de mover coluna, mais um
 * botão "Redefinir" que só fica ativo quando há algo a redefinir. O estado é
 * da tela: não há preferência de usuário no backend.
 */
export function useF4Table(defaultOrder: string[]) {
  const [order, setOrder] = useState<string[]>(defaultOrder);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const dirty = sortKey !== null || order.join() !== defaultOrder.join();

  function toggleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    if (sortDir === "asc") {
      setSortDir("desc");
      return;
    }
    setSortKey(null); // terceiro clique volta à ordem natural
  }

  function moveColumn(key: string, delta: -1 | 1) {
    setOrder((prev) => {
      const i = prev.indexOf(key);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function reset() {
    setOrder(defaultOrder);
    setSortKey(null);
    setSortDir("asc");
  }

  /** Comparadores por coluna; o que não estiver aqui ordena como texto. */
  const sortRows = useMemo(
    () => (rows: F4Summary[]): F4Summary[] => {
      if (!sortKey) return rows;
      const pick = (r: F4Summary): string | number => {
        switch (sortKey) {
          case "part":
            return r.part;
          case "partNumber":
            return r.partNumber;
          case "supplier":
            return r.supplier.name;
          case "flow":
            return r.returns;
          case "responsible":
            return r.responsible?.name ?? "";
          case "status":
            return r.status;
          case "updated":
            return r.updatedAt;
          case "gapComercial":
            return r.gapComercial;
          case "gapTecnico":
            return r.gapTecnico;
          default:
            return "";
        }
      };
      const sign = sortDir === "asc" ? 1 : -1;
      return [...rows].sort((a, b) => {
        const x = pick(a);
        const y = pick(b);
        if (typeof x === "number" && typeof y === "number") return (x - y) * sign;
        return String(x).localeCompare(String(y), "pt-BR") * sign;
      });
    },
    [sortKey, sortDir]
  );

  return { order, sortKey, sortDir, dirty, toggleSort, moveColumn, reset, sortRows };
}
