import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// At-rest encryption for consumer-health data (private notes, mood, weight).
// AES-256-GCM (authenticated) with a server key in env (ENCRYPTION_KEY, 32
// bytes / 64 hex chars). Node-only (server actions + data layer) — never the
// edge. Stored form is `iv.tag.ciphertext`, each base64url. Non-deterministic
// (random IV per write), which is fine — we never query by these values.
//
// E2E for notes is a deliberate later step; this is the "encrypt at rest"
// baseline WA MHMDA + GDPR Art. 9 call for.
function key(): Buffer {
  const k = process.env.ENCRYPTION_KEY;
  if (!k) throw new Error("ENCRYPTION_KEY is not set");
  const buf = Buffer.from(k, "hex");
  if (buf.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
  }
  return buf;
}

export function encrypt(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${ct.toString("base64url")}`;
}

// Decrypt; returns null on any malformed/failed input so a read never crashes a
// page (a key mismatch shows empty, not a stack trace).
export function decrypt(stored: string): string | null {
  const [ivB, tagB, ctB] = stored.split(".");
  if (!ivB || !tagB || ctB == null) return null;
  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key(),
      Buffer.from(ivB, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tagB, "base64url"));
    return Buffer.concat([
      decipher.update(Buffer.from(ctB, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
}

// Nullable helpers for optional columns.
export function encryptOrNull(v: string | null | undefined): string | null {
  return v == null || v === "" ? null : encrypt(v);
}

export function decryptOrNull(v: string | null | undefined): string | null {
  return v == null ? null : decrypt(v);
}
