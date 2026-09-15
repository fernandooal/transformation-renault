import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./views/components/ProtectedRoute";
import AuthLayout from "./views/layouts/AuthLayout";
import AppLayout from "./views/layouts/AppLayout";
import LoginPage from "./views/pages/LoginPage";
import CadastroPage from "./views/pages/CadastroPage";
import RecuperarSenhaPage from "./views/pages/RecuperarSenhaPage";
import DashboardsPage from "./views/pages/DashboardsPage";
import TodasAsF4sPage from "./views/pages/TodasAsF4sPage";
import DocumentViewPage from "./views/pages/DocumentViewPage";
import F4DetailPage from "./views/pages/F4DetailPage";
import NewF4Page from "./views/pages/NewF4Page";
import ControleAcessoPage from "./views/pages/ControleAcessoPage";
import FornecedoresPage from "./views/pages/FornecedoresPage";
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
        <Route path="/acessos" element={<ControleAcessoPage />} />
        <Route path="/fornecedores" element={<FornecedoresPage />} />
        {/* rota legada */}
        <Route path="/documentos/:id" element={<Navigate to="/f4" replace />} />
      </Route>

      {import.meta.env.DEV && <Route path="/__ui" element={<UiKitPage />} />}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
