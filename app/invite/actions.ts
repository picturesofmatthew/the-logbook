"use server";

import { requireBond } from "@/lib/bond";
import { createInvite } from "@/lib/invites";

// Mint an invite link for the empty slot of the caller's bond. Returns the raw
// token; the client assembles the full link. Guarded so you can't invite into a
// bond that's already whole.
export async function makeInvite(): Promise<{ token?: string; error?: string }> {
  const { bondId, userId, members } = await requireBond();
  if (members.ember) {
    return { error: "Your partner has already joined this book." };
  }
  const token = await createInvite(bondId, userId);
  return { token };
}
