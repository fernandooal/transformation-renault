/** Formatação pt-BR. Único lugar do app que chama Intl.NumberFormat. */

export const num = (v: unknown): number => Number(v) || 0;
export const str = (v: unknown): string => (typeof v === "string" ? v : "");

export function money(value: number, currency = "EUR"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function int(value: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(value || 0);
}

/** 6.2 -> "6,2" — usado nos KPIs de ciclo e voltas. */
export function decimal(value: number, digits = 1): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value || 0);
}

export function percent(value: number, digits = 0): string {
  return `${new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value || 0)}%`;
}

/** Variação de KPI: "+ 3", "-1,8", "+6 p.p.". */
export function signed(value: number, unit = "", digits = 0): string {
  const sign = value > 0 ? "+" : "";
  const body = digits > 0 ? decimal(value, digits) : int(value);
  return `${sign}${body}${unit ? ` ${unit}` : ""}`;
}

/** "7701208466" -> "7701 208 466" (padrão de part number Renault). */
export function partNumber(raw: string): string {
  const clean = raw.replace(/\s+/g, "");
  if (clean.length !== 10) return raw;
  return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
}

/** "PFE Renault — Ana Ribeiro" -> { name: "Ana Ribeiro", role: "PFE" } */
export function splitOwner(owner: string): { name: string; role: string } {
  const [rolePart, namePart] = owner.split("—").map((p) => p.trim());
  if (!namePart) return { name: owner.trim(), role: "" };
  return { name: namePart, role: rolePart.replace(/\s*Renault\s*/i, "").trim() };
}
