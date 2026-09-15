import Badge from "./Badge";
import { statusMeta } from "../../../models/status";
import type { F4Status } from "../../../models/status";

export interface StatusBadgeProps {
  status: F4Status;
  size?: "sm" | "md";
  /** Usa o rótulo longo ("Em Revisão Técnica") em vez do curto. */
  long?: boolean;
}

export default function StatusBadge({ status, size = "md", long = false }: StatusBadgeProps) {
  const meta = statusMeta(status);
  return (
    <Badge tone={meta.tone} dot size={size}>
      {long ? meta.longLabel : meta.label}
    </Badge>
  );
}
