import { useEffect, useMemo, useState } from "react";
import * as ProjectService from "../services/project.service";
import type { ProjectSummary } from "../models/project";

/** Lista de projetos com a busca do cabeçalho aplicada sobre código e nome. */
export function useProjetos() {
  const [all, setAll] = useState<ProjectSummary[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    ProjectService.list()
      .then((rows) => alive && setAll(rows))
      .catch((err: Error) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((p) => `${p.code} ${p.name}`.toLowerCase().includes(q));
  }, [all, query]);

  return { all, rows, query, setQuery, loading, error };
}
