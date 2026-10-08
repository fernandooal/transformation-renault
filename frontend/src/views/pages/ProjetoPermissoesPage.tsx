import PageHeader from "../components/PageHeader";
import { Card, EmptyState } from "../components/ui";

/** Esqueleto — preenchido na fase correspondente do plano. */
export default function ProjetoPermissoesPage() {
  return (
    <>
      <PageHeader title="Gerenciar Permissões" subtitle="Quem pode ver, comentar e aprovar" />
      <Card padding="none">
        <EmptyState title="Tela em construção" />
      </Card>
    </>
  );
}
