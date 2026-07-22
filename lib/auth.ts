// Session tokens: `${userId}.${hmac(userId)}`, signed with AUTH_SECRET. The user
// id is app-generated + globally unique, so a valid signature is itself
// sufficient proof of identity — no allowlist. Web Crypto only, so the same code
// runs in the proxy (edge) and server actions.

export const SESSION_COOKIE = "logbook_session";

// The two sides of a bond. Which user holds which slot is runtime data on the
// bond (see lib/bond.ts), not a fixed identity — this replaces the old
// two-keeper `Profile` union. The engine already composes the seal from moss +
// ember, so the data layer keys per-person state by Slot to match.
export const SLOTS = ["moss", "ember"] as const;
export type Slot = (typeof SLOTS)[number];

export function partnerSlot(slot: Slot): Slot {
  return slot === "moss" ? "ember" : "moss";
}

const encoder = new TextEncoder();

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return s;
}

export async function hmacDigest(value: string): Promise<string> {
  return hmac(value);
}

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(value)),
  );
  let bin = "";
  for (const b of sig) bin += String.fromCharCode(b);
  return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signSession(userId: string): Promise<string> {
  return `${userId}.${await hmac(userId)}`;
}

// A valid signature proves we issued this id — sufficient identity, no allowlist
// (ids are globally unique). Split on the LAST dot so the id stays opaque.
export async function verifySession(
  token: string | undefined,
): Promise<string | null> {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const userId = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!userId || !sig) return null;
  return timingSafeEqual(sig, await hmac(userId)) ? userId : null;
}
