import { useEffect, useState } from "react";
import * as F4Service from "../services/f4.service";
import { PEOPLE } from "../services/mock/people";
import type { F4Detail, F4HistoryEntry } from "../models/f4";

export type DetailTab = "historico" | "versoes" | "checkpoints" | "documentos";

export function useF4Detail(id: number) {
  const [f4, setF4] = useState<F4Detail | null>(null);
  const [tab, setTab] = useState<DetailTab>("historico");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    F4Service.detail(id)
      .then((d) => {
        if (!alive) return;
        setF4(d);
        if (!d) setError("F4 não encontrada.");
      })
      .catch((err: Error) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  /**
   * Otimista e local: o backend não tem endpoint de comentário nem de
   * checkpoint. Some no reload — é DEMO, e a alternativa seria fingir
   * persistência que não existe.
   */
  function append(kind: F4HistoryEntry["kind"], body: string, tag: string) {
    setF4((prev) =>
      prev
        ? {
            ...prev,
            history: [
              {
                id: Date.now(),
                author: PEOPLE.leticia,
                at: new Date().toISOString(),
                kind,
                body,
                tag,
                tagTone: kind === "checkpoint" ? "purple" : "blue",
              },
              ...prev.history,
            ],
          }
        : prev
    );
  }

  return {
    f4,
    tab,
    setTab,
    loading,
    error,
    notice,
    dismissNotice: () => setNotice(null),
    comment: (text: string) => append("comment", text, "comentário"),
    checkpoint: (text: string) => append("checkpoint", text, "Marco"),
    /** Assinatura digital ainda é mock — decisão do cliente nesta fase. */
    approveAndSign: () => {
      append("approval", "Aprovada e assinada digitalmente.", "assinatura (mock)");
      setNotice("Aprovação registrada. A assinatura ICP-Brasil ainda é simulada nesta DEMO.");
    },
    returnToSupplier: () => {
      append("return", "Devolvida para revisão do fornecedor.", "devolução");
      setNotice("Devolução registrada no histórico.");
    },
  };
}
