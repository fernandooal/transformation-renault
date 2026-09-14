import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import { cx } from "../../../utils/cx";
import { relativeTime } from "../../../utils/datetime";
import { roleMeta } from "../../../models/roles";
import type { F4HistoryEntry } from "../../../models/f4";

const BODY_VARIANT: Partial<Record<F4HistoryEntry["kind"], string>> = {
  return: "timeline__body--return",
  checkpoint: "timeline__body--checkpoint",
};

export default function HistoryTimeline({ entries }: { entries: F4HistoryEntry[] }) {
  if (entries.length === 0) {
    return <p className="muted">Nenhum evento registrado nesta F4 ainda.</p>;
  }

  return (
    <ul className="timeline">
      {entries.map((e) => (
        <li key={e.id} className="timeline__entry">
          <Avatar name={e.author.name} size={32} className="timeline__avatar" />
          <div>
            <div className="timeline__head">
              <span className="timeline__author">{e.author.name}</span>
              <Badge tone="purple" className="badge-pill--role" size="sm">
                {e.author.role === "SUPPLIER" ? "Fornecedor" : roleMeta(e.author.role).short}
              </Badge>
              <span className="timeline__when">{relativeTime(e.at)}</span>
            </div>
            <p className={cx("timeline__body", BODY_VARIANT[e.kind])}>{e.body}</p>
            {e.tag && (
              <Badge tone={e.tagTone ?? "neutral"} size="sm" className="timeline__tag">
                {e.tag}
              </Badge>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
