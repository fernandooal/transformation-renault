import type { SupplierMetric } from "../../../models/supplier";

export interface SupplierMetricsProps {
  items: SupplierMetric[];
}

/**
 * Os três círculos de métrica do card. São gráfico: a cor classifica, mas o
 * valor e o rótulo estão em texto, então cada círculo já se lê sem a cor.
 * A `<dl>` dá a relação rótulo/valor para o leitor de tela.
 */
export default function SupplierMetrics({ items }: SupplierMetricsProps) {
  return (
    <dl className="supplier-metrics">
      {items.map((m) => (
        <div key={m.id} className={`supplier-dial supplier-dial--${m.tint}`}>
          <dd className="supplier-dial__value">{m.value}</dd>
          <dt className="supplier-dial__label">{m.label}</dt>
        </div>
      ))}
    </dl>
  );
}
