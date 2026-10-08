import Card from "../ui/Card";
import AttentionList from "../AttentionList";
import type { SupplierF4 } from "../../../models/supplier";

export interface SupplierHistoryCardProps {
  items: SupplierF4[];
}

/**
 * "Histórico de F4's" — no design é o mesmo componente do "Precisa da sua
 * atenção" do dashboard, então reaproveita `AttentionList` inteiro. O que este
 * wrapper acrescenta é só a moldura (título, canto) e o scroll interno.
 */
export default function SupplierHistoryCard({ items }: SupplierHistoryCardProps) {
  return (
    <Card title="Histórico de F4's" corner="ordenado por urgência" padding="none">
      <div className="supplier-history" tabIndex={0} role="group" aria-label="Histórico de F4's">
        <AttentionList items={items} />
      </div>
    </Card>
  );
}
