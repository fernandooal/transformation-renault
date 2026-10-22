import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Breadcrumb, Card, EmptyState, KpiCard, Skeleton } from "../components/ui";
import { Icon } from "../components/icons";
import {  SupplierHistoryCard } from "../components/supplier";
import { useFornecedorDetalhe } from "../../controllers/useFornecedorDetalhe";

const SUBTITLE =
  "Veja um relatório de cada fornecedor aqui: aprovações, recorrência de idas e voltas e padrões de negociação.";

export default function FornecedorDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, notFound } = useFornecedorDetalhe(id);

  if (notFound) {
    return (
      <>
        <PageHeader title="Fornecedor" subtitle={SUBTITLE} />
        <Breadcrumb
          items={[{ label: "Fornecedores", to: "/fornecedores" }, { label: "Não encontrado" }]}
        />
        <Card padding="none">
          <EmptyState
            title="Fornecedor não encontrado"
            description="Ele pode ter sido removido, ou o link está errado."
          />
        </Card>
      </>
    );
  }

  return (
    <>
      {/* Sem busca e sem ação: o design desta tela não tem nenhuma das duas. */}
      <PageHeader title={data?.supplier.name ?? "Fornecedor"} subtitle={SUBTITLE} />

      <Breadcrumb
        items={[
          { label: "Fornecedores", to: "/fornecedores" },
          { label: data?.supplier.name ?? "…" },
        ]}
      />

      {error && <p className="error">{error}</p>}

      <div className="kpi-grid">
        {loading || !data
          ? [0, 1, 2, 3].map((i) => (
              <div key={i} className="card kpi">
                <Skeleton height="18px" width="60%" />
                <Skeleton height="52px" />
                <Skeleton height="14px" width="45%" />
              </div>
            ))
          : data.kpis.map((k) => (
              <KpiCard
                key={k.id}
                label={k.label}
                value={k.value}
                icon={k.icon ? <Icon name={k.icon} size={56} strokeWidth={1.5} /> : undefined}
                hint={k.delta?.text}
                hintTone={k.delta?.tone}
              />
            ))}
      </div>

      {data ? (
        <SupplierHistoryCard items={data.history} />
      ) : (
        <Card title="Histórico de F4's" corner="ordenado por urgência" padding="none">
          <div style={{ padding: "var(--space-6)" }}>
            <Skeleton height="220px" />
          </div>
        </Card>
      )}
    </>
  );
}
