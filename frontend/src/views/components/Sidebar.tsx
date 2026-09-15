import { NavLink } from "react-router-dom";
import BrandLockup from "./BrandLockup";
import Avatar from "./ui/Avatar";
import IconButton from "./ui/IconButton";
import { Icon } from "./icons";
import { NAV_ITEMS } from "../../models/navigation";
import { useAuth } from "../../controllers/AuthContext";
import { ROLE_META } from "../../models/roles";
import type { Role } from "../../models/roles";

function roleLabel(role: string | undefined): string {
  if (!role) return "Usuário";
  return ROLE_META[role as Role]?.short ?? role;
}

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <BrandLockup size="sm" />
      </div>

      <nav className="sidebar__nav" aria-label="Navegação principal">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "sidebar__item is-active" : "sidebar__item"
            }
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__user">
        <Avatar name={user?.name} size={40} />
        <span className="sidebar__user-info">
          <span className="sidebar__user-name">{user?.email || user?.name || "usuário"}</span>
          <span className="sidebar__user-role">{roleLabel(user?.role)}</span>
        </span>
        <IconButton label="Sair" icon={<Icon name="logout" size={22} />} onClick={logout} />
      </div>
    </aside>
  );
}
