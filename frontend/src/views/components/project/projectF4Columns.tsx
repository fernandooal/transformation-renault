import { Link } from "react-router-dom";
import { Avatar, StagePills, StatusBadge } from "../ui";
import type { Column } from "../ui";
import { relativeTime } from "../../../utils/datetime";
import { partNumber } from "../../../utils/format";
import { roleMeta } from "../../../models/roles";
import type { F4Summary } from "../../../models/f4";

/**
 * Colunas da tabela de F4 — as mesmas de "Todas as F4's", que o detalhe do
 * projeto reusa sem alterar nada.
 *
 * Nasceu aqui porque `TodasAsF4sPage.tsx` está fora da lista de arquivos que
 * esta fase pode tocar; a definição lá continua idêntica e deve passar a
 * importar deste módulo na primeira oportunidade, para a cópia sumir.
 */

const OUTCOME = {
  concluida: { label: "Concluída", color: "var(--c-green-500)" },
  encerrada: { label: "Encerrada", color: "var(--c-red-700)" },
} as const;

export const F4_COLUMNS: Array<Column<F4Summary>> = [
  {
    key: "part",
    header: "F4 / Peça",
    render: (r) => (
      <span className="cell-primary">
        <Link to={`/f4/${r.id}`} className="cell-primary__title">
          {r.part}
        </Link>
        <span className="cell-primary__meta">
          {r.code} • {r.version}
        </span>
      </span>
    ),
  },
  {
    key: "partNumber",
    header: "Part Number",
    align: "center",
    render: (r) => partNumber(r.partNumber),
  },
  {
    key: "supplier",
    header: "Fornecedor",
    render: (r) => (
      <span className="cell-person">
        <Avatar name={r.supplier.name} size={32} />
        {r.supplier.name}
      </span>
    ),
  },
  {
    key: "flow",
    header: "Fluxo / Voltas",
    align: "center",
    render: (r) => <StagePills done={r.stagesDone} total={r.stagesTotal} returns={r.returns} />,
  },
  {
    key: "responsible",
    header: "Responsável",
    render: (r) =>
      r.outcome ? (
        <span className="cell-person">
          <span
            className="cell-dot"
            style={{ background: OUTCOME[r.outcome].color }}
            aria-hidden="true"
          />
          {OUTCOME[r.outcome].label}
        </span>
      ) : r.responsible ? (
        <span className="cell-person">
          <Avatar name={r.responsible.name} size={32} />
          {r.responsible.name.split(" ")[0]} ({roleMeta(r.responsible.role).short})
        </span>
      ) : (
        <span className="muted small">—</span>
      ),
  },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (r) => <StatusBadge status={r.status} />,
  },
  {
    key: "updated",
    header: "Atualizado",
    align: "center",
    render: (r) => relativeTime(r.updatedAt),
  },
];
