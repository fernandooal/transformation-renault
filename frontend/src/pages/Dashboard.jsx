import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api("/api/documents")
      .then((data) => setDocuments(data.documents))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="page">
      <header className="topbar">
        <h1>
          Renault <span>Transformation Day</span>
        </h1>
        <div className="topbar-right">
          <span className="muted">
            {user?.name} — cargo: <strong>{user?.role}</strong>
          </span>
          <button className="ghost" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <main>
        <h2>Documentos F4</h2>
        <p className="muted">
          Termos contratuais de compra de materiais com terceiros. (Lista de demonstração —
          estrutura definitiva do F4 será definida posteriormente.)
        </p>
        {error && <p className="error">{error}</p>}
        <ul className="doc-list">
          {documents.map((doc) => (
            <li key={doc.id}>
              <Link to={`/documentos/${doc.id}`}>
                <strong>{doc.title}</strong>
                <span className="muted">
                  {doc.supplier} · atualizado em {doc.updatedAt}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
