import { Router } from "express";
import bcrypt from "bcryptjs";
import { findByUsername, findById, toPublic } from "../users/store.ts";
import { signToken } from "./jwt.ts";
import { requireAuth } from "./middleware.ts";

export function authRouter(): Router {
  const router = Router();

  router.post("/login", (req, res) => {
    const { username, password } = (req.body ?? {}) as {
      username?: unknown;
      password?: unknown;
    };
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Informe usuário e senha." });
    }
    const user = findByUsername(username);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: "Usuário ou senha inválidos." });
    }
    return res.json({ token: signToken(user), user: toPublic(user) });
  });

  router.get("/me", requireAuth, (req, res) => {
    const user = findById(req.user!.sub);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
    return res.json({ user: toPublic(user) });
  });

  return router;
}
