import type { Role } from "./roles";

export interface LoginInput {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirm: string;
  role: Role | "";
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  /** Sobrevive à migração: o backend atual ainda é username-only. */
  username?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export type RecoveryStep = "email" | "codigo" | "nova-senha";

export const CODE_LENGTH = 4;
