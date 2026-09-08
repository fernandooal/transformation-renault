import { Link } from "react-router-dom";
import { useAuth } from "../../controllers/AuthContext";
import { STATUSES, useDocuments } from "../../controllers/useDocuments";

const STATUS_CLASS: Record<string, string> = {
  Draft: "draft",
  "In approval": "review",
  Signed: "signed",
  Late: "late",
};

const money = (value: number, currency = "EUR") =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { visible, metrics, status, setStatus, query, setQuery, error } = useDocuments();

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
        <div className="section-head">
          <div>
            <h2>Documentos F4</h2>
            <p className="muted small">
              F4 sheet — Cost of Modification. Modificações contratuais com fornecedores.
            </p>
          </div>
          <Link to="/f4/nova" className="button-like">
            + Nova F4
          </Link>
        </div>

        {metrics && (
          <div className="metrics">
            <div className="metric">
              <span className="metric-value">{metrics.total}</span>
              <span className="muted small">F4 ativas</span>
            </div>
            <div className="metric">
              <span className="metric-value">{money(metrics.totalValue)}</span>
              <span className="muted small">Impacto total</span>
            </div>
            <div className="metric">
              <span className="metric-value">{metrics.avgCompletion}%</span>
              <span className="muted small">Conclusão média</span>
            </div>
            <div className="metric">
              <span className="metric-value">{metrics.signed}</span>
              <span className="muted small">Assinadas</span>
            </div>
            <div className="metric metric-alert">
              <span className="metric-value">{metrics.late}</span>
              <span className="muted small">Atrasadas</span>
            </div>
          </div>
        )}

        <div className="filters">
          <input
            placeholder="Buscar por título, fornecedor ou ECO ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {error && <p className="error">{error}</p>}

        <ul className="doc-list">
          {visible.map((doc) => (
            <li key={doc.id}>
              <Link to={`/documentos/${doc.id}`}>
                <div className="doc-head">
                  <strong>{doc.title}</strong>
                  <span className={`badge ${STATUS_CLASS[doc.status] || ""}`}>
                    {doc.status}
                  </span>
                </div>
                <span className="muted small">
                  {doc.supplier} · {doc.contract} · {doc.version} · {doc.vehicles} · {money(doc.value, doc.currency)} · prazo{" "}
                  {doc.deadline}
                  {doc.dependsOn && doc.dependsOn.length > 0 &&
                    ` · depende da F4 #${doc.dependsOn.join(", #")}`}
                </span>
                <div className="progress" title={`${doc.completion}% concluído`}>
                  <div style={{ width: `${doc.completion}%` }} />
                </div>
                <span className="muted small">
                  {doc.completion}% concluído · {doc.owner} · atualizado em {doc.updatedAt}
                  {doc.signed ? " · assinado digitalmente" : ""}
                </span>
              </Link>
            </li>
          ))}
          {visible.length === 0 && <p className="muted">Nenhuma F4 encontrada.</p>}
        </ul>
      </main>
    </div>
  );
}
