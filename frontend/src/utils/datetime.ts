/** Datas e tempo relativo em pt-BR. */

export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "Bom dia";
  if (h >= 12 && h < 18) return "Boa tarde";
  return "Boa noite";
}

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

/**
 * "Há 2 dias", "Há 5 horas", "Agora".
 * numeric:"always" de propósito — com "auto" o Intl devolve "ontem" em vez de
 * "há 1 dia", e o design pede a forma numérica.
 */
export function relativeTime(iso: string, now = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = now.getTime() - then;
  if (Math.abs(diff) < 60 * 1000) return "Agora";

  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "always" });
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) {
      const text = rtf.format(-Math.round(diff / ms), unit);
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
  }
  return "Agora";
}

export function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

/** Prazo vencido: ignora string vazia (o backend atual grava "" ao criar). */
export function isOverdue(deadline: string, now = new Date()): boolean {
  if (!deadline) return false;
  return new Date(deadline).getTime() < now.getTime();
}

/** "22/09 · 08:17" — formato que o design usa na coluna "Atualizado". */
export function shortDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const date = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}
