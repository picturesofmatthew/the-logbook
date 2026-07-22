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

// ── Session cookie ──
// The cookie is `${token}.${hmac(token)}`. The HMAC lets the edge proxy confirm
// we issued the token without a DB hit; the token's sha256 (hashToken) is the
// key into the sessions table, where validity/expiry/revocation live. All Web
// Crypto, so these run identically at the edge and on the server.

export async function signToken(token: string): Promise<string> {
  return `${token}.${await hmac(token)}`;
}

// Returns the raw token iff the cookie carries our signature, else null. Split
// on the LAST dot (the token is opaque hex; the sig is base64url — no dots).
export async function readToken(
  cookieValue: string | undefined,
): Promise<string | null> {
  if (!cookieValue) return null;
  const dot = cookieValue.lastIndexOf(".");
  if (dot <= 0) return null;
  const token = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);
  if (!token || !sig) return null;
  return timingSafeEqual(sig, await hmac(token)) ? token : null;
}

// sha256(token) as hex — the DB key. Only this hash is stored, so a DB leak
// alone can't reconstruct a usable cookie (which also needs the HMAC).
export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(token));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
