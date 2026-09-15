import { cx } from "../../../utils/cx";

export interface ChartLegendItem {
  label: string;
  color: string;
  value?: string;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
  layout?: "row" | "column";
  /** Destaca o valor (usado na pizza: "82% Aprovadas"). */
  emphasis?: boolean;
}

/**
 * Legenda sempre presente a partir de 2 séries: a identidade nunca pode
 * depender só da cor. O texto usa tokens de tinta; a cor fica no quadradinho.
 */
export default function ChartLegend({ items, layout = "row", emphasis }: ChartLegendProps) {
  return (
    <ul
      className={cx(
        "chart-legend",
        layout === "column" && "chart-legend--column",
        emphasis && "chart-legend--emphasis"
      )}
    >
      {items.map((item) => (
        <li key={item.label} className="chart-legend__item">
          <span className="chart-legend__swatch" style={{ background: item.color }} aria-hidden="true" />
          {item.value && <span className="chart-legend__value">{item.value}</span>}
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
