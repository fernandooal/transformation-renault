import { Link } from "react-router-dom";
import { useRecuperarSenha } from "../../controllers/useRecuperarSenha";
import { Button, CodeInput, GlassCard, Modal, PasswordField, TextField } from "../components/ui";
import { Icon } from "../components/icons";
import { CODE_LENGTH } from "../../models/auth";

/** Uma rota, três passos. Estado na URL não vale a pena aqui: o token de reset
 *  não deve viajar em query string. */
function AuthFooterLinks() {
  return (
    <div className="auth-links">
      <span>
        Lembrou da senha? <Link to="/login">Volte para o login</Link>
      </span>
      <span>
        Ainda não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
      </span>
    </div>
  );
}

export default function RecuperarSenhaPage() {
  const s = useRecuperarSenha();

  const title =
    s.step === "email"
      ? "Recuperação de senha"
      : s.step === "codigo"
        ? "Verificação de código"
        : "Nova Senha";

  return (
    <>
      <GlassCard title={title}>
        {s.step === "email" && (
          <form onSubmit={s.sendCode} className="u-stack" style={{ gap: "var(--space-5)" }}>
            <TextField
              label="E-mail"
              type="email"
              value={s.email}
              onChange={s.setEmail}
              tone="onDark"
              variant="inField"
              autoComplete="email"
              required
            />
            {s.error && <p className="field-error field-error--onDark" role="alert">{s.error}</p>}
            <Button type="submit" variant="onDark" size="lg" block loading={s.loading}>
              Enviar Código
            </Button>
          </form>
        )}

        {s.step === "codigo" && (
          <form onSubmit={s.verifyCode} className="u-stack" style={{ gap: "var(--space-5)" }}>
            <p className="auth-hint">Insira o código de verificação</p>
            <CodeInput value={s.code} onChange={s.setCode} length={CODE_LENGTH} autoFocus />
            <p className="auth-hint">
              Se você não recebeu um código, clique
              <br />
              no botão abaixo para <strong>reenviar</strong>
            </p>
            {s.notice && <p className="auth-hint">{s.notice}</p>}
            {s.error && <p className="field-error field-error--onDark" role="alert">{s.error}</p>}
            <Button type="submit" variant="onDark" size="lg" block loading={s.loading}>
              Enviar Código
            </Button>
            <Button type="button" variant="link" onClick={s.resendCode}>
              Reenviar código
            </Button>
          </form>
        )}

        {s.step === "nova-senha" && (
          <form onSubmit={s.submitNewPassword} className="u-stack" style={{ gap: "var(--space-5)" }}>
            <PasswordField
              label="Senha"
              value={s.password}
              onChange={s.setPassword}
              tone="onDark"
              variant="inField"
              autoComplete="new-password"
              required
            />
            <PasswordField
              label="Confirme a senha"
              value={s.confirm}
              onChange={s.setConfirm}
              tone="onDark"
              variant="inField"
              autoComplete="new-password"
              required
            />
            {s.error && <p className="field-error field-error--onDark" role="alert">{s.error}</p>}
            <Button type="submit" variant="onDark" size="lg" block loading={s.loading}>
              Alterar Senha
            </Button>
          </form>
        )}

        <AuthFooterLinks />
      </GlassCard>

      <Modal open={s.successOpen} onClose={s.closeSuccess} title="Senha alterada com sucesso">
        <Icon name="check" size={72} strokeWidth={3} style={{ color: "var(--c-green-500)" }} />
        <h2 className="modal__title">Senha Alterada com Sucesso!</h2>
        <p className="muted">Retorne para o login</p>
        <Button onClick={s.closeSuccess}>Ok</Button>
      </Modal>
    </>
  );
}
