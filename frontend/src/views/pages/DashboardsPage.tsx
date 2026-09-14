import { Link } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import AttentionList from "../components/AttentionList";
import { Card, KpiCard, SectionTitle, Skeleton, buttonClass } from "../components/ui";
import { PieChart, StackedBarChart } from "../components/charts";
import { Icon } from "../components/icons";
import { useDashboard } from "../../controllers/useDashboard";
import type { Kpi } from "../../models/dashboard";

function KpiRow({ items, loading }: { items: Kpi[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="kpi-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card kpi">
            <Skeleton height="18px" width="60%" />
            <Skeleton height="52px" />
            <Skeleton height="14px" width="45%" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="kpi-grid">
      {items.map((k) => (
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
  );
}

export default function DashboardsPage() {
  const { greeting, firstName, data, loading, error } = useDashboard();
  const [query, setQuery] = useState("");

  return (
    <>
      <PageHeader
        title={`${greeting}, ${firstName}`}
        search={{ value: query, onChange: setQuery }}
        actions={
          <Link to="/f4/nova" className={buttonClass("primary")}>
            <Icon name="plus" size={18} /> Nova F4
          </Link>
        }
      />

      {error && <p className="error">{error}</p>}

      <KpiRow items={data?.kpis ?? []} loading={loading} />

      <div className="split-grid">
        <Card title="Onde as F4 estão paradas" footer={data?.queuesNote}>
          {data ? (
            <StackedBarChart
              caption="Filas de F4 por etapa do fluxo"
              categories={data.queues.map((q) => ({
                label: q.label,
                values: { analise: q.emAnalise, devolvida: q.devolvida, aprovada: q.aprovada },
              }))}
              series={[
                { key: "analise", label: "Em análise", color: "var(--c-purple-300)" },
                { key: "devolvida", label: "Devolvida", color: "var(--c-blue-400)" },
                { key: "aprovada", label: "Aprovada", color: "var(--c-teal-300)" },
              ]}
            />
          ) : (
            <Skeleton height="220px" />
          )}
        </Card>

        <Card title="Precisa da sua atenção" corner="ordenado por urgência" padding="none">
          {data ? <AttentionList items={data.attention} /> : <Skeleton height="220px" />}
        </Card>
      </div>

      <SectionTitle>Minhas F4</SectionTitle>

      <KpiRow items={data?.myKpis ?? []} loading={loading} />

      <div className="half-grid">
        <Card title="Voltas por mês" corner="técnicas vs. comerciais" footer={data?.monthlyNote}>
          {data ? (
            <StackedBarChart
              caption="Devoluções por mês, técnicas e comerciais"
              categories={data.monthlyReturns.map((m) => ({
                label: m.month,
                values: { tecnica: m.tecnicas, comercial: m.comerciais },
              }))}
              series={[
                { key: "tecnica", label: "Devolução técnica", color: "var(--c-orange-600)" },
                { key: "comercial", label: "Devolução comercial", color: "var(--c-orange-300)" },
              ]}
            />
          ) : (
            <Skeleton height="220px" />
          )}
        </Card>

        <Card title="Resultado das F4">
          {data ? (
            <PieChart
              caption="Distribuição das F4 por resultado"
              slices={data.outcome.map((o) => ({
                id: o.id,
                label: o.label,
                value: o.percent,
                color:
                  o.id === "aprovadas"
                    ? "var(--c-green-500)"
                    : o.id === "andamento"
                      ? "var(--c-blue-600)"
                      : "var(--c-orange-500)",
              }))}
            />
          ) : (
            <Skeleton height="220px" />
          )}
        </Card>
      </div>
    </>
  );
}
