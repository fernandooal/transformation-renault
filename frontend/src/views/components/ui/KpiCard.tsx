import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";

export interface KpiCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  hint?: string;
  hintTone?: "positive" | "negative" | "neutral";
}

export default function KpiCard({ label, value, icon, hint, hintTone = "neutral" }: KpiCardProps) {
  return (
    <article className="card kpi">
      <h3 className="kpi__label">{label}</h3>
      <div className="kpi__body">
        {icon}
        <span className="kpi__value">{value}</span>
      </div>
      {hint && <span className={cx("kpi__hint", `kpi__hint--${hintTone}`)}>{hint}</span>}
    </article>
  );
}
