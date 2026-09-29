import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";

export interface Column<T> {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  render: (row: T) => ReactNode;
}

export interface TableSelection<T> {
  selected: Set<string | number>;
  onToggle: (row: T) => void;
  onToggleAll: () => void;
  rowLabel?: (row: T) => string;
}

export interface DataTableProps<T> {
  columns: Array<Column<T>>;
  rows: T[];
  getRowKey: (row: T) => string | number;
  /**
   * Atalho de mouse. Não vira ponto de foco: uma <tr> focável com onClick é
   * anunciada de forma confusa por leitor de tela. Quem usa isto deve colocar
   * um <Link> dentro da linha como alvo de teclado.
   */
  onRowClick?: (row: T) => void;
  /** Coluna de checkbox à esquerda. Ausente, a tabela é a de sempre. */
  selection?: TableSelection<T>;
  empty?: ReactNode;
  caption?: string;
}

export default function DataTable<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  selection,
  empty,
  caption,
}: DataTableProps<T>) {
  const allRef = useRef<HTMLInputElement>(null);
  const picked = selection ? rows.filter((r) => selection.selected.has(getRowKey(r))).length : 0;

  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = picked > 0 && picked < rows.length;
  }, [picked, rows.length]);

  return (
    <div className="table-wrap">
      <table className="data-table">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {selection && (
              <th scope="col" className="data-table__select">
                <input
                  ref={allRef}
                  type="checkbox"
                  checked={rows.length > 0 && picked === rows.length}
                  onChange={selection.onToggleAll}
                  aria-label="Selecionar todas as linhas"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className={col.align ? `align-${col.align}` : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = getRowKey(row);
            const checked = selection?.selected.has(key) ?? false;
            return (
              <tr
                key={key}
                className={cx(onRowClick && "is-clickable", checked && "is-selected")}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {selection && (
                  <td className="data-table__select" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => selection.onToggle(row)}
                      aria-label={selection.rowLabel?.(row) ?? `Selecionar linha ${key}`}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className={col.align ? `align-${col.align}` : undefined}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
          {rows.length === 0 && empty && (
            <tr>
              <td colSpan={columns.length + (selection ? 1 : 0)}>{empty}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
