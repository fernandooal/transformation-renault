/** Junta classes ignorando falsy. Evita a dependência `clsx`. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
