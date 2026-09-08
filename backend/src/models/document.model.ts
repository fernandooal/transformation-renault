import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CreateF4Input, F4Document, F4Metrics, PublicF4Document } from "../types/index.ts";

export const SAMPLES_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "public",
  "samples"
);

// Mock em memória; trocar por banco quando a estrutura do F4 fechar.
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

export function toPublic({ file, ...doc }: F4Document): PublicF4Document {
  return doc;
}

export function findAll(): F4Document[] {
  return DOCUMENTS;
}

export function findById(id: number): F4Document | null {
  return DOCUMENTS.find((d) => d.id === id) ?? null;
}

export function create(input: CreateF4Input): F4Document {
  const doc: F4Document = {
    ...input,
    id: Math.max(...DOCUMENTS.map((d) => d.id)) + 1,
    title: String(input.titleOfModification),
    supplier: String(input.supplier),
    status: "Draft",
    completion: 10,
    version: input.f4Version || "Rev 00",
    signed: false,
    value: Number(input.totalImpact) || 0,
    currency: input.offerCurrency || "EUR",
    deadline: input.deadline || "",
    owner: input.renaultF4Manager || "",
    dependsOn: [],
    updatedAt: new Date().toISOString().slice(0, 10),
    file: "f4-exemplo.pdf",
  };
  DOCUMENTS.push(doc);
  return doc;
}

export function metrics(): F4Metrics {
  const today = new Date().toISOString().slice(0, 10);
  return {
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
  };
}
