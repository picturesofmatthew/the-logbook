import { cache } from "react";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles, sessions } from "@/db/schema";
import {
  SESSION_COOKIE,
  hashToken,
  readToken,
  signToken,
  type Slot,
} from "./auth";

export type CurrentUser = {
  userId: string;
  bondId: string;
  slot: Slot;
  displayName: string;
};

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

// Resolve the signed-in user from the session cookie: verify the HMAC, look the
// token's hash up in the sessions table, check expiry, and join the profile's
// bond + slot. Returns null (never redirects) so the layout can render /enter.
// Memoized per request, so repeated calls cost one lookup.
export const getSessionUser = cache(async (): Promise<CurrentUser | null> => {
  const cookieValue = (await cookies()).get(SESSION_COOKIE)?.value;
  const token = await readToken(cookieValue);
  if (!token) return null;
  const [row] = await db
    .select({
      profileId: sessions.profileId,
      expiresAt: sessions.expiresAt,
      bondId: profiles.bondId,
      slot: profiles.slot,
      displayName: profiles.displayName,
    })
    .from(sessions)
    .innerJoin(profiles, eq(sessions.profileId, profiles.id))
    .where(eq(sessions.tokenHash, await hashToken(token)));
  if (!row || row.expiresAt.getTime() < Date.now()) return null;
  return {
    userId: row.profileId,
    bondId: row.bondId,
    slot: row.slot,
    displayName: row.displayName,
  };
});

// The authed user — the trust anchor for every gated page/action. Fails closed
// to /enter. Identity is always re-derived server-side, never trusted from input.
export async function currentUser(): Promise<CurrentUser> {
  const user = await getSessionUser();
  if (!user) redirect("/enter");
  return user;
}

// Back-compat thin alias: the acting user's id. Prefer currentUser() where the
// bond or slot is also needed.
export async function currentProfile(): Promise<string> {
  return (await currentUser()).userId;
}

// Mint a session for a profile (after a verified login): store the token's hash,
// set the signed cookie. The raw token exists only in the cookie.
export async function createSession(profileId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessions).values({
    tokenHash: await hashToken(token),
    profileId,
    expiresAt,
  });
  (await cookies()).set(SESSION_COOKIE, await signToken(token), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

// End the current session (logout): delete the row (instant revocation) + clear
// the cookie.
export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = await readToken(jar.get(SESSION_COOKIE)?.value);
  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, await hashToken(token)));
  }
  jar.delete(SESSION_COOKIE);
}
