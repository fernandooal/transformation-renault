import type { AuthUser } from "../models/auth";

/**
 * Chaves com sufixo _v2: o payload de usuário ganhou `email`, e uma sessão
 * antiga (sem o campo) faria a sidebar imprimir "undefined".
 */
const TOKEN_KEY = "rtd_token_v2";
const USER_KEY = "rtd_user_v2";
const PERSIST_KEY = "rtd_persist";

/** "Lembre de mim" marcado -> localStorage; desmarcado -> sessionStorage. */
function stores(): Storage[] {
  return [localStorage, sessionStorage];
}

function readAny(key: string): string | null {
  for (const store of stores()) {
    try {
      const value = store.getItem(key);
      if (value !== null) return value;
    } catch {
      /* modo privado ou site data bloqueado */
    }
  }
  return null;
}

export const storage = {
  getToken(): string | null {
    return readAny(TOKEN_KEY);
  },
  getUser(): AuthUser | null {
    try {
      return JSON.parse(readAny(USER_KEY) ?? "null") as AuthUser | null;
    } catch {
      return null;
    }
  },
  save(token: string, user: AuthUser, remember: boolean): void {
    this.clear();
    const target = remember ? localStorage : sessionStorage;
    try {
      target.setItem(TOKEN_KEY, token);
      target.setItem(USER_KEY, JSON.stringify(user));
      if (remember) localStorage.setItem(PERSIST_KEY, "1");
    } catch {
      /* sem persistência: a sessão vive só em memória */
    }
  },
  clear(): void {
    for (const store of stores()) {
      try {
        store.removeItem(TOKEN_KEY);
        store.removeItem(USER_KEY);
        store.removeItem(PERSIST_KEY);
      } catch {
        /* ignora */
      }
    }
  },
};

/**
 * Handler de 401. Antes o token era apagado mas ninguém redirecionava, e a tela
 * ficava mostrando erro com a sessão já morta.
 */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: (() => void) | null): void {
  onUnauthorized = fn;
}

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
    if (res.status === 401) {
      storage.clear();
      onUnauthorized?.();
    }
    throw new Error(data.error || `Erro ${res.status}`);
  }
  return data as T;
}
