import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import type { Tone } from "../../../models/status";

export interface BadgeProps {
  tone?: Tone;
  /** Ponto à esquerda, como nos badges de status do design. */
  dot?: boolean;
  size?: "sm" | "md";
  children: ReactNode;
  className?: string;
}

export default function Badge({
  tone = "neutral",
  dot = false,
  size = "md",
  children,
  className,
}: BadgeProps) {
  return (
    <span className={cx("badge-pill", `badge-pill--${tone}`, `badge-pill--${size}`, className)}>
      {dot && <span className="badge-pill__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
