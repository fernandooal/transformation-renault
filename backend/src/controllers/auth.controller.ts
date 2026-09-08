import type { Request, Response } from "express";
import * as Users from "../models/user.model.ts";
import { signToken } from "../services/token.service.ts";

export function login(req: Request, res: Response): Response {
  const { username, password } = (req.body ?? {}) as {
    username?: unknown;
    password?: unknown;
  };
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Informe usuário e senha." });
  }
  const user = Users.findByUsername(username);
  if (!user || !Users.checkPassword(user, password)) {
    return res.status(401).json({ error: "Usuário ou senha inválidos." });
  }
  return res.json({ token: signToken(user), user: Users.toPublic(user) });
}

export function me(req: Request, res: Response): Response {
  const user = Users.findById(req.user!.sub);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
  return res.json({ user: Users.toPublic(user) });
}
