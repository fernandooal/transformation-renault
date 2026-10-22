import PageHeader from "../components/PageHeader";
import { Card, EmptyState, Skeleton } from "../components/ui";
import { SupplierCard } from "../components/supplier";
import { useFornecedores } from "../../controllers/useFornecedores";

const SUBTITLE =
  "Veja o histórico de cada fornecedor por F4, além de ver seu desempenho ao longo do tempo: aprovações, recorrência de idas e voltas e padrões de negociação.";

export default function FornecedoresPage() {
  const { suppliers, loading, error } = useFornecedores();

  return (
    <>
      {/* Sem busca e sem ação: o design desta tela não tem nenhuma das duas. */}
      <PageHeader title="Fornecedores" subtitle={SUBTITLE} />

      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="supplier-grid">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card supplier-card supplier-card--loading">
              <Skeleton height="40px" width="60%" />
              <Skeleton height="52px" />
              <Skeleton height="8px" />
              <Skeleton height="34px" />
            </div>
          ))}
        </div>
      ) : suppliers.length === 0 ? (
        <Card padding="none">
          <EmptyState title="Nenhum fornecedor cadastrado" />
        </Card>
      ) : (
        <div className="supplier-grid">
          {suppliers.map((s) => (
            <SupplierCard key={s.id} supplier={s} />
          ))}
        </div>
      )}
    </>
  );
}
