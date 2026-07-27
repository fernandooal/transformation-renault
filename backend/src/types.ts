/** Tipos compartilhados do backend. */

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: string;
  name: string;
}

export type PublicUser = Omit<User, "passwordHash">;

/** Payload gravado no JWT. */
export interface JwtUserPayload {
  sub: number;
  username: string;
  role: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Documento F4 — estrutura provisória; será formalizada com o banco de dados. */
export interface F4Document {
  id: number;
  title: string;
  supplier: string;
  status: string;
  completion: number;
  version: string;
  value: number;
  currency: string;
  deadline: string;
  owner: string;
  dependsOn: number[];
  signed: boolean;
  updatedAt: string;
  file: string;
  [extra: string]: unknown;
}
