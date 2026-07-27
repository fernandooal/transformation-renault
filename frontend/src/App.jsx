import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DocumentView from "./pages/DocumentView.jsx";
import NewF4 from "./pages/NewF4.jsx";
import Chatbot from "./components/Chatbot.jsx";

function Protected({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
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
