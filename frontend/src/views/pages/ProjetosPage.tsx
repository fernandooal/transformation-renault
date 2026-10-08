import PageHeader from "../components/PageHeader";
import { Card, EmptyState } from "../components/ui";

/** Esqueleto — preenchido na fase correspondente do plano. */
export default function ProjetosPage() {
  return (
    <>
      <PageHeader title="Projetos" subtitle="Acompanhe os projetos e suas F4" />
      <Card padding="none">
        <EmptyState title="Tela em construção" />
      </Card>
    </>
  );
}
