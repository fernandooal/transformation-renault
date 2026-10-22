import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./views/components/ProtectedRoute";
import AuthLayout from "./views/layouts/AuthLayout";
import AppLayout from "./views/layouts/AppLayout";
import LoginPage from "./views/pages/LoginPage";
import CadastroPage from "./views/pages/CadastroPage";
import RecuperarSenhaPage from "./views/pages/RecuperarSenhaPage";
import DashboardsPage from "./views/pages/DashboardsPage";
import TodasAsF4sPage from "./views/pages/TodasAsF4sPage";
import F4DetailPage from "./views/pages/F4DetailPage";
import DocumentViewPage from "./views/pages/DocumentViewPage";
import NewF4Page from "./views/pages/NewF4Page";
import ProjetosPage from "./views/pages/ProjetosPage";
import ProjetoDetalhePage from "./views/pages/ProjetoDetalhePage";
import ProjetoPermissoesPage from "./views/pages/ProjetoPermissoesPage";
import FornecedoresPage from "./views/pages/FornecedoresPage";
import FornecedorDetalhePage from "./views/pages/FornecedorDetalhePage";
import UiKitPage from "./views/pages/UiKitPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboards" replace />} />
        <Route path="/dashboards" element={<DashboardsPage />} />

        <Route path="/f4" element={<TodasAsF4sPage />} />
        <Route path="/f4/nova" element={<NewF4Page />} />
        <Route path="/f4/:id" element={<F4DetailPage />} />
        <Route path="/f4/:id/pdf" element={<DocumentViewPage />} />

        <Route path="/projetos" element={<ProjetosPage />} />
        <Route path="/projetos/:id" element={<ProjetoDetalhePage />} />
        <Route path="/projetos/:id/permissoes" element={<ProjetoPermissoesPage />} />

        <Route path="/fornecedores" element={<FornecedoresPage />} />
        <Route path="/fornecedores/:id" element={<FornecedorDetalhePage />} />

        {/* rotas legadas */}
        <Route path="/acessos" element={<Navigate to="/projetos" replace />} />
        <Route path="/documentos/:id" element={<Navigate to="/f4" replace />} />
      </Route>

      {import.meta.env.DEV && <Route path="/__ui" element={<UiKitPage />} />}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
