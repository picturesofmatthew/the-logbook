"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { dayMeta, workouts, workoutSets } from "@/db/schema";
import { LEDGER_TAG } from "@/lib/cache-tags";
import { todayIso } from "@/lib/dates";
import { safely } from "@/lib/safe";
import { currentProfile } from "@/lib/session";

function validDay(day: unknown): day is string {
  return typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day);
}

async function guardedDay(day: unknown): Promise<string | null> {
  if (!validDay(day)) return null;
  const today = await todayIso();
  return day > today ? null : day;
}

export type SetInput = {
  kind: "lift" | "cardio";
  exercise: string;
  weightLb: number | null;
  reps: number | null;
  minutes: number | null;
};

function cleanSet(s: SetInput): SetInput | null {
  if (s.kind !== "lift" && s.kind !== "cardio") return null;
  const exercise = s.exercise.trim().replace(/\s+/g, " ").slice(0, 80);
  if (!exercise) return null;
  if (s.kind === "lift") {
    const reps = Math.round(Number(s.reps));
    if (!(reps >= 1 && reps <= 100)) return null;
    let weightLb: number | null = null;
    if (s.weightLb != null && s.weightLb !== 0) {
      weightLb = Number(s.weightLb);
      if (!(weightLb > 0 && weightLb <= 1500)) return null;
    }
    return { kind: "lift", exercise, weightLb, reps, minutes: null };
  }
  const minutes = Number(s.minutes);
  if (!(minutes >= 1 && minutes <= 600)) return null;
  return { kind: "cardio", exercise, weightLb: null, reps: null, minutes };
}

export async function logWorkout(input: {
  day: string;
  title: string;
  note?: string;
  sets: SetInput[];
}): Promise<{ error?: string }> {
  const profileId = await currentProfile();
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day." };

  const title = input.title.trim().slice(0, 60);
  if (!title) return { error: "Give the workout a name." };
  if (!Array.isArray(input.sets) || input.sets.length > 60) {
    return { error: "That is a lot of sets." };
  }

  const sets = input.sets.map(cleanSet);
  if (sets.some((s) => s === null)) {
    return { error: "A set is incomplete — check weight, reps, and minutes." };
  }
  const clean = sets as SetInput[];

  return safely(async () => {
    const [workout] = await db
      .insert(workouts)
      .values({
        profileId,
        day,
        title,
        note: input.note?.trim().slice(0, 240) || null,
      })
      .returning({ id: workouts.id });

    if (clean.length > 0) {
      await db.insert(workoutSets).values(
        clean.map((s, i) => ({
          workoutId: workout.id,
          kind: s.kind,
          exercise: s.exercise,
          setIndex: i,
          weightLb: s.weightLb,
          reps: s.reps,
          minutes: s.minutes,
        })),
      );
    }

    // Keep the quick-mark in step: a real workout speaks for the day.
    const training =
      clean.length === 0
        ? ("rest" as const)
        : clean.some((s) => s.kind === "lift")
          ? ("lift" as const)
          : ("cardio" as const);
    await db
      .insert(dayMeta)
      .values({ profileId, day, training })
      .onConflictDoUpdate({
        target: [dayMeta.profileId, dayMeta.day],
        set: { training },
      });

    revalidatePath("/");
    revalidatePath("/today");
    revalidateTag(LEDGER_TAG, { expire: 0 });
    return {};
  });
}

export async function deleteWorkout(input: {
  id: number;
}): Promise<{ error?: string }> {
  const profileId = await currentProfile();
  const id = Math.round(Number(input.id));
  if (!Number.isFinite(id)) return { error: "Unknown workout." };
  return safely(async () => {
    await db
      .delete(workouts)
      .where(and(eq(workouts.id, id), eq(workouts.profileId, profileId)));
    revalidatePath("/");
    revalidatePath("/today");
    revalidateTag(LEDGER_TAG, { expire: 0 });
    return {};
  });
}
