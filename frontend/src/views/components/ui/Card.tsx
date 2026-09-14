import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";

export interface CardProps {
  title?: ReactNode;
  /** Texto no canto direito do cabeçalho ("ordenado por urgência"). */
  corner?: ReactNode;
  /** Texto interpretativo abaixo do conteúdo. */
  footer?: ReactNode;
  padding?: "none" | "sm" | "md";
  className?: string;
  children?: ReactNode;
}

export default function Card({
  title,
  corner,
  footer,
  padding = "md",
  className,
  children,
}: CardProps) {
  return (
    <section className={cx("card", padding !== "none" && `card--pad-${padding}`, className)}>
      {(title || corner) && (
        <header className="card__head">
          {title && <h3 className="card__title">{title}</h3>}
          {corner && <span className="card__corner">{corner}</span>}
        </header>
      )}
      {children}
      {footer && <p className="card__footer">{footer}</p>}
    </section>
  );
}
