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
  message?: string | null,
): Promise<string> {
  const token = randomBytes(24).toString("base64url");
  await db.insert(invites).values({
    tokenHash: await hashToken(token),
    bondId,
    createdBy,
    message: summonsLine(message),
    expiresAt: new Date(Date.now() + INVITE_TTL_MS),
  });
  return token;
}

// The summons line pressed into the letter — one line, trimmed. Personal, not
// health-tier, so it is stored plain (it travels in a link the recipient opens
// before they have an account; there is no key to read it with yet).
export const SUMMONS_MAX = 200;

export function summonsLine(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const oneLine = raw.replace(/\s+/g, " ").trim();
  return oneLine ? oneLine.slice(0, SUMMONS_MAX) : null;
}

// A stable visual seed for a bond's letter — the same bond always presses the
// same seal. (Not a secret: it only picks which flecks fall where.)
export function letterSeed(bondId: string): number {
  let hash = 0;
  for (const ch of bondId) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return hash;
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

// Hand a letter back. Redeeming is atomic and happens BEFORE the new keeper's
// profile is written; if that write fails, the letter would otherwise be burned
// for good and the pair would be stuck with no way in. Only ever called on that
// failure path, so it can't weaken single-use.
export async function releaseInvite(token: string): Promise<void> {
  if (!token) return;
  await db
    .update(invites)
    .set({ acceptedAt: null })
    .where(eq(invites.tokenHash, await hashToken(token)));
}

// A read-only peek at an invite — everything the LETTER unfurls with, without
// consuming the token: who is calling you, the line they pressed, the self they
// elected at the mantle, and the seed their half-lit seal is drawn from. Null if
// the token is unknown, expired, or already used.
export type InvitePreview = {
  inviterName: string;
  message: string | null;
  inviterCharacter: string | null;
  seed: number;
};

export async function invitePreview(
  token: string,
): Promise<InvitePreview | null> {
  if (!token) return null;
  const [row] = await db
    .select({
      bondId: invites.bondId,
      createdBy: invites.createdBy,
      message: invites.message,
      expiresAt: invites.expiresAt,
      acceptedAt: invites.acceptedAt,
    })
    .from(invites)
    .where(eq(invites.tokenHash, await hashToken(token)));
  if (!row || row.acceptedAt || row.expiresAt.getTime() < Date.now()) {
    return null;
  }
  // The keeper who sent it (not "whoever holds moss") — explicit, so a bond
  // whose slots ever change can't misaddress a letter.
  const [inviter] = await db
    .select({
      displayName: profiles.displayName,
      character: profiles.character,
    })
    .from(profiles)
    .where(eq(profiles.id, row.createdBy));
  return {
    inviterName: inviter?.displayName ?? "someone",
    message: row.message,
    inviterCharacter: inviter?.character ?? null,
    seed: letterSeed(row.bondId),
  };
}
