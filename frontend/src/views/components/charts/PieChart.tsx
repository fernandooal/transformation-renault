import { useState } from "react";
import { cx } from "../../../utils/cx";
import { percent } from "../../../utils/format";
import { describeSlice } from "../../../utils/geometry";
import ChartLegend from "./ChartLegend";
import type { PieSlice } from "./types";

export interface PieChartProps {
  slices: PieSlice[];
  caption: string;
  size?: number;
  legend?: "right" | "none";
}

/** Anel de superfície entre fatias, para elas não encostarem. */
const RING = 2;

export default function PieChart({ slices, caption, size = 260, legend = "right" }: PieChartProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const r = size / 2 - RING;
  const cx0 = size / 2;
  const cy0 = size / 2;

  let angle = 0;

  return (
    <div className={cx("chart chart-pie", hovered && "chart--hovering")}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={caption}
        onMouseLeave={() => setHovered(null)}
      >
        {slices.map((slice) => {
          const sweep = (slice.value / total) * 360;
          const d = describeSlice(cx0, cy0, r, angle, angle + sweep);
          angle += sweep;
          return (
            <path
              key={slice.id}
              className={cx("chart__mark", hovered === slice.id && "is-hovered")}
              d={d}
              fill={slice.color}
              stroke="var(--color-surface)"
              strokeWidth={RING}
              onMouseEnter={() => setHovered(slice.id)}
            >
              <title>{`${slice.label}: ${percent(slice.value)}`}</title>
            </path>
          );
        })}
      </svg>

      {legend === "right" && (
        <ChartLegend
          layout="column"
          emphasis
          items={slices.map((s) => ({
            label: s.label,
            color: s.color,
            value: percent((s.value / total) * 100),
          }))}
        />
      )}

      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {slices.map((s) => (
            <tr key={s.id}>
              <th scope="row">{s.label}</th>
              <td>{percent((s.value / total) * 100)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
