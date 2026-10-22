import { cx } from "../../../utils/cx";
import type { SupplierTint } from "../../../models/supplier";

export interface SupplierAvatarProps {
  initials: string;
  tint: SupplierTint;
  className?: string;
}

/**
 * Quadrado de iniciais do fornecedor. Não é o `Avatar` de ui/: aquele é
 * redondo e serve a pessoas; este é quadrado (raio 8px) e serve a empresas.
 * Decorativo — o nome do fornecedor vem logo ao lado, em texto.
 */
export default function SupplierAvatar({ initials, tint, className }: SupplierAvatarProps) {
  return (
    <span className={cx("supplier-avatar", `supplier-avatar--${tint}`, className)} aria-hidden="true">
      {initials}
    </span>
  );
}
