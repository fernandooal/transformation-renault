import rgdbLogo from "../../assets/rgdb-logo.png";
import unnaLogo from "../../assets/unna-logo.png";
import { cx } from "../../utils/cx";

export type BrandMark = "rgdb" | "unna";

export interface BrandLockupProps {
  /** `unna` é a marca das telas de autenticação; `rgdb` é a do app logado. */
  mark?: BrandMark;
  size?: "sm" | "lg";
  className?: string;
}

const MARKS: Record<BrandMark, { src: string; ratio: string; label: string }> = {
  rgdb: { src: rgdbLogo, ratio: "1140 / 460", label: "RGdB — Renault Geely do Brasil" },
  unna: { src: unnaLogo, ratio: "794 / 312", label: "UNNA — Renault Geely do Brasil" },
};

/**
 * O logo veio do Figma como raster (o export vetoriza o texto como Type 3
 * vazio, então não há caminho de vetor). Usamos o PNG com alpha como máscara
 * CSS: assim a mesma imagem serve branca no login e roxa na sidebar.
 * Trocar por SVG quando o Figma exportar o logo isolado.
 */
export default function BrandLockup({ mark = "rgdb", size = "lg", className }: BrandLockupProps) {
  const { src, ratio, label } = MARKS[mark];
  return (
    <span
      className={cx("brand", `brand--${size}`, className)}
      style={{ ["--brand-logo" as string]: `url(${src})`, ["--brand-ratio" as string]: ratio }}
      role="img"
      aria-label={label}
    />
  );
}
