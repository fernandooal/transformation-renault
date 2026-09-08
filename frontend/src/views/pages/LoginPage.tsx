import { useLogin } from "../../controllers/useLogin";

export default function LoginPage() {
  const { username, setUsername, password, setPassword, error, loading, submit } = useLogin();

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h1>
          Renault <span>Transformation Day</span>
        </h1>
        <p className="muted">Acesso à DEMO — documentação F4</p>
        <label>
          Usuário
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <p className="muted small">Demo: usuário `demo` / senha `demo123`</p>
      </form>
    </div>
  );
}
