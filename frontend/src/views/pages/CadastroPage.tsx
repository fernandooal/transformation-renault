import { Link } from "react-router-dom";
import { useCadastro } from "../../controllers/useCadastro";
import { Button, Checkbox, GlassCard, PasswordField, Select, TextField } from "../components/ui";
import { ROLE_OPTIONS } from "../../models/roles";
import type { Role } from "../../models/roles";

export default function CadastroPage() {
  const { form, setField, errors, error, loading, remember, setRemember, submit } = useCadastro();

  return (
    <GlassCard title="Cadastre-se">
      <form onSubmit={submit} className="u-stack" style={{ gap: "var(--space-4)" }}>
        <TextField
          label="Nome"
          value={form.name}
          onChange={(v) => setField("name", v)}
          tone="onDark"
          variant="inField"
          autoComplete="name"
          error={errors.name}
          required
        />
        <TextField
          label="E-mail"
          type="email"
          value={form.email}
          onChange={(v) => setField("email", v)}
          tone="onDark"
          variant="inField"
          autoComplete="email"
          error={errors.email}
          required
        />
        <PasswordField
          label="Senha"
          value={form.password}
          onChange={(v) => setField("password", v)}
          tone="onDark"
          variant="inField"
          autoComplete="new-password"
          error={errors.password}
          required
        />
        <PasswordField
          label="Confirme a senha"
          value={form.confirm}
          onChange={(v) => setField("confirm", v)}
          tone="onDark"
          variant="inField"
          autoComplete="new-password"
          error={errors.confirm}
          required
        />
        <Select
          label="Tipo de usuário"
          value={form.role}
          onChange={(v) => setField("role", v as Role)}
          options={ROLE_OPTIONS}
          placeholder="Selecione o tipo de usuário"
          tone="onDark"
          variant="inField"
          error={errors.role}
          required
        />
        <Checkbox label="Lembre de mim" checked={remember} onChange={setRemember} tone="onDark" />

        {error && <p className="field-error field-error--onDark" role="alert">{error}</p>}

        <Button type="submit" variant="onDark" size="lg" block loading={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>

      <div className="auth-links">
        <span>
          Já tem uma conta? <Link to="/login">Volte para o login</Link>
        </span>
      </div>
    </GlassCard>
  );
}
