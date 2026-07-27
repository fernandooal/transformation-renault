import jwt from "jsonwebtoken";
import config from "../config.ts";
import type { JwtUserPayload, User } from "../types.ts";

export function signToken(user: User): string {
  const payload: JwtUserPayload = { sub: user.id, username: user.username, role: user.role };
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): JwtUserPayload {
  return jwt.verify(token, config.jwtSecret) as unknown as JwtUserPayload;
}
