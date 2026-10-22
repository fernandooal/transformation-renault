import { Link } from "react-router-dom";
import SupplierAvatar from "./SupplierAvatar";
import SupplierMetrics from "./SupplierMetrics";
import OutcomeBar from "./OutcomeBar";
import type { SupplierSummary } from "../../../models/supplier";

export interface SupplierCardProps {
  supplier: SupplierSummary;
}

/** Card do grid `/fornecedores`. O card inteiro é o link para o detalhe. */
export default function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <Link to={`/fornecedores/${supplier.id}`} className="card supplier-card">
      <header className="supplier-card__head">
        <SupplierAvatar initials={supplier.initials} tint={supplier.tint} />
        <span className="supplier-card__ident">
          <h2 className="supplier-card__name">{supplier.name}</h2>
          <span className="supplier-card__place">
            {supplier.city} • {supplier.uf}
          </span>
        </span>
      </header>

      <SupplierMetrics items={supplier.metrics} />

      <p className="supplier-card__legend">
        <span>Distribuição de resultado</span>
        <span>{supplier.outcomePeriod}</span>
      </p>

      <OutcomeBar outcome={supplier.outcome} period={supplier.outcomePeriod} />

      <p className="supplier-card__insight">
        {supplier.insight}
        {supplier.insightHighlight && (
          <>
            {" "}
            <strong>{supplier.insightHighlight}</strong>
          </>
        )}
      </p>
    </Link>
  );
}
