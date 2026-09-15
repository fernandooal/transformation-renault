import PageHeader from "../components/PageHeader";
import { Card, EmptyState } from "../components/ui";

/** Sem design ainda. Herda tokens e shell; ganha conteúdo quando a tela existir. */
export default function ControleAcessoPage() {
  return (
    <>
      <PageHeader
        title="Controle de acesso"
        subtitle="Usuários, cargos e o que cada um pode fazer em cada etapa da F4."
      />
      <Card padding="none">
        <EmptyState
          title="Tela em construção"
          description="A matriz de permissões dos 7 cargos."
        />
      </Card>
    </>
  );
}
