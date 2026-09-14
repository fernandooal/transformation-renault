import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthContext";
import { isEmail, required } from "../utils/validation";

export function useLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // O backend ainda aceita username; só exigimos formato de e-mail quando
    // o valor parece um e-mail, para a credencial `demo` continuar entrando.
    if (!required(email) || !required(password)) {
      setError("Preencha e-mail e senha.");
      return;
    }
    if (email.includes("@") && !isEmail(email)) {
      setError("E-mail inválido.");
      return;
    }

    setLoading(true);
    try {
      await login({ email, password, remember });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return { email, setEmail, password, setPassword, remember, setRemember, error, loading, submit };
}
