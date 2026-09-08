import path from "node:path";
import type { Request, Response } from "express";
import * as Documents from "../models/document.model.ts";
import { validateCreateF4 } from "../validators/document.validator.ts";
import type { CreateF4Input } from "../types/index.ts";

export function list(_req: Request, res: Response): void {
  res.json({ documents: Documents.findAll().map(Documents.toPublic) });
}

export function metrics(_req: Request, res: Response): void {
  res.json(Documents.metrics());
}

export function create(req: Request, res: Response): Response {
  const error = validateCreateF4(req.body);
  if (error) return res.status(400).json({ error });

  const doc = Documents.create((req.body ?? {}) as CreateF4Input);
  return res.status(201).json({ document: Documents.toPublic(doc) });
}

export function file(req: Request, res: Response): Response | void {
  const doc = Documents.findById(Number(req.params.id));
  if (!doc) return res.status(404).json({ error: "Documento não encontrado." });
  return res.sendFile(path.join(Documents.SAMPLES_DIR, doc.file));
}
