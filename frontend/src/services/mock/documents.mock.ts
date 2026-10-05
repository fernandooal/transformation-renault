/**
 * Documentos e assinaturas da DEMO. As assinaturas já concluídas derivam de
 * `stagesDone`, a mesma fonte do F4FlowStrip — a aba nunca contradiz o fluxo.
 */
import type { F4DocumentFile, F4Signature, Person } from "../../models/f4";
import type { Role } from "../../models/roles";
import type { F4Status } from "../../models/status";
import { PEOPLE } from "./people";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
const daysAgo = (d: number) => hoursAgo(d * 24);

export interface DocumentSeed {
  id: number;
  code: string;
  version: string;
  supplier: Person;
  responsible: Person | null;
  status: F4Status;
  stagesDone: number;
  technicalReturns: number;
}

/**
 * A etapa em `stagesDone` está *em análise*, não concluída (mesma leitura do
 * F4FlowStrip) — quem responde por ela ainda não assinou.
 */
function signedCount(seed: DocumentSeed): number {
  return seed.status === "APPROVED" ? 4 : Math.max(0, seed.stagesDone - 1);
}

/** O responsável quando o cargo bate; senão, o titular padrão daquele papel. */
function by(seed: DocumentSeed, role: Role, fallback: Person): Person {
  return seed.responsible?.role === role ? seed.responsible : fallback;
}

function queue(signers: Person[], signedCount: number): F4Signature[] {
  return signers.map((signer, i) => ({
    signer,
    order: i + 1,
    signedAt: i < signedCount ? daysAgo(7 - i * 2) : null,
  }));
}

export function documentsFor(seed: DocumentSeed): F4DocumentFile[] {
  const pdf = `/f4/${seed.id}/pdf`;
  const done = signedCount(seed);
  const pfe = by(seed, "PFE", PEOPLE.leticia);
  const buyer = by(seed, "BUYER", PEOPLE.rafael);
  const cve = by(seed, "CVE", PEOPLE.ana);

  const docs: F4DocumentFile[] = [
    {
      id: `${seed.id}-termo`,
      name: `Termo Contratual — ${seed.code} ${seed.version}`,
      kind: "TERMO",
      version: seed.version,
      addedAt: daysAgo(7),
      sizeKb: 420 + seed.id * 13,
      requiresSignature: true,
      signatures: queue([seed.supplier, pfe, buyer, cve], done),
      pdfPath: pdf,
    },
    {
      id: `${seed.id}-anexo`,
      name: "Anexo Técnico — desenho 2D da peça",
      kind: "ANEXO_TECNICO",
      version: seed.version,
      addedAt: daysAgo(7),
      sizeKb: 1180 + seed.id * 7,
      requiresSignature: true,
      signatures: queue([seed.supplier, pfe], Math.min(done, 2)),
      pdfPath: pdf,
    },
    {
      id: `${seed.id}-custos`,
      name: "Planilha de Custos consolidada",
      kind: "PLANILHA_CUSTOS",
      version: seed.version,
      addedAt: daysAgo(4),
      sizeKb: 96 + seed.id * 3,
      requiresSignature: true,
      signatures: queue([buyer], done >= 3 ? 1 : 0),
      pdfPath: null,
    },
  ];

  if (seed.technicalReturns > 0) {
    docs.push({
      id: `${seed.id}-ensaio`,
      name: "Relatório de Ensaio Dimensional",
      kind: "RELATORIO",
      version: seed.version,
      addedAt: hoursAgo(30),
      sizeKb: 2340 + seed.id * 11,
      requiresSignature: false,
      signatures: [],
      pdfPath: pdf,
    });
  }

  return docs;
}
