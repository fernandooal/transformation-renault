import { Link } from "react-router-dom";
import { useLogin } from "../../controllers/useLogin";
import { Button, Checkbox, GlassCard, PasswordField, TextField } from "../components/ui";

export default function LoginPage() {
  const { email, setEmail, password, setPassword, remember, setRemember, error, loading, submit } =
    useLogin();

  return (
    <GlassCard title="Seja Bem-Vindo!">
      <form onSubmit={submit} className="u-stack" style={{ gap: "var(--space-5)" }}>
        <TextField
          label="E-mail"
          /* type="text" de propósito: o backend ainda autentica por username, e
             a credencial da DEMO é `demo`. Com type="email" o navegador bloqueia
             o submit antes de o onSubmit rodar. O formato de e-mail é validado
             em useLogin, mas só quando o valor contém "@". Voltar para
             type="email" quando o login por e-mail for real no backend. */
          type="text"
          inputMode="email"
          value={email}
          onChange={setEmail}
          tone="onDark"
          variant="inField"
          autoComplete="username"
          required
        />
        <PasswordField
          label="Senha"
          value={password}
          onChange={setPassword}
          tone="onDark"
          variant="inField"
          required
        />
        <Checkbox label="Lembre de mim" checked={remember} onChange={setRemember} tone="onDark" />

        {error && <p className="field-error field-error--onDark" role="alert">{error}</p>}

        <Button type="submit" variant="onDark" size="lg" block loading={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="auth-links">
        <Link to="/recuperar-senha">Esqueci minha senha</Link>
        <span>
          É novo por aqui? <Link to="/cadastro">Cadastre-se</Link>
        </span>
      </div>
    </GlassCard>
  );
}
