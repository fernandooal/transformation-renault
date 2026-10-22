import { Link } from "react-router-dom";
import { Icon } from "../icons";
import { int, percent, signed } from "../../../utils/format";
import type { ProjectSummary } from "../../../models/project";
import type { IconName } from "../icons";

type TileTone = "purple" | "orange" | "green" | "yellow";

interface Tile {
  /** O design quebra o rótulo em peso forte + parêntese leve. */
  label: string;
  note?: string;
  value: string;
  tone: TileTone;
  icon?: IconName;
}

function tilesOf(p: ProjectSummary): Tile[] {
  return [
    { label: "F4's Ativas", value: int(p.kpis.activeF4), tone: "purple", icon: "docsStack" },
    {
      label: "Voltas",
      note: "(média)",
      value: int(p.kpis.avgReturns),
      tone: "orange",
      icon: "arrowsUpDown",
    },
    { label: "Aprovadas", value: percent(p.kpis.approvedPct), tone: "green" },
    { label: "Diferença $", value: `${signed(p.kpis.costDeltaPct)}%`, tone: "yellow" },
  ];
}

/**
 * Card da lista de projetos: faixa roxa com o código e, colada nela, a fita de
 * quatro tiles de KPI — contíguos, sem raio entre si, como no design.
 * O card inteiro é o link para o detalhe.
 */
export default function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      to={`/projetos/${project.code}`}
      className="project-card"
      aria-label={`Projeto ${project.code} ${project.name}`}
    >
      <div className="project-card__head">
        <span className="project-card__code">{project.code}</span>
      </div>

      <div className="project-card__tiles">
        {tilesOf(project).map((tile) => (
          <div key={tile.label} className={`project-tile project-tile--${tile.tone}`}>
            <span className="project-tile__label">
              {tile.label}
              {tile.note && <small> {tile.note}</small>}
            </span>
            <span className="project-tile__body">
              {tile.icon && <Icon name={tile.icon} size={44} strokeWidth={1.5} />}
              <span className="project-tile__value">{tile.value}</span>
            </span>
          </div>
        ))}
      </div>
    </Link>
  );
}
