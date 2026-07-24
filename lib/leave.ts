import { and, eq, notInArray } from "drizzle-orm";
import { db } from "@/db";
import {
  dayMeta,
  entries,
  invites,
  profiles,
  sessions,
  targets,
  weighIns,
  workouts,
} from "@/db/schema";
import { bothLoggedDays } from "@/lib/data";

// Anonymize a keeper: strip identity + private free-text and revoke access, but
// KEEP their logged contributions so the shared seals/history survive as the
// remaining keeper's read-only keepsake. Used for "leave" and for "sever" (the
// same operation, aimed at the partner). Instant + silent by design.
export async function anonymizeProfile(profileId: string): Promise<void> {
  const [me] = await db
    .select({ bondId: profiles.bondId })
    .from(profiles)
    .where(eq(profiles.id, profileId));
  await db
    .update(profiles)
    .set({
      email: null,
      passwordHash: null,
      displayName: "a former keeper",
      leftAt: new Date(),
    })
    .where(eq(profiles.id, profileId));
  // Private daily notes are the most identifying free text — remove them.
  await db
    .update(dayMeta)
    .set({ note: null })
    .where(eq(dayMeta.profileId, profileId));
  // Sealed Words are correspondence, not private notes: a word that OPENED (the
  // day's ring closed) was delivered, and a delivered letter belongs to the
  // keeper who received it — it stays in their book. Words from days that never
  // sealed were never read by anyone; those leave with their writer.
  if (me) {
    const delivered = [...(await bothLoggedDays(me.bondId))];
    await db
      .update(dayMeta)
      .set({ sealedWord: null })
      .where(
        delivered.length
          ? and(
              eq(dayMeta.profileId, profileId),
              notInArray(dayMeta.day, delivered),
            )
          : eq(dayMeta.profileId, profileId),
      );
  }
  // Revoke every session (instant lockout) + drop any invite they created.
  await db.delete(sessions).where(eq(sessions.profileId, profileId));
  await db.delete(invites).where(eq(invites.createdBy, profileId));
}

// Full erasure (on explicit request): anonymize, then delete every logged
// contribution — the shared seals recompute without them. The profile row stays
// as an anonymized tombstone so foreign keys (donated museum foods) still hold.
export async function eraseProfile(profileId: string): Promise<void> {
  await anonymizeProfile(profileId);
  await db.delete(entries).where(eq(entries.profileId, profileId));
  await db.delete(workouts).where(eq(workouts.profileId, profileId)); // cascades sets
  await db.delete(weighIns).where(eq(weighIns.profileId, profileId));
  await db.delete(dayMeta).where(eq(dayMeta.profileId, profileId));
  await db.delete(targets).where(eq(targets.profileId, profileId));
}
