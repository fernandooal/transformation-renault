import type { NextFunction, Request, RequestHandler, Response } from "express";
import { verifyToken } from "./jwt.ts";
import type { JwtUserPayload } from "../types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

/** Exige um Bearer token válido; popula req.user com o payload do JWT. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ error: "Autenticação necessária." });
    return;
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Sessão inválida ou expirada." });
  }
}

/**
 * RBAC: exige que o usuário autenticado tenha um dos cargos informados.
 * Hoje só existe o cargo "Demo"; "admin", "user" etc. entram aqui no futuro.
 */
export function requireRole(...roles: string[]): RequestHandler {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: "Autenticação necessária." });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Acesso negado para o seu cargo." });
      return;
    }
    next();
  };
}
