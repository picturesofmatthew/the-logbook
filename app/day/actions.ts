"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { dayMeta, weighIns } from "@/db/schema";
import { safely } from "@/lib/safe";
import { todayIso } from "@/lib/dates";
import { currentProfile } from "@/lib/session";

function validDay(day: unknown): day is string {
  return typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day);
}

async function guardedDay(day: unknown): Promise<string | null> {
  if (!validDay(day)) return null;
  const today = await todayIso();
  return day > today ? null : day;
}

async function upsertMeta(
  profileId: string,
  day: string,
  set: Partial<{
    training: "lift" | "cardio" | "rest" | null;
    waterCups: number;
    note: string | null;
    mood: string | null;
  }>,
) {
  await db
    .insert(dayMeta)
    .values({ profileId, day, ...set })
    .onConflictDoUpdate({
      target: [dayMeta.profileId, dayMeta.day],
      set,
    });
}

export async function saveWeighIn(input: {
  day: string;
  weightLb: number;
}): Promise<{ error?: string }> {
  const profileId = await currentProfile();
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day." };
  if (!(input.weightLb >= 60 && input.weightLb <= 600)) {
    return { error: "That weight doesn't look right." };
  }
  return safely(async () => {
    await db
      .insert(weighIns)
      .values({ profileId, day, weightLb: input.weightLb })
      .onConflictDoUpdate({
        target: [weighIns.profileId, weighIns.day],
        set: { weightLb: input.weightLb },
      });
    revalidatePath("/");
    revalidatePath("/trends");
    return {};
  });
}

export async function setTraining(input: {
  day: string;
  training: "lift" | "cardio" | "rest" | null;
}): Promise<{ error?: string }> {
  const profileId = await currentProfile();
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day." };
  if (
    input.training !== null &&
    !["lift", "cardio", "rest"].includes(input.training)
  ) {
    return { error: "Unknown training type." };
  }
  return safely(async () => {
    await upsertMeta(profileId, day, { training: input.training });
    revalidatePath("/");
    return {};
  });
}

export async function setWater(input: {
  day: string;
  cups: number;
}): Promise<{ error?: string }> {
  const profileId = await currentProfile();
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day." };
  const cups = Math.round(input.cups);
  if (!(cups >= 0 && cups <= 20)) return { error: "That's a lot of water." };
  return safely(async () => {
    await upsertMeta(profileId, day, { waterCups: cups });
    revalidatePath("/");
    return {};
  });
}

export async function setMood(input: {
  day: string;
  mood: string;
}): Promise<{ error?: string }> {
  const profileId = await currentProfile();
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day." };
  const mood = input.mood.trim().slice(0, 8) || null;
  return safely(async () => {
    await upsertMeta(profileId, day, { mood });
    revalidatePath("/");
    return {};
  });
}

export async function saveNote(input: {
  day: string;
  note: string;
}): Promise<{ error?: string }> {
  const profileId = await currentProfile();
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day." };
  const note = input.note.trim().slice(0, 240) || null;
  return safely(async () => {
    await upsertMeta(profileId, day, { note });
    revalidatePath("/");
    return {};
  });
}
