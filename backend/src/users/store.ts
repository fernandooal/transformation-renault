import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import type { PublicUser, User } from "../types.ts";

const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

/** Garante que o arquivo de usuários exista, criando o usuário seed da DEMO. */
export function ensureSeed(): void {
  if (fs.existsSync(USERS_FILE)) return;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const users: User[] = [
    {
      id: 1,
      username: "demo",
      passwordHash: bcrypt.hashSync("demo123", 10),
      role: "Demo",
      name: "Usuário Demo",
    },
  ];
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log("[users] Seed criado: demo / demo123 (cargo Demo)");
}

function readUsers(): User[] {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8")) as User[];
}

export function findByUsername(username: string): User | null {
  return readUsers().find((u) => u.username === username) ?? null;
}

export function findById(id: number): User | null {
  return readUsers().find((u) => u.id === id) ?? null;
}

/** Remove campos sensíveis antes de enviar ao frontend. */
export function toPublic(user: User): PublicUser {
  const { passwordHash, ...pub } = user;
  return pub;
}
