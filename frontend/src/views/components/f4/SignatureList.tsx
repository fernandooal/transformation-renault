import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import { Icon } from "../icons";
import { cx } from "../../../utils/cx";
import { relativeTime } from "../../../utils/datetime";
import { roleMeta } from "../../../models/roles";
import type { F4Signature } from "../../../models/f4";

export interface SignatureListProps {
  signatures: F4Signature[];
  /** Próximo da fila, destacado como "assinando agora". */
  next: F4Signature | null;
}

export default function SignatureList({ signatures, next }: SignatureListProps) {
  const ordered = [...signatures].sort((a, b) => a.order - b.order);

  return (
    <ul className="signatures">
      {ordered.map((s) => {
        const isNext = next?.order === s.order;
        return (
          <li
            key={s.order}
            className={cx("signature", s.signedAt && "is-signed", isNext && "is-next")}
          >
            <span className="signature__mark">
              {s.signedAt ? <Icon name="check" size={16} strokeWidth={2.6} /> : s.order}
            </span>
            <Avatar name={s.signer.name} size={32} />
            <span className="signature__name">{s.signer.name}</span>
            <Badge tone="purple" className="badge-pill--role" size="sm">
              {s.signer.role === "SUPPLIER" ? "Fornecedor" : roleMeta(s.signer.role).short}
            </Badge>
            <span className="signature__when">
              {s.signedAt
                ? `Assinou ${relativeTime(s.signedAt).toLowerCase()}`
                : isNext
                  ? "Assinando agora"
                  : "Aguardando"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
