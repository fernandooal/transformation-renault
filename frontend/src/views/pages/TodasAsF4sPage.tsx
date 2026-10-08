import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import {
  Avatar,
  Button,
  Card,
  DataTable,
  EmptyState,
  FilterChips,
  StagePills,
  StatusBadge,
  buttonClass,
} from "../components/ui";
import type { Column } from "../components/ui";
import { Icon } from "../components/icons";
import ExportF4Modal from "../components/f4/ExportF4Modal";
import { useF4List } from "../../controllers/useF4List";
import { useF4Table } from "../../controllers/useF4Table";
import { useF4Export } from "../../controllers/useF4Export";
import { shortDateTime } from "../../utils/datetime";
import { money, partNumber } from "../../utils/format";
import { roleMeta } from "../../models/roles";
import type { F4Summary } from "../../models/f4";

const OUTCOME = {
  concluida: { label: "Concluída", color: "var(--c-green-500)" },
  encerrada: { label: "Encerrada", color: "var(--c-red-700)" },
} as const;

const COLUMNS: Array<Column<F4Summary>> = [
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
    render: (r) => <span className="cell-mono">{shortDateTime(r.updatedAt)}</span>,
  },
  {
    key: "gapComercial",
    header: "Gap comercial",
    align: "center",
    render: (r) => <span className="cell-mono">{money(r.gapComercial, "BRL")}</span>,
  },
  {
    key: "gapTecnico",
    header: "Gap técnico",
    align: "center",
    render: (r) => <span className="cell-mono">{money(r.gapTecnico, "BRL")}</span>,
  },
];

const DEFAULT_ORDER = COLUMNS.map((c) => c.key);

export default function TodasAsF4sPage() {
  const navigate = useNavigate();
  const { all, rows, counts, filters, activeFilter, setActiveFilter, query, setQuery, error } =
    useF4List();
  const exporter = useF4Export(all, rows);
  const table = useF4Table(DEFAULT_ORDER);
  const orderedColumns = table.order
    .map((k) => COLUMNS.find((c) => c.key === k))
    .filter((c): c is Column<F4Summary> => Boolean(c));

  return (
    <>
      <PageHeader
        title="Todas as F4's"
        subtitle="Veja como anda o fluxo de cada F4 aqui. Clique e veja o fluxo completo de cada uma"
        search={{ value: query, onChange: setQuery }}
        actions={
          <Link to="/f4/nova" className={buttonClass("primary")}>
            <Icon name="plus" size={18} /> Nova F4
          </Link>
        }
      />

      <FilterChips
        items={filters.map((f) => ({ id: f.id, label: f.label, count: counts[f.id] ?? 0 }))}
        value={activeFilter}
        onChange={setActiveFilter}
        trailing={
          <>
            <Button
              variant="ghost"
              size="sm"
              disabled={!table.dirty}
              onClick={table.reset}
            >
              Redefinir
            </Button>
          <Button
            className="btn--onFilterBar"
            icon={<Icon name="download" size={18} />}
            onClick={() => exporter.setOpen(true)}
          >
            Exportar
          </Button>
          </>
        }
      />

      {exporter.selectionMode && (
        <div className="selection-bar">
          <span className="selection-bar__count">
            {exporter.selected.size}{" "}
            {exporter.selected.size === 1 ? "F4 selecionada" : "F4's selecionadas"}
          </span>
          <Button variant="ghost" onClick={exporter.cancelSelection}>
            Cancelar
          </Button>
          <Button
            icon={<Icon name="download" size={18} />}
            onClick={() => exporter.setOpen(true)}
            disabled={exporter.selected.size === 0}
          >
            Exportar seleção
          </Button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <Card padding="none">
        <DataTable
          caption="Lista de F4"
          sort={{
            key: table.sortKey,
            dir: table.sortDir,
            onSort: table.toggleSort,
            onMove: table.moveColumn,
          }}
          columns={orderedColumns}
          rows={table.sortRows(rows)}
          getRowKey={(r) => r.id}
          onRowClick={(r) => navigate(`/f4/${r.id}`)}
          selection={
            exporter.selectionMode
              ? {
                  selected: exporter.selected,
                  onToggle: (r) => exporter.toggle(r.id),
                  onToggleAll: exporter.toggleAll,
                  rowLabel: (r) => `Selecionar ${r.code}`,
                }
              : undefined
          }
          empty={
            <EmptyState
              title="Nenhuma F4 encontrada"
              description="Ajuste a busca ou troque o filtro de status."
            />
          }
        />
      </Card>

      <ExportF4Modal x={exporter} />
    </>
  );
}
