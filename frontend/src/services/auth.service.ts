import { api } from "./http";
import type { User } from "../models/index";

export function login(username: string, password: string): Promise<{ token: string; user: User }> {
  return api<{ token: string; user: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}
