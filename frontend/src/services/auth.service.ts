import { api } from "./http";
import * as Mock from "./auth.mock";
import type { AuthSession, AuthUser, LoginInput, RegisterInput } from "../models/auth";

/**
 * O backend ainda autentica por `username`, mas o design exige e-mail.
 * Enquanto isso, mandamos os dois campos e normalizamos a resposta aqui —
 * este é o ÚNICO ponto do frontend que conhece a divergência.
 */
const LEGACY_USERNAME_LOGIN = true;

const useMock = (import.meta.env.VITE_MOCK_AUTH ?? "true") !== "false";

interface RawUser {
  id: number;
  name: string;
  role: string;
  email?: string;
  username?: string;
}

export function toUser(raw: RawUser): AuthUser {
  return {
    id: raw.id,
    name: raw.name,
    role: raw.role,
    email: raw.email ?? raw.username ?? "",
    username: raw.username,
  };
}

export async function login(input: LoginInput): Promise<AuthSession> {
  const body = LEGACY_USERNAME_LOGIN
    ? { email: input.email, username: input.email, password: input.password }
    : { email: input.email, password: input.password };

  const data = await api<{ token: string; user: RawUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return { token: data.token, user: toUser(data.user) };
}

export async function me(): Promise<{ user: AuthUser }> {
  const data = await api<{ user: RawUser }>("/api/auth/me");
  return { user: toUser(data.user) };
}

export async function register(input: RegisterInput): Promise<AuthSession> {
  if (useMock) return Mock.register(input);
  const data = await api<{ token: string; user: RawUser }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return { token: data.token, user: toUser(data.user) };
}

export async function requestPasswordReset(email: string): Promise<{ ok: true }> {
  if (useMock) return Mock.requestPasswordReset(email);
  return api<{ ok: true }>("/api/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyResetCode(email: string, code: string): Promise<{ resetToken: string }> {
  if (useMock) return Mock.verifyResetCode(email, code);
  return api<{ resetToken: string }>("/api/auth/password/verify", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function resetPassword(resetToken: string, password: string): Promise<{ ok: true }> {
  if (useMock) return Mock.resetPassword(resetToken, password);
  return api<{ ok: true }>("/api/auth/password/reset", {
    method: "POST",
    body: JSON.stringify({ resetToken, password }),
  });
}
