import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { SoundToggle } from "@/components/sound-toggle";
import { db } from "@/db";
import { profiles, targets, weighIns } from "@/db/schema";
import { todayIso } from "@/lib/dates";
import { currentProfile } from "@/lib/session";
import { SetupForm, type SetupInitial } from "./setup-form";

export const metadata: Metadata = {
  title: "Settings - signxsealed",
};

export default async function SettingsPage() {
  const profileId = await currentProfile();

  const [profileRow] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, profileId));

  const [latestWeighIn] = await db
    .select()
    .from(weighIns)
    .where(eq(weighIns.profileId, profileId))
    .orderBy(desc(weighIns.day))
    .limit(1);

  const [currentTarget] = await db
    .select()
    .from(targets)
    .where(eq(targets.profileId, profileId))
    .orderBy(desc(targets.effectiveDate), desc(targets.id))
    .limit(1);

  const initial: SetupInitial = {
    sex: profileRow?.sex ?? null,
    birthdate: profileRow?.birthdate ?? null,
    heightIn: profileRow?.heightIn ?? null,
    activityLevel: profileRow?.activityLevel ?? null,
    weightLb: latestWeighIn?.weightLb ?? null,
    calories: currentTarget?.calories ?? null,
    proteinG: currentTarget?.proteinG ?? null,
    carbsG: currentTarget?.carbsG ?? null,
    fatG: currentTarget?.fatG ?? null,
    todayIso: await todayIso(),
  };

  return (
    <main className="mx-auto w-full max-w-md flex-1 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-pixel text-2xl tracking-wide">
          {profileRow?.displayName ?? profileId}&apos;s setup
        </h1>
        <Link
          href="/"
          className="text-sm text-ink-soft underline decoration-dotted underline-offset-4"
        >
          back home
        </Link>
      </div>
      <SetupForm initial={initial} />
      <div className="mt-6">
        <SoundToggle />
      </div>
    </main>
  );
}
