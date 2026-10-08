import PageHeader from "../components/PageHeader";
import { Card, EmptyState } from "../components/ui";
import ProjectCard from "../components/project/ProjectCard";
import { useProjetos } from "../../controllers/useProjetos";

/** Lista de projetos: um card por veículo, com a fita de KPIs do design. */
export default function ProjetosPage() {
  const { rows, query, setQuery, loading, error } = useProjetos();

  return (
    <>
      <PageHeader
        title="Projetos"
        subtitle="Acompanhe os projetos e suas F4"
        search={{ value: query, onChange: setQuery }}
      />

      {error && <p className="error">{error}</p>}

      {rows.length > 0 ? (
        <div className="project-grid">
          {rows.map((project) => (
            <ProjectCard key={project.code} project={project} />
          ))}
        </div>
      ) : (
        !loading && (
          <Card padding="none">
            <EmptyState
              title="Nenhum projeto encontrado"
              description="Ajuste a busca para ver os projetos."
            />
          </Card>
        )
      )}
    </>
  );
}
