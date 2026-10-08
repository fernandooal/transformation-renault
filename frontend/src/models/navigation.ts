import type { IconName } from "../views/components/icons";

export interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

/**
 * Sidebar do design: 4 itens. "Controle de acesso" saiu — a matriz de
 * permissões vive em Projeto > Gerenciar Permissões.
 */
export const NAV_ITEMS: NavItem[] = [
  { to: "/dashboards", label: "Dashboards", icon: "grid" },
  { to: "/f4", label: "F4's", icon: "file" },
  { to: "/projetos", label: "Projetos", icon: "users" },
  { to: "/fornecedores", label: "Fornecedores", icon: "supplier" },
];
