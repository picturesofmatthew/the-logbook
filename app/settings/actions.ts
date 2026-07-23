"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { profiles, targets, weighIns } from "@/db/schema";
import { partnerSlot, requireBond } from "@/lib/bond";
import { LEDGER_TAG } from "@/lib/cache-tags";
import { encrypt } from "@/lib/crypto";
import { todayIso } from "@/lib/dates";
import { anonymizeProfile, eraseProfile } from "@/lib/leave";
import { safely } from "@/lib/safe";
import { currentUser, destroySession } from "@/lib/session";
import type { ActivityLevel, Sex } from "@/lib/engine/tdee";

export type SetupState = { error: string } | null;

// End the session (logout) and return to the door.
export async function logout(): Promise<void> {
  await destroySession();
  redirect("/enter");
}

// Leave the book: anonymize yourself (your partner keeps it as a keepsake — your
// logs stay so the shared history holds) and sign out.
export async function leaveBook(): Promise<void> {
  const { userId } = await currentUser();
  await anonymizeProfile(userId);
  revalidateTag(LEDGER_TAG, { expire: 0 });
  await destroySession();
  redirect("/enter");
}

// Sever — instantly remove your partner's access to this book. A safety exit:
// silent (no notification to them), immediate, and you keep the book.
export async function removePartner(): Promise<{ error?: string }> {
  const { viewerSlot, members } = await requireBond();
  const partner = members[partnerSlot(viewerSlot)];
  if (!partner || partner.leftAt) {
    return { error: "There's no partner to remove." };
  }
  await anonymizeProfile(partner.id);
  revalidateTag(LEDGER_TAG, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/settings");
  return {};
}

// Full erasure: delete everything you've logged (the shared seals recompute
// without you), then sign out. Irreversible.
export async function eraseMe(): Promise<void> {
  const { userId } = await currentUser();
  await eraseProfile(userId);
  revalidateTag(LEDGER_TAG, { expire: 0 });
  await destroySession();
  redirect("/enter");
}

const SEXES = ["male", "female"] as const;
const ACTIVITIES = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
] as const;

function num(v: FormDataEntryValue | null): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

export async function saveSetup(
  _prev: SetupState,
  formData: FormData,
): Promise<SetupState> {
  const { userId: profileId, bondId } = await currentUser();

  const sex = formData.get("sex");
  const birthdate = formData.get("birthdate");
  const activity = formData.get("activity");
  const heightFt = num(formData.get("heightFt"));
  const heightExtraIn = num(formData.get("heightIn"));
  const weightLb = num(formData.get("weightLb"));
  const calories = Math.round(num(formData.get("calories")));
  const proteinG = Math.round(num(formData.get("proteinG")));
  const carbsG = Math.round(num(formData.get("carbsG")));
  const fatG = Math.round(num(formData.get("fatG")));

  if (!SEXES.includes(sex as Sex)) {
    return { error: "Pick a body type for the math." };
  }
  if (typeof birthdate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
    return { error: "That birthday doesn't look right." };
  }
  if (!ACTIVITIES.includes(activity as ActivityLevel)) {
    return { error: "Pick an activity level." };
  }
  if (!(heightFt >= 3 && heightFt <= 7) || !(heightExtraIn >= 0 && heightExtraIn < 12)) {
    return { error: "That height doesn't look right." };
  }
  if (!(weightLb >= 60 && weightLb <= 600)) {
    return { error: "That weight doesn't look right." };
  }
  if (!(calories >= 800 && calories <= 6000)) {
    return { error: "Calories should land between 800 and 6,000." };
  }
  if (
    !(proteinG >= 20 && proteinG <= 400) ||
    !(carbsG >= 0 && carbsG <= 800) ||
    !(fatG >= 20 && fatG <= 300)
  ) {
    return { error: "Those macros look off — double-check the grams." };
  }

  const heightIn = heightFt * 12 + heightExtraIn;
  const today = await todayIso();

  const saved = await safely(async () => {
    await db
      .update(profiles)
      .set({
        sex: sex as Sex,
        birthdate,
        heightIn,
        activityLevel: activity as ActivityLevel,
      })
      .where(eq(profiles.id, profileId));

    const encWeight = encrypt(String(weightLb));
    await db
      .insert(weighIns)
      .values({ bondId, profileId, day: today, weightLb: encWeight })
      .onConflictDoUpdate({
        target: [weighIns.profileId, weighIns.day],
        set: { weightLb: encWeight },
      });

    await db.insert(targets).values({
      bondId,
      profileId,
      effectiveDate: today,
      calories,
      proteinG,
      carbsG,
      fatG,
    });
    return null;
  });
  if (saved) return saved;

  // New/changed targets re-weight every day's seal from the effective date on,
  // so expire the cached ledger before the redirect lands on a fresh "/".
  // { expire: 0 } = immediate (read-your-writes), not "max"'s stale-while-revalidate.
  revalidateTag(LEDGER_TAG, { expire: 0 });
  redirect("/");
}
