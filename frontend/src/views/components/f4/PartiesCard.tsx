import Card from "../ui/Card";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import { roleMeta } from "../../../models/roles";
import type { Person } from "../../../models/f4";

export default function PartiesCard({ parties }: { parties: Person[] }) {
  return (
    <Card title="Partes Envolvidas">
      {parties.map((p) => (
        <div key={p.id} className="party">
          <Avatar name={p.name} size={40} />
          <span className="party__name">{p.name}</span>
          <Badge tone="purple" className="badge-pill--role" size="sm">
            {p.role === "SUPPLIER" ? "Fornecedor" : roleMeta(p.role).short}
          </Badge>
        </div>
      ))}
    </Card>
  );
}
