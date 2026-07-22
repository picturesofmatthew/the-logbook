import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

// Password hashing with scrypt (node:crypto — no dependency, runs in the Node
// server-action runtime, never the edge). Stored form is `salt:derivedKey`,
// both hex. Verification is constant-time.
const scryptAsync = promisify(scrypt);
const KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
  return `${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, keyHex] = stored.split(":");
  if (!salt || !keyHex) return false;
  const key = Buffer.from(keyHex, "hex");
  const derived = (await scryptAsync(password, salt, key.length)) as Buffer;
  return key.length === derived.length && timingSafeEqual(key, derived);
}
