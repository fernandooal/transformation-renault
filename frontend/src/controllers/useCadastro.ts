import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthContext";
import type { RegisterInput } from "../models/auth";
import { isEmail, minLength, passwordsMatch, required } from "../utils/validation";

type Errors = Partial<Record<keyof RegisterInput, string>>;

const EMPTY: RegisterInput = { name: "", email: "", password: "", confirm: "", role: "" };

export function useCadastro() {
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterInput>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  function setField<K extends keyof RegisterInput>(key: K, value: RegisterInput[K]): void {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!required(form.name)) next.name = "Informe seu nome.";
    if (!isEmail(form.email)) next.email = "E-mail inválido.";
    if (!minLength(form.password, 6)) next.password = "Mínimo de 6 caracteres.";
    if (!passwordsMatch(form.password, form.confirm)) next.confirm = "As senhas não conferem.";
    if (!form.role) next.role = "Selecione o tipo de usuário.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return { form, setField, errors, error, loading, remember, setRemember, submit };
}
