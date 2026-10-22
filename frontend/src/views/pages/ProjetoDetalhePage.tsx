import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Breadcrumb, Card, DataTable, EmptyState, FilterChips, buttonClass } from "../components/ui";
import { Icon } from "../components/icons";
import { F4_COLUMNS } from "../components/project/projectF4Columns";
import { useProjetoDetalhe } from "../../controllers/useProjetoDetalhe";

/** Detalhe do projeto: a tabela de "Todas as F4's" escopada num projeto. */
export default function ProjetoDetalhePage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { project, rows, counts, filters, activeFilter, setActiveFilter, query, setQuery, error } =
    useProjetoDetalhe(id);

  const title = `Projeto ${project?.code ?? id}`;

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
      <PageHeader title={title} search={{ value: query, onChange: setQuery }} />

      <div className="project-subhead">
        <Breadcrumb items={[{ label: "Projetos", to: "/projetos" }, { label: title }]} />
        <Link to={`/projetos/${id}/permissoes`} className={buttonClass("primary")}>
          Gerenciar Permissões <Icon name="users" size={18} />
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      <FilterChips
        items={filters.map((f) => ({ id: f.id, label: f.label, count: counts[f.id] ?? 0 }))}
        value={activeFilter}
        onChange={setActiveFilter}
      />

      <Card padding="none">
        <DataTable
          caption={`F4 do projeto ${project?.code ?? id}`}
          columns={F4_COLUMNS}
          rows={rows}
          getRowKey={(r) => r.id}
          onRowClick={(r) => navigate(`/f4/${r.id}`)}
          empty={
            <EmptyState
              title="Nenhuma F4 neste projeto"
              description="Ajuste a busca ou troque o filtro de status."
            />
          }
        />
      </Card>
    </>
  );
}
