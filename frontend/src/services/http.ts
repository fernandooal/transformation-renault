import type { User } from "../models/index";

const TOKEN_KEY = "rtd_token";
const USER_KEY = "rtd_user";

export const storage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  getUser(): User | null {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) ?? "null") as User | null;
    } catch {
      return null;
    }
  },
  save(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export async function api<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = storage.getToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    if (res.status === 401) storage.clear();
    throw new Error(data.error || `Erro ${res.status}`);
  }
  return data as T;
}
