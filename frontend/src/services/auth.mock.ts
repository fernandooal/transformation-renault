/**
 * Mock de cadastro e recuperação de senha.
 *
 * Motivo: o backend atual só tem POST /api/auth/login (por username) e
 * GET /api/auth/me. Cadastro, envio de código e reset não existem, e o backend
 * está fora do escopo desta fase. As assinaturas são idênticas às do
 * auth.service para que a troca seja de uma linha quando a API existir.
 */
import type { AuthSession, RegisterInput } from "../models/auth";
import { ROLE_META } from "../models/roles";
import type { Role } from "../models/roles";

/** Código fixo da DEMO — o design mostra 1790 na tela de verificação. */
export const MOCK_CODE = "1790";

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

export async function register(input: RegisterInput): Promise<AuthSession> {
  await delay();
  const role = (input.role || "PFE") as Role;
  return {
    token: `mock.${btoa(input.email)}.${Date.now()}`,
    user: {
      id: Date.now(),
      name: input.name,
      email: input.email,
      role: ROLE_META[role].id,
      username: input.email,
    },
  };
}

export async function requestPasswordReset(email: string): Promise<{ ok: true }> {
  await delay();
  console.info(`[mock] código de verificação para ${email}: ${MOCK_CODE}`);
  return { ok: true };
}

export async function verifyResetCode(
  _email: string,
  code: string
): Promise<{ resetToken: string }> {
  await delay();
  if (code !== MOCK_CODE) {
    throw new Error("Código inválido. Confira o e-mail e tente de novo.");
  }
  return { resetToken: `mock-reset.${Date.now()}` };
}

export async function resetPassword(_token: string, password: string): Promise<{ ok: true }> {
  await delay();
  if (password.length < 6) throw new Error("A senha precisa de ao menos 6 caracteres.");
  return { ok: true };
}
