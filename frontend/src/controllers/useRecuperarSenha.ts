import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as AuthService from "../services/auth.service";
import { CODE_LENGTH, type RecoveryStep } from "../models/auth";
import { isEmail, minLength, passwordsMatch } from "../utils/validation";

export function useRecuperarSenha() {
  const navigate = useNavigate();
  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  async function run(fn: () => Promise<void>) {
    setError(null);
    setLoading(true);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setLoading(false);
    }
  }

  function sendCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isEmail(email)) return setError("E-mail inválido.");
    void run(async () => {
      await AuthService.requestPasswordReset(email);
      setNotice(null);
      setStep("codigo");
    });
  }

  function resendCode() {
    void run(async () => {
      await AuthService.requestPasswordReset(email);
      setNotice("Código reenviado.");
    });
  }

  function verifyCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (code.length !== CODE_LENGTH) return setError(`Digite os ${CODE_LENGTH} dígitos.`);
    void run(async () => {
      const { resetToken: token } = await AuthService.verifyResetCode(email, code);
      setResetToken(token);
      setNotice(null);
      setStep("nova-senha");
    });
  }

  function submitNewPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!minLength(password, 6)) return setError("A senha precisa de ao menos 6 caracteres.");
    if (!passwordsMatch(password, confirm)) return setError("As senhas não conferem.");
    void run(async () => {
      await AuthService.resetPassword(resetToken, password);
      setSuccessOpen(true);
    });
  }

  function closeSuccess() {
    setSuccessOpen(false);
    navigate("/login");
  }

  return {
    step,
    email,
    setEmail,
    code,
    setCode,
    password,
    setPassword,
    confirm,
    setConfirm,
    error,
    notice,
    loading,
    successOpen,
    sendCode,
    resendCode,
    verifyCode,
    submitNewPassword,
    closeSuccess,
  };
}
