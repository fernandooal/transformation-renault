import PageHeader from "../components/PageHeader";
import { Card, EmptyState } from "../components/ui";

/** Esqueleto — preenchido na fase correspondente do plano. */
export default function FornecedorDetalhePage() {
  return (
    <>
      <PageHeader title="Fornecedor" subtitle="Relatório do fornecedor" />
      <Card padding="none">
        <EmptyState title="Tela em construção" />
      </Card>
    </>
  );
}
