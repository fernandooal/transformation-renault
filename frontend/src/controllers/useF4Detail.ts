import { useEffect, useState } from "react";
import * as F4Service from "../services/f4.service";
import { PEOPLE } from "../services/mock/people";
import { documentState } from "../models/f4";
import type { F4Comparison, F4Detail, F4HistoryEntry } from "../models/f4";

export type DetailTab = "historico" | "versoes" | "documentos";

/** Identidade do usuário na DEMO: a mesma que assina, comenta e cria checkpoint. */
const CURRENT_USER = PEOPLE.leticia;

export function useF4Detail(id: number) {
  const [f4, setF4] = useState<F4Detail | null>(null);
  const [comparison, setComparison] = useState<F4Comparison | null>(null);
  const [tab, setTab] = useState<DetailTab>("historico");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    F4Service.comparison(id).then((c) => alive && setComparison(c));
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
                author: CURRENT_USER,
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

  /** Assina, se CURRENT_USER for o próximo da fila. Devolve o nome do documento. */
  function signDocument(documentId: string): string | null {
    const doc = f4?.documents.find((d) => d.id === documentId);
    if (!doc) return null;

    const next = documentState(doc).next;
    if (!next || next.signer.id !== CURRENT_USER.id) return null;

    const at = new Date().toISOString();
    setF4((prev) =>
      prev
        ? {
            ...prev,
            documents: prev.documents.map((d) =>
              d.id === documentId
                ? {
                    ...d,
                    signatures: d.signatures.map((s) =>
                      s.order === next.order ? { ...s, signedAt: at } : s
                    ),
                  }
                : d
            ),
          }
        : prev
    );

    return doc.name;
  }

  function sign(documentId: string): void {
    const name = signDocument(documentId);
    if (!name) return;
    append("approval", `Assinou digitalmente: ${name}.`, "assinatura (mock)");
    setNotice(`Assinatura registrada em "${name}". O certificado ICP-Brasil ainda é simulado.`);
  }

  return {
    f4,
    comparison,
    tab,
    setTab,
    loading,
    error,
    notice,
    currentUser: CURRENT_USER,
    dismissNotice: () => setNotice(null),
    comment: (text: string) => append("comment", text, "comentário"),
    sign,
    /** Aprova, assina o termo se estiver na vez e leva para a aba de assinaturas. */
    approveAndSign: () => {
      const termo = f4?.documents.find((d) => d.kind === "TERMO");
      if (termo) signDocument(termo.id);
      append("approval", "Aprovada e assinada digitalmente.", "assinatura (mock)");
      setNotice("Aprovação registrada. A assinatura ICP-Brasil ainda é simulada nesta DEMO.");
      setTab("documentos");
    },
    returnToSupplier: () => {
      append("return", "Devolvida para revisão do fornecedor.", "devolução");
      setNotice("Devolução registrada no histórico.");
    },
  };
}
