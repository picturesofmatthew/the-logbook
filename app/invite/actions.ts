"use server";

import { requireBond } from "@/lib/bond";
import { createInvite } from "@/lib/invites";

// Press the seal on a letter: mint an invite link for the empty slot of the
// caller's bond, with the summons line they wrote. Returns the raw token; the
// client assembles the full link. Guarded so you can't invite into a bond
// that's already whole.
export async function makeInvite(input?: {
  message?: string;
}): Promise<{ token?: string; error?: string }> {
  const { bondId, userId, members } = await requireBond();
  if (members.ember) {
    return { error: "Your partner has already joined this book." };
  }
  const token = await createInvite(bondId, userId, input?.message ?? null);
  return { token };
}
