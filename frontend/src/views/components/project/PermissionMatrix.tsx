import type { SVGProps } from "react";
import { Badge, Toggle } from "../ui";
import {
  PERMISSION_ACTIONS,
  departmentOf,
  departmentTone,
  roleDisplayName,
} from "../../../models/project";
import type { PermissionAction, RolePermission } from "../../../models/project";
import type { RenaultRole } from "../../../models/roles";

/**
 * Dois glifos que o conjunto de ícones do app ainda não tem: a credencial da
 * coluna "Função" e a silhueta única da coluna "Pessoas". Traçados em
 * currentColor, como os demais.
 */
function RoleGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M6 16a3 3 0 0 1 6 0M15 10h3M15 14h3" />
    </svg>
  );
}

function PersonGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

export interface PermissionMatrixProps {
  rows: RolePermission[];
  onToggle: (role: RenaultRole, action: PermissionAction, value: boolean) => void;
}

/**
 * Tabela "Permissões por Papel".
 *
 * Não usa `DataTable` porque o cabeçalho tem dois níveis — o grupo "Ações"
 * cobrindo três sub-colunas — e `Column` não descreve agrupamento. O resto
 * (Badge, Toggle) é reaproveitado.
 */
export default function PermissionMatrix({ rows, onToggle }: PermissionMatrixProps) {
  return (
    <div className="table-wrap">
      <table className="perm-table">
        <caption className="sr-only">
          Permissões por papel: visualizar, comentar e aprovar F4 deste projeto
        </caption>
        <thead>
          <tr className="perm-table__head">
            <th scope="col">Função</th>
            <th scope="col">Pessoas</th>
            <th scope="col">Departamento</th>
            <th scope="colgroup" colSpan={PERMISSION_ACTIONS.length} className="perm-table__group">
              Ações
            </th>
          </tr>
          <tr className="perm-table__sub">
            {/* células vazias: o design só põe fundo roxo na primeira faixa */}
            <td colSpan={3} className="perm-table__blank" />
            {PERMISSION_ACTIONS.map((action) => (
              <th key={action.id} scope="col" className="perm-table__action">
                {action.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const department = departmentOf(row.role);
            return (
              <tr key={row.role}>
                <th scope="row" className="perm-table__role">
                  <RoleGlyph />
                  {roleDisplayName(row.role)}
                </th>
                <td className="perm-table__people">
                  <PersonGlyph />
                  {row.people}
                </td>
                <td>
                  <Badge tone={departmentTone(department)}>{department}</Badge>
                </td>
                {PERMISSION_ACTIONS.map((action) => (
                  <td key={action.id} className="perm-table__action">
                    <Toggle
                      checked={row.grants[action.id]}
                      onChange={(v) => onToggle(row.role, action.id, v)}
                      label={`${action.label}: ${roleDisplayName(row.role)}`}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
