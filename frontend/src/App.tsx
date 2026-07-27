import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./auth/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DocumentView from "./pages/DocumentView";
import NewF4 from "./pages/NewF4";
import Chatbot from "./components/Chatbot";

function Protected({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const { token } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/f4/nova"
          element={
            <Protected>
              <NewF4 />
            </Protected>
          }
        />
        <Route
          path="/documentos/:id"
          element={
            <Protected>
              <DocumentView />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {token && <Chatbot />}
    </>
  );
}
