import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";

export interface Column<T> {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  render: (row: T) => ReactNode;
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
  empty?: ReactNode;
  caption?: string;
}

export default function DataTable<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  empty,
  caption,
}: DataTableProps<T>) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
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
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className={cx(onRowClick && "is-clickable")}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} className={col.align ? `align-${col.align}` : undefined}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && empty && (
            <tr>
              <td colSpan={columns.length}>{empty}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
