export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: string;
  name: string;
}

export type PublicUser = Omit<User, "passwordHash">;

export interface JwtUserPayload {
  sub: number;
  username: string;
  role: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

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

export type PublicF4Document = Omit<F4Document, "file">;

export interface CreateF4Input {
  titleOfModification?: string;
  supplier?: string;
  f4Version?: string;
  totalImpact?: number | string;
  offerCurrency?: string;
  deadline?: string;
  renaultF4Manager?: string;
  [extra: string]: unknown;
}

export interface F4Metrics {
  total: number;
  signed: number;
  late: number;
  totalValue: number;
  avgCompletion: number;
  byStatus: Record<string, number>;
}
