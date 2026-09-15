import logo from "../../assets/rgdb-logo.png";
import { cx } from "../../utils/cx";

export interface BrandLockupProps {
  size?: "sm" | "lg";
  className?: string;
}

/**
 * O logo veio dos PDFs como raster (o Figma exportou o texto vetorizado como
 * Type 3 vazio, então não há caminho de vetor). Usamos o PNG com alpha como
 * máscara CSS: assim a mesma imagem serve branca no login e roxa na sidebar.
 * Trocar por SVG quando o Figma exportar o logo isolado.
 */
export default function BrandLockup({ size = "lg", className }: BrandLockupProps) {
  return (
    <span
      className={cx("brand", `brand--${size}`, className)}
      style={{ ["--brand-logo" as string]: `url(${logo})` }}
      role="img"
      aria-label="RGdB — Renault Geely do Brasil"
    />
  );
}
