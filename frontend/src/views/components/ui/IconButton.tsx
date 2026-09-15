import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../../utils/cx";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Obrigatório: vira aria-label, já que não há texto visível. */
  label: string;
  icon: ReactNode;
  variant?: "ghost" | "soft" | "onDark";
}

export default function IconButton({
  label,
  icon,
  variant = "ghost",
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx("icon-btn", variant !== "ghost" && `icon-btn--${variant}`, className)}
      {...rest}
    >
      {icon}
    </button>
  );
}
