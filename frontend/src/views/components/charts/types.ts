/** Cores sempre como `var(--token)` — nenhum hex chega aqui. */
export interface ChartSeries {
  key: string;
  label: string;
  color: string;
}

export interface ChartCategory {
  label: string;
  values: Record<string, number>;
}

export interface PieSlice {
  id: string;
  label: string;
  value: number;
  color: string;
}
