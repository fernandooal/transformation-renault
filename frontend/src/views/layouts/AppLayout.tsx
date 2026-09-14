import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Sidebar />
      <main className="app-layout__main" id="conteudo" tabIndex={-1}>
        <div className="app-layout__inner">
          <Outlet />
        </div>
      </main>
      <Chatbot />
    </div>
  );
}
