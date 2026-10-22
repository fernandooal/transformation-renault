import { useState } from "react";
import { cx } from "../../../utils/cx";
import { int } from "../../../utils/format";
import { niceMax, topRoundedRect } from "../../../utils/geometry";
import ChartLegend from "./ChartLegend";
import DataTableFallback from "./DataTableFallback";
import type { ChartCategory, ChartSeries } from "./types";

export interface StackedBarChartProps {
  categories: ChartCategory[];
  series: ChartSeries[];
  /** Descrição do gráfico: vira aria-label e legenda da tabela sr-only. */
  caption: string;
  height?: number;
  barWidth?: number;
  showLegend?: boolean;
}

const RADIUS = 0;
/** Respiro na cor da superfície entre segmentos empilhados. */
const GAP = 2;
const SLOT = 100;
const AXIS_H = 30;

interface Hover {
  id: string;
  x: number;
  y: number;
  label: string;
}

export default function StackedBarChart({
  categories,
  series,
  caption,
  height = 230,
  barWidth = 44,
  showLegend = true,
}: StackedBarChartProps) {
  const [hover, setHover] = useState<Hover | null>(null);

  const totals = categories.map((c) => series.reduce((sum, s) => sum + (c.values[s.key] ?? 0), 0));
  const max = niceMax(Math.max(...totals, 1));

  const width = categories.length * SLOT;
  const plotH = height - AXIS_H;
  const scale = (v: number) => (v / max) * plotH;

  return (
    <div
      className={cx("chart", hover && "chart--hovering")}
      style={{ ["--chart-h" as string]: `${height}px` }}
    >
      <svg
        className="chart__svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={caption}
        onMouseLeave={() => setHover(null)}
      >
        <line
          className="chart__grid"
          x1="0"
          y1={plotH}
          x2={width}
          y2={plotH}
          vectorEffect="non-scaling-stroke"
        />

        {categories.map((cat, ci) => {
          const center = SLOT * ci + SLOT / 2;
          const x = center - barWidth / 2;
          let cursor = plotH;

          return series.map((s, si) => {
            const value = cat.values[s.key] ?? 0;
            if (value <= 0) return null;

            const raw = scale(value);
            const isTop = series.slice(si + 1).every((rest) => (cat.values[rest.key] ?? 0) <= 0);
            const h = Math.max(raw - (isTop ? 0 : GAP), 1);
            const y = cursor - raw;
            cursor -= raw;

            const id = `${cat.label}::${s.key}`;
            return (
              <path
                key={id}
                className={cx("chart__mark", hover?.id === id && "is-hovered")}
                d={
                  isTop
                    ? topRoundedRect(x, y, barWidth, h, RADIUS)
                    : `M ${x} ${y} h ${barWidth} v ${h} h ${-barWidth} Z`
                }
                fill={s.color}
                onMouseEnter={() =>
                  setHover({
                    id,
                    x: (center / width) * 100,
                    y: (y / height) * 100,
                    label: `${cat.label} · ${s.label}: ${int(value)}`,
                  })
                }
              />
            );
          });
        })}

        {categories.map((cat, ci) => (
          <text
            key={cat.label}
            className="chart__axis-label"
            x={SLOT * ci + SLOT / 2}
            y={height - 8}
            textAnchor="middle"
          >
            {cat.label}
          </text>
        ))}
      </svg>

      {hover && (
        <div className="chart__tooltip" style={{ left: `${hover.x}%`, top: `${hover.y}%` }}>
          {hover.label}
        </div>
      )}

      {showLegend && series.length >= 2 && (
        <ChartLegend items={series.map((s) => ({ label: s.label, color: s.color }))} />
      )}

      <DataTableFallback caption={caption} categories={categories} series={series} />
    </div>
  );
}
