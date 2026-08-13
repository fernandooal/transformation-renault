import type { CreateF4Input } from "../types/index.ts";

export function validateCreateF4(body: unknown): string | null {
  const { titleOfModification, supplier } = (body ?? {}) as CreateF4Input;
  if (!titleOfModification || !supplier) {
    return "Title of Modification e Corporate Name são obrigatórios.";
  }
  return null;
}
