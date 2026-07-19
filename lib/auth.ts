// Session tokens: `${profile}.${hmac(profile)}`, signed with AUTH_SECRET.
// Web Crypto only, so the same code runs in the proxy (edge) and server actions.

export const SESSION_COOKIE = "logbook_session";

export const PROFILES = ["matthew", "kennedy"] as const;
export type Profile = (typeof PROFILES)[number];

export function isProfile(value: unknown): value is Profile {
  return PROFILES.includes(value as Profile);
}

const encoder = new TextEncoder();

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return s;
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

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signSession(profile: Profile): Promise<string> {
  return `${profile}.${await hmac(profile)}`;
}

export async function verifySession(
  token: string | undefined,
): Promise<Profile | null> {
  if (!token) return null;
  const [profile, sig] = token.split(".");
  if (!isProfile(profile) || !sig) return null;
  return timingSafeEqual(sig, await hmac(profile)) ? profile : null;
}
