import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../../utils/cx";

export type ButtonVariant = "primary" | "onDark" | "outline" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Exposto à parte para usar em <Link>, que não é <button>.
 * Mata o antigo `.button-like`.
 */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  block = false
): string {
  return cx("btn", `btn--${variant}`, `btn--${size}`, block && "btn--block");
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export default function Button({
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  icon,
  iconPosition = "left",
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cx(buttonClass(variant, size, block), className)}
      disabled={disabled || loading}
      {...rest}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}
