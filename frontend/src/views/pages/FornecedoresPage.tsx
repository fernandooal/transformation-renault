import PageHeader from "../components/PageHeader";
import { Card, EmptyState } from "../components/ui";

/** Sem design ainda. */
export default function FornecedoresPage() {
  return (
    <>
      <PageHeader
        title="Fornecedores"
        subtitle="Empresas que preenchem e reenviam as F4."
      />
      <Card padding="none">
        <EmptyState
          title="Tela em construção"
          description="O Figma ainda não tem esta tela."
        />
      </Card>
    </>
  );
}
