import { useId } from "react";
import Button from "./ui/Button";
import { Icon } from "./icons";
import type { DashboardFilter, DashboardOptions } from "../../models/dashboard";

export interface DashboardFiltersProps {
  filter: DashboardFilter;
  options: DashboardOptions;
  onChange: <K extends keyof DashboardFilter>(key: K, value: DashboardFilter[K]) => void;
  onClear: () => void;
  /** Quantas F4 sobraram no recorte, para dar retorno imediato. */
  matched: number;
  active: boolean;
}

/**
 * Recorte do dashboard. Fica na mesma faixa roxa dos chips da lista de F4,
 * para a linguagem de filtro ser a mesma nas duas telas.
 */
export default function DashboardFilters({
  filter,
  options,
  onChange,
  onClear,
  matched,
  active,
}: DashboardFiltersProps) {
  const projectId = useId();
  const supplierId = useId();

  return (
    <div className="filter-bar dash-filters">
      <div className="dash-filters__fields">
        <span className="dash-filters__field">
          <label htmlFor={projectId}>Carro</label>
          <span className="dash-filters__control">
            <select
              id={projectId}
              value={filter.project}
              onChange={(e) => onChange("project", e.target.value)}
            >
              <option value="">Todos os carros</option>
              {options.projects.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={16} />
          </span>
        </span>

        <span className="dash-filters__field">
          <label htmlFor={supplierId}>Fornecedor</label>
          <span className="dash-filters__control">
            <select
              id={supplierId}
              value={filter.supplier}
              onChange={(e) => onChange("supplier", e.target.value)}
            >
              <option value="">Todos os fornecedores</option>
              {options.suppliers.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={16} />
          </span>
        </span>
      </div>

      <span className="dash-filters__result" role="status">
        {matched} {matched === 1 ? "F4 no recorte" : "F4 no recorte"}
      </span>

      {active && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
