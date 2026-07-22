import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { SLOTS, partnerSlot, type Slot } from "@/lib/auth";
import { currentUser } from "@/lib/session";

export { SLOTS, partnerSlot, type Slot };

export type Member = {
  id: string;
  displayName: string;
  slot: Slot;
};

// A bond's two members, keyed by slot. Either side may be null while a bond is
// still forming (one member before the partner accepts the invite — a later
// phase), so callers MUST tolerate a missing side and degrade, never crash.
export type BondMembers = Record<Slot, Member | null>;

// Memoized per request: the two members of a bond, by slot. This is the runtime
// replacement for the old hardcoded `PROFILES` / `DISPLAY_NAMES`.
export const getBondMembers = cache(
  async (bondId: string): Promise<BondMembers> => {
    const rows = await db
      .select({
        id: profiles.id,
        displayName: profiles.displayName,
        slot: profiles.slot,
      })
      .from(profiles)
      .where(eq(profiles.bondId, bondId));
    const members: BondMembers = { moss: null, ember: null };
    for (const r of rows) {
      if (r.slot === "moss" || r.slot === "ember") {
        members[r.slot] = { id: r.id, displayName: r.displayName, slot: r.slot };
      }
    }
    return members;
  },
);

// The authed viewer's bond context — the single call pages/actions start from.
export async function requireBond(): Promise<{
  userId: string;
  bondId: string;
  viewerSlot: Slot;
  members: BondMembers;
}> {
  const user = await currentUser();
  const members = await getBondMembers(user.bondId);
  return {
    userId: user.userId,
    bondId: user.bondId,
    viewerSlot: user.slot,
    members,
  };
}
