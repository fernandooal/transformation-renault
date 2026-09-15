import type { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  children: ReactNode;
  label?: string;
}

export default function Tabs({ items, value, onChange, children, label = "Seções" }: TabsProps) {
  return (
    <div>
      <div className="tabs" role="tablist" aria-label={label}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={value === item.id}
            aria-controls={`panel-${item.id}`}
            tabIndex={value === item.id ? 0 : -1}
            className="tabs__tab"
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => {
              const i = items.findIndex((t) => t.id === value);
              if (e.key === "ArrowRight") onChange(items[(i + 1) % items.length].id);
              if (e.key === "ArrowLeft") onChange(items[(i - 1 + items.length) % items.length].id);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="tabs__panel" role="tabpanel" id={`panel-${value}`} aria-labelledby={`tab-${value}`}>
        {children}
      </div>
    </div>
  );
}
