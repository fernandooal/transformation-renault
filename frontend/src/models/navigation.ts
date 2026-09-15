import type { IconName } from "../views/components/icons";

export interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

/** Sidebar do design: 4 itens. "Projetos" entra quando o domínio de projetos existir. */
export const NAV_ITEMS: NavItem[] = [
  { to: "/dashboards", label: "Dashboards", icon: "grid" },
  { to: "/f4", label: "F4's", icon: "file" },
  { to: "/acessos", label: "Controle de acesso", icon: "users" },
  { to: "/fornecedores", label: "Fornecedores", icon: "supplier" },
];
