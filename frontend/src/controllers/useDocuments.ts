import { useEffect, useMemo, useState } from "react";
import * as DocumentService from "../services/document.service";
import type { F4Document, Metrics } from "../models/index";

export const STATUSES = ["Todos", "Draft", "In approval", "Signed", "Late"];

export function useDocuments() {
  const [documents, setDocuments] = useState<F4Document[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [status, setStatus] = useState("Todos");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    DocumentService.list()
      .then(setDocuments)
      .catch((err: Error) => setError(err.message));
    DocumentService.metrics().then(setMetrics).catch(() => {});
  }, []);

  const visible = useMemo(
    () =>
      documents.filter(
        (doc) =>
          (status === "Todos" || doc.status === status) &&
          `${doc.title} ${doc.supplier} ${doc.contract ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [documents, status, query]
  );

  return { visible, metrics, status, setStatus, query, setQuery, error };
}
