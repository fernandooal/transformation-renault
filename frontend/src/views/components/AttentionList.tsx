import { Link } from "react-router-dom";
import { Icon } from "./icons";
import StatusBadge from "./ui/StatusBadge";
import type { AttentionItem } from "../../models/dashboard";

export interface AttentionListProps {
  items: AttentionItem[];
}

export default function AttentionList({ items }: AttentionListProps) {
  if (items.length === 0) {
    return <p className="muted small" style={{ padding: "var(--space-6)" }}>Nada parado esperando você.</p>;
  }

  return (
    <ul className="attention">
      {items.map((item) => (
        <li key={item.id} className="attention__row">
          <span className="attention__icon" aria-hidden="true">
            <Icon name="returnArrow" size={18} strokeWidth={2} />
          </span>
          <span className="attention__body">
            <Link to={`/f4/${item.id}`} className="attention__title">
              {item.code} {item.part}
            </Link>
            <span className="attention__reason">
              {item.reason} — parado há {Math.round(item.stalledHours / 24)} dias
            </span>
          </span>
          <StatusBadge status={item.status} size="sm" />
        </li>
      ))}
    </ul>
  );
}
