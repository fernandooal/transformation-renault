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
}

export default function FilterChips({
  items,
  value,
  onChange,
  label = "Filtrar por status",
}: FilterChipsProps) {
  return (
    <div className="filter-bar" role="group" aria-label={label}>
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
  );
}
