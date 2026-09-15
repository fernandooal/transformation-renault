import { useEffect, useMemo, useState } from "react";
import * as F4Service from "../services/f4.service";
import type { F4Summary } from "../models/f4";
import { F4_FILTERS } from "../models/status";

export function useF4List() {
  const [all, setAll] = useState<F4Summary[]>([]);
  const [activeFilter, setActiveFilter] = useState("todas");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    F4Service.list()
      .then((rows) => alive && setAll(rows))
      .catch((err: Error) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  /** Contagens sempre sobre a busca aplicada, para os chips baterem com a tabela. */
  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((f) =>
      `${f.part} ${f.code} ${f.partNumber} ${f.supplier.name} ${f.responsible?.name ?? ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [all, query]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const filter of F4_FILTERS) {
      map[filter.id] = searched.filter((f) => filter.matches(f.status)).length;
    }
    return map;
  }, [searched]);

  const rows = useMemo(() => {
    const filter = F4_FILTERS.find((f) => f.id === activeFilter) ?? F4_FILTERS[0];
    return searched.filter((f) => filter.matches(f.status));
  }, [searched, activeFilter]);

  return {
    rows,
    counts,
    filters: F4_FILTERS,
    activeFilter,
    setActiveFilter,
    query,
    setQuery,
    loading,
    error,
  };
}
