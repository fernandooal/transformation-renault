import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import { requireAuth, requireRole } from "../auth/middleware.js";

const SAMPLES_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "public",
  "samples"
);

// Lista mock — a estrutura real dos documentos F4 será definida posteriormente.
const DOCUMENTS = [
  {
    id: 1,
    title: "F4 — Contrato de Compra de Materiais (exemplo)",
    supplier: "Fornecedor Exemplo S.A.",
    updatedAt: "2026-07-01",
    file: "f4-exemplo.pdf",
  },
];

export function documentsRouter() {
  const router = Router();

  router.use(requireAuth, requireRole("Demo"));

  router.get("/", (_req, res) => {
    res.json({ documents: DOCUMENTS.map(({ file, ...doc }) => doc) });
  });

  router.get("/:id/file", (req, res) => {
    const doc = DOCUMENTS.find((d) => d.id === Number(req.params.id));
    if (!doc) return res.status(404).json({ error: "Documento não encontrado." });
    return res.sendFile(path.join(SAMPLES_DIR, doc.file));
  });

  return router;
}
