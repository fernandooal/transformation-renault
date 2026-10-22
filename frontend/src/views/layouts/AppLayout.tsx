import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";
import { Icon } from "../components/icons";
import { useSidebar } from "../../controllers/useSidebar";
import { cx } from "../../utils/cx";

export default function AppLayout() {
  const { collapsed, toggle } = useSidebar();

  return (
    <div className={cx("app-layout", collapsed && "app-layout--collapsed")}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <Sidebar />

      <button
        type="button"
        className="sidebar-toggle"
        onClick={toggle}
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        aria-expanded={!collapsed}
      >
        <Icon name="chevronDown" size={20} strokeWidth={2.4} />
      </button>

      <main className="app-layout__main" id="conteudo" tabIndex={-1}>
        <div className="app-layout__inner">
          <Outlet />
        </div>
      </main>
      <Chatbot />
    </div>
  );
}
