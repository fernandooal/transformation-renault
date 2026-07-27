import { verifyToken } from "./jwt.js";

/** Exige um Bearer token válido; popula req.user com o payload do JWT. */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Autenticação necessária." });
  }
  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Sessão inválida ou expirada." });
  }
}

/**
 * RBAC: exige que o usuário autenticado tenha um dos cargos informados.
 * Hoje só existe o cargo "Demo"; "admin", "user" etc. entram aqui no futuro.
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Autenticação necessária." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Acesso negado para o seu cargo." });
    }
    return next();
  };
}
