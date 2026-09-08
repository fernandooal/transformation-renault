import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./controllers/AuthContext";
import ProtectedRoute from "./views/components/ProtectedRoute";
import Chatbot from "./views/components/Chatbot";
import LoginPage from "./views/pages/LoginPage";
import DashboardPage from "./views/pages/DashboardPage";
import DocumentViewPage from "./views/pages/DocumentViewPage";
import NewF4Page from "./views/pages/NewF4Page";

export default function App() {
  const { token } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/f4/nova"
          element={
            <ProtectedRoute>
              <NewF4Page />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documentos/:id"
          element={
            <ProtectedRoute>
              <DocumentViewPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {token && <Chatbot />}
    </>
  );
}
