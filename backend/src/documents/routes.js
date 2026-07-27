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
// ponytail: array em memória; trocar por banco quando a estrutura do F4 fechar.
const DOCUMENTS = [
  {
    id: 1,
    title: "F4 — Contrato de Compra de Materiais (exemplo)",
    supplier: "Fornecedor Exemplo S.A.",
    contract: "CT-2026-0091",
    status: "Em aprovação",
    completion: 78,
    version: "v3",
    value: 1240000,
    currency: "BRL",
    deadline: "2026-08-15",
    owner: "Compras — Ana Ribeiro",
    dependsOn: [],
    signed: false,
    updatedAt: "2026-07-01",
    file: "f4-exemplo.pdf",
  },
  {
    id: 2,
    title: "F4 — Fornecimento de Chicotes Elétricos",
    supplier: "Fornecedor Exemplo S.A.",
    contract: "CT-2026-0104",
    status: "Rascunho",
    completion: 35,
    version: "v1",
    value: 480500,
    currency: "BRL",
    deadline: "2026-09-30",
    owner: "Compras — Ana Ribeiro",
    dependsOn: [1],
    signed: false,
    updatedAt: "2026-07-18",
    file: "f4-exemplo.pdf",
  },
  {
    id: 3,
    title: "F4 — Injeção Plástica Painel Frontal",
    supplier: "PlastTech Componentes Ltda.",
    contract: "CT-2025-0788",
    status: "Assinado",
    completion: 100,
    version: "v5",
    value: 2310000,
    currency: "BRL",
    deadline: "2026-06-10",
    owner: "Compras — Carlos Nunes",
    dependsOn: [],
    signed: true,
    updatedAt: "2026-06-09",
    file: "f4-exemplo.pdf",
  },
  {
    id: 4,
    title: "F4 — Estamparia Longarina Traseira",
    supplier: "MetalSul Estamparia S.A.",
    contract: "CT-2026-0112",
    status: "Atrasado",
    completion: 52,
    version: "v2",
    value: 890000,
    currency: "BRL",
    deadline: "2026-07-05",
    owner: "Compras — Carlos Nunes",
    dependsOn: [3],
    signed: false,
    updatedAt: "2026-07-20",
    file: "f4-exemplo.pdf",
  },
];

const publicDoc = ({ file, ...doc }) => doc;

export function documentsRouter() {
  const router = Router();

  router.use(requireAuth, requireRole("Demo"));

  router.get("/", (_req, res) => {
    res.json({ documents: DOCUMENTS.map(publicDoc) });
  });

  /** Métricas agregadas para o dashboard da gerência. */
  router.get("/metrics", (_req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    res.json({
      total: DOCUMENTS.length,
      signed: DOCUMENTS.filter((d) => d.signed).length,
      late: DOCUMENTS.filter((d) => !d.signed && d.deadline < today).length,
      totalValue: DOCUMENTS.reduce((sum, d) => sum + d.value, 0),
      avgCompletion: Math.round(
        DOCUMENTS.reduce((sum, d) => sum + d.completion, 0) / DOCUMENTS.length
      ),
      byStatus: DOCUMENTS.reduce((acc, d) => {
        acc[d.status] = (acc[d.status] || 0) + 1;
        return acc;
      }, {}),
    });
  });

  /** Criação de F4 — persiste apenas em memória nesta DEMO. */
  router.post("/", (req, res) => {
    const { title, supplier } = req.body || {};
    if (!title || !supplier) {
      return res.status(400).json({ error: "Título e fornecedor são obrigatórios." });
    }
    const doc = {
      ...req.body,
      id: Math.max(...DOCUMENTS.map((d) => d.id)) + 1,
      status: "Rascunho",
      completion: 10,
      version: "v1",
      signed: false,
      value: Number(req.body.value) || 0,
      currency: req.body.currency || "BRL",
      updatedAt: new Date().toISOString().slice(0, 10),
      file: "f4-exemplo.pdf",
    };
    DOCUMENTS.push(doc);
    return res.status(201).json({ document: publicDoc(doc) });
  });

  router.get("/:id/file", (req, res) => {
    const doc = DOCUMENTS.find((d) => d.id === Number(req.params.id));
    if (!doc) return res.status(404).json({ error: "Documento não encontrado." });
    return res.sendFile(path.join(SAMPLES_DIR, doc.file));
  });

  return router;
}
