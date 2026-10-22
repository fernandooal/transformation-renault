import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Breadcrumb, Card, EmptyState, SearchInput, SectionTitle } from "../components/ui";
import PermissionMatrix from "../components/project/PermissionMatrix";
import { useProjetoPermissoes } from "../../controllers/useProjetoPermissoes";

/**
 * Gerenciar Permissões.
 *
 * Os interruptores da matriz mexem só no estado local do hook: não existe
 * endpoint de gravação, então nada é persistido e um reload volta ao seed.
 */
export default function ProjetoPermissoesPage() {
  const { id = "" } = useParams();
  const { project, roles, toggle, userQuery, setUserQuery, error } = useProjetoPermissoes(id);

  const projectLabel = `Projeto ${project?.code ?? id}`;

  // Código inexistente na URL: não dá para renderizar a tela como se existisse.
  if (!project) {
    return (
      <>
        <PageHeader title="Projeto não encontrado" back={{ to: "/projetos", label: "Ver projetos" }} />
        <Card padding="none">
          <EmptyState
            title="Esse projeto não existe"
            description={`Nenhum projeto com o código "${id}".`}
          />
        </Card>
      </>
    );
  }

  return (
    <>
      {/* Sem a busca global do cabeçalho: o design a desenha aqui, mas nesta
          tela ela não teria o que filtrar. A busca que existe é a de usuários,
          logo abaixo da matriz. */}
      <PageHeader title={projectLabel} />

      <div className="project-subhead">
        <Breadcrumb
          items={[
            { label: "Projetos", to: "/projetos" },
            { label: projectLabel, to: `/projetos/${id}` },
            { label: "Gerenciar Permissões" },
          ]}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <SectionTitle>Permissões por Papel</SectionTitle>
      <Card padding="none" className="perm-card">
        <PermissionMatrix rows={roles} onToggle={toggle} />
      </Card>

      <div className="project-section-head">
        <SectionTitle>Usuários e Permissões</SectionTitle>
        <SearchInput
          value={userQuery}
          onChange={setUserQuery}
          placeholder="busque um usuário aqui..."
          label="Buscar usuário"
        />
      </div>

      <Card padding="none" className="perm-users">
        <EmptyState
          title="Lista de usuários ainda não desenhada"
          description="A permissão individual por usuário entra quando o design e o endpoint existirem. Por ora, vale a matriz por papel acima."
        />
      </Card>
    </>
  );
}
