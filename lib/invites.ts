import { randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db";
import { invites, profiles } from "@/db/schema";
import { hashToken } from "@/lib/auth";

const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

// Mint a single-use invite for a bond's empty slot. Returns the raw token (it
// goes in the link); only its sha256 is stored, so a DB leak can't redeem it.
// 24 random bytes = 192 bits, well past the ≥128-bit bar.
export async function createInvite(
  bondId: string,
  createdBy: string,
): Promise<string> {
  const token = randomBytes(24).toString("base64url");
  await db.insert(invites).values({
    tokenHash: await hashToken(token),
    bondId,
    createdBy,
    expiresAt: new Date(Date.now() + INVITE_TTL_MS),
  });
  return token;
}

// Redeem atomically: one UPDATE that sets accepted_at only if the invite is
// still open and unexpired, RETURNING the bond. Single-use is guaranteed — a
// second redeem (or a race) matches no row and returns null.
export async function redeemInvite(
  token: string,
): Promise<{ bondId: string } | null> {
  if (!token) return null;
  const rows = await db
    .update(invites)
    .set({ acceptedAt: new Date() })
    .where(
      and(
        eq(invites.tokenHash, await hashToken(token)),
        isNull(invites.acceptedAt),
        gt(invites.expiresAt, new Date()),
      ),
    )
    .returning({ bondId: invites.bondId });
  return rows[0] ?? null;
}

// A read-only peek at an invite (for the join page): who's inviting, without
// consuming the token. Null if the token is unknown, expired, or already used.
export async function invitePreview(
  token: string,
): Promise<{ inviterName: string } | null> {
  if (!token) return null;
  const [row] = await db
    .select({
      bondId: invites.bondId,
      expiresAt: invites.expiresAt,
      acceptedAt: invites.acceptedAt,
    })
    .from(invites)
    .where(eq(invites.tokenHash, await hashToken(token)));
  if (!row || row.acceptedAt || row.expiresAt.getTime() < Date.now()) {
    return null;
  }
  const [moss] = await db
    .select({ displayName: profiles.displayName })
    .from(profiles)
    .where(and(eq(profiles.bondId, row.bondId), eq(profiles.slot, "moss")));
  return { inviterName: moss?.displayName ?? "someone" };
}
