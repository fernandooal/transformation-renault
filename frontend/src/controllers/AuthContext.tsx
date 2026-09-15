import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { setUnauthorizedHandler, storage } from "../services/http";
import * as AuthService from "../services/auth.service";
import type { AuthSession, AuthUser, LoginInput, RegisterInput } from "../models/auth";

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(storage.getToken());
  const [user, setUser] = useState<AuthUser | null>(storage.getUser());
  const navigate = useNavigate();

  function adopt(session: AuthSession, remember: boolean): void {
    storage.save(session.token, session.user, remember);
    setToken(session.token);
    setUser(session.user);
    navigate("/");
  }

  function logout(): void {
    storage.clear();
    setToken(null);
    setUser(null);
    navigate("/login");
  }

  // 401 em qualquer chamada derruba a sessão e volta para o login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null);
      setUser(null);
      navigate("/login");
    });
    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  async function login(input: LoginInput): Promise<void> {
    adopt(await AuthService.login(input), input.remember);
  }

  async function register(input: RegisterInput): Promise<void> {
    adopt(await AuthService.register(input), true);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  }
  return ctx;
}
