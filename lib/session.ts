import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { SESSION_COOKIE, verifySession, type Slot } from "./auth";

export type CurrentUser = {
  userId: string;
  bondId: string;
  slot: Slot;
  displayName: string;
};

// The signed-in user, their bond, and their slot — the trust anchor for every
// authed page/action. Memoized per request, so repeated calls cost one lookup.
// Fails closed: no valid session → /enter; a user with no bond/slot yet
// (shouldn't happen post-backfill) → /enter too, since they can't act without a
// bond. Identity is always re-derived server-side, never trusted from input.
export const currentUser = cache(async (): Promise<CurrentUser> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = await verifySession(token);
  if (!userId) redirect("/enter");
  const [row] = await db
    .select({
      bondId: profiles.bondId,
      slot: profiles.slot,
      displayName: profiles.displayName,
    })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!row || !row.bondId || !row.slot) redirect("/enter");
  return {
    userId,
    bondId: row.bondId,
    slot: row.slot,
    displayName: row.displayName,
  };
});

// Back-compat thin alias: the acting user's id. Prefer currentUser() where the
// bond or slot is also needed (most write actions now do).
export async function currentProfile(): Promise<string> {
  return (await currentUser()).userId;
}
