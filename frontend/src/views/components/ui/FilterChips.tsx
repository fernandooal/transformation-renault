import type { ReactNode } from "react";

export interface FilterChipItem {
  id: string;
  label: string;
  count?: number;
}

export interface FilterChipsProps {
  items: FilterChipItem[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
  /** Ações no fim da barra, alinhadas à direita. */
  trailing?: ReactNode;
}

export default function FilterChips({
  items,
  value,
  onChange,
  label = "Filtrar por status",
  trailing,
}: FilterChipsProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__chips" role="group" aria-label={label}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="chip"
            aria-pressed={value === item.id}
            onClick={() => onChange(item.id)}
          >
            {item.label}
            {item.count !== undefined && <span className="chip__count">{item.count}</span>}
          </button>
        ))}
      </div>
      {trailing && <div className="filter-bar__trailing">{trailing}</div>}
    </div>
  );
}
