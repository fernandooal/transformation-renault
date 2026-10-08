import PageHeader from "../components/PageHeader";
import { Card, EmptyState } from "../components/ui";

/** Esqueleto — preenchido na fase correspondente do plano. */
export default function ProjetoDetalhePage() {
  return (
    <>
      <PageHeader title="Projeto" subtitle="F4 do projeto" />
      <Card padding="none">
        <EmptyState title="Tela em construção" />
      </Card>
    </>
  );
}
