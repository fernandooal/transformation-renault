export interface User {
  id: number;
  username: string;
  role: string;
  name: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

export interface F4Document {
  id: number;
  title: string;
  supplier: string;
  contract?: string;
  vehicles?: string;
  status: string;
  completion: number;
  version: string;
  value: number;
  currency: string;
  deadline: string;
  owner: string;
  dependsOn?: number[];
  signed: boolean;
  updatedAt: string;
}

export interface Metrics {
  total: number;
  signed: number;
  late: number;
  totalValue: number;
  avgCompletion: number;
  byStatus: Record<string, number>;
}
