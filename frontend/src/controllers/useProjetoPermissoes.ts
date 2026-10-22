import { useCallback, useEffect, useState } from "react";
import * as ProjectService from "../services/project.service";
import { setGrant } from "../models/project";
import type { PermissionAction, ProjectSummary, RolePermission } from "../models/project";
import type { RenaultRole } from "../models/roles";

/**
 * Matriz de permissões do projeto.
 *
 * ATENÇÃO: `toggle` altera APENAS o estado local desta tela. Não existe
 * endpoint de gravação de permissões no backend, então nada é persistido —
 * recarregar a página volta ao seed. Quando a API existir, `toggle` passa a
 * fazer o PATCH otimista e reverte em caso de erro.
 */
export function useProjetoPermissoes(code: string) {
  const [project, setProject] = useState<ProjectSummary | null>(null);
  const [roles, setRoles] = useState<RolePermission[]>([]);
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([ProjectService.detail(code), ProjectService.permissions(code)])
      .then(([p, rows]) => {
        if (!alive) return;
        setProject(p);
        setRoles(rows);
      })
      .catch((err: Error) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [code]);

  const toggle = useCallback(
    (role: RenaultRole, action: PermissionAction, value: boolean) => {
      setRoles((prev) => setGrant(prev, role, action, value));
    },
    []
  );

  return { project, roles, toggle, userQuery, setUserQuery, loading, error };
}
