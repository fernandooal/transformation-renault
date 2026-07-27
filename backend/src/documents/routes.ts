import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import { requireAuth, requireRole } from "../auth/middleware.ts";
import type { F4Document } from "../types.ts";

const SAMPLES_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "public",
  "samples"
);

// Lista mock — a estrutura real dos documentos F4 será definida posteriormente.
// ponytail: array em memória; trocar por banco quando a estrutura do F4 fechar.
const DOCUMENTS: F4Document[] = [
  {
    id: 1,
    title: "Engine Harness routing update",
    supplier: "Supplier Name S.A.",
    ecoId: "234",
    modificationNumber: "2",
    vehicles: "JFC, NFK, HJB",
    contract: "ECO 234 / Mod 2",
    status: "In approval",
    completion: 78,
    version: "Rev 03",
    value: 124000,
    currency: "EUR",
    deadline: "2026-08-15",
    owner: "PFE Renault — Ana Ribeiro",
    dependsOn: [],
    signed: false,
    updatedAt: "2026-07-01",
    file: "f4-exemplo.pdf",
  },
  {
    id: 2,
    title: "Front bumper bracket material change",
    supplier: "Supplier Name S.A.",
    ecoId: "241",
    modificationNumber: "1",
    vehicles: "JFC",
    contract: "ECO 241 / Mod 1",
    status: "Draft",
    completion: 35,
    version: "Rev 00",
    value: 48050,
    currency: "EUR",
    deadline: "2026-09-30",
    owner: "PFE Renault — Ana Ribeiro",
    dependsOn: [1],
    signed: false,
    updatedAt: "2026-07-18",
    file: "f4-exemplo.pdf",
  },
  {
    id: 3,
    title: "Front panel injection tooling transfer",
    supplier: "PlastTech Componentes Ltda.",
    ecoId: "198",
    modificationNumber: "5",
    vehicles: "NFK",
    contract: "ECO 198 / Mod 5",
    status: "Signed",
    completion: 100,
    version: "Rev 05",
    value: 231000,
    currency: "EUR",
    deadline: "2026-06-10",
    owner: "PFE Renault — Carlos Nunes",
    dependsOn: [],
    signed: true,
    updatedAt: "2026-06-09",
    file: "f4-exemplo.pdf",
  },
  {
    id: 4,
    title: "Rear longitudinal stamping process evolution",
    supplier: "MetalSul Estamparia S.A.",
    ecoId: "252",
    modificationNumber: "2",
    vehicles: "HJB",
    contract: "ECO 252 / Mod 2",
    status: "Late",
    completion: 52,
    version: "Rev 02",
    value: 89000,
    currency: "EUR",
    deadline: "2026-07-05",
    owner: "PFE Renault — Carlos Nunes",
    dependsOn: [3],
    signed: false,
    updatedAt: "2026-07-20",
    file: "f4-exemplo.pdf",
  },
];

const publicDoc = ({ file, ...doc }: F4Document): Omit<F4Document, "file"> => doc;

interface CreateF4Body {
  titleOfModification?: string;
  supplier?: string;
  f4Version?: string;
  totalImpact?: number | string;
  offerCurrency?: string;
  deadline?: string;
  renaultF4Manager?: string;
  [extra: string]: unknown;
}

export function documentsRouter(): Router {
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
      byStatus: DOCUMENTS.reduce<Record<string, number>>((acc, d) => {
        acc[d.status] = (acc[d.status] || 0) + 1;
        return acc;
      }, {}),
    });
  });

  /** Criação de F4 — persiste apenas em memória nesta DEMO. */
  router.post("/", (req, res) => {
    const body = (req.body || {}) as CreateF4Body;
    const { titleOfModification, supplier } = body;
    if (!titleOfModification || !supplier) {
      return res
        .status(400)
        .json({ error: "Title of Modification e Corporate Name são obrigatórios." });
    }
    const doc: F4Document = {
      ...body,
      id: Math.max(...DOCUMENTS.map((d) => d.id)) + 1,
      title: titleOfModification,
      supplier,
      status: "Draft",
      completion: 10,
      version: body.f4Version || "Rev 00",
      signed: false,
      value: Number(body.totalImpact) || 0,
      currency: body.offerCurrency || "EUR",
      deadline: body.deadline || "",
      owner: body.renaultF4Manager || "",
      dependsOn: [],
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
