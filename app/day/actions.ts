"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { dayMeta, weighIns } from "@/db/schema";
import { LEDGER_TAG } from "@/lib/cache-tags";
import { encrypt, encryptOrNull } from "@/lib/crypto";
import { safely } from "@/lib/safe";
import { trimSealedWord } from "@/lib/sealed-word";
import { todayIso } from "@/lib/dates";
import { currentUser } from "@/lib/session";

function validDay(day: unknown): day is string {
  return typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day);
}

async function guardedDay(day: unknown): Promise<string | null> {
  if (!validDay(day)) return null;
  const today = await todayIso();
  return day > today ? null : day;
}

async function upsertMeta(
  bondId: string,
  profileId: string,
  day: string,
  set: Partial<{
    training: "lift" | "cardio" | "rest" | null;
    waterCups: number;
    note: string | null;
    mood: string | null;
    sealedWord: string | null;
  }>,
) {
  await db
    .insert(dayMeta)
    .values({ bondId, profileId, day, ...set })
    .onConflictDoUpdate({
      target: [dayMeta.profileId, dayMeta.day],
      set,
    });
}

export async function saveWeighIn(input: {
  day: string;
  weightLb: number;
}): Promise<{ error?: string }> {
  const { userId: profileId, bondId } = await currentUser();
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day." };
  if (!(input.weightLb >= 60 && input.weightLb <= 600)) {
    return { error: "That weight doesn't look right." };
  }
  return safely(async () => {
    const encWeight = encrypt(String(input.weightLb));
    await db
      .insert(weighIns)
      .values({ bondId, profileId, day, weightLb: encWeight })
      .onConflictDoUpdate({
        target: [weighIns.profileId, weighIns.day],
        set: { weightLb: encWeight },
      });
    revalidatePath("/");
    revalidatePath("/today");
    revalidatePath("/trends");
    return {};
  });
}

export async function setTraining(input: {
  day: string;
  training: "lift" | "cardio" | "rest" | null;
}): Promise<{ error?: string }> {
  const { userId: profileId, bondId } = await currentUser();
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day." };
  if (
    input.training !== null &&
    !["lift", "cardio", "rest"].includes(input.training)
  ) {
    return { error: "Unknown training type." };
  }
  return safely(async () => {
    await upsertMeta(bondId, profileId, day, { training: input.training });
    revalidatePath("/");
    revalidatePath("/today");
    revalidateTag(LEDGER_TAG, { expire: 0 });
    return {};
  });
}

export async function setWater(input: {
  day: string;
  cups: number;
}): Promise<{ error?: string }> {
  const { userId: profileId, bondId } = await currentUser();
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day." };
  const cups = Math.round(input.cups);
  if (!(cups >= 0 && cups <= 20)) return { error: "That's a lot of water." };
  return safely(async () => {
    await upsertMeta(bondId, profileId, day, { waterCups: cups });
    revalidatePath("/");
    revalidatePath("/today");
    revalidateTag(LEDGER_TAG, { expire: 0 });
    return {};
  });
}

export async function setMood(input: {
  day: string;
  mood: string;
}): Promise<{ error?: string }> {
  const { userId: profileId, bondId } = await currentUser();
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day." };
  const mood = input.mood.trim().slice(0, 8) || null;
  return safely(async () => {
    await upsertMeta(bondId, profileId, day, { mood: encryptOrNull(mood) });
    revalidatePath("/");
    revalidatePath("/today");
    revalidateTag(LEDGER_TAG, { expire: 0 });
    return {};
  });
}

// The Sealed Word — one line pressed to the OTHER keeper. Stored encrypted
// beside the private note, but it is not the same thing: the note is to
// yourself, this is to them, and it stays shut until the ring closes (the
// reveal law lives in lib/sealed-word, read at every render boundary).
export async function pressSealedWord(input: {
  day: string;
  word: string;
}): Promise<{ error?: string }> {
  const { userId: profileId, bondId } = await currentUser();
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day." };
  const word = trimSealedWord(input.word);
  return safely(async () => {
    await upsertMeta(bondId, profileId, day, {
      sealedWord: encryptOrNull(word),
    });
    revalidatePath("/");
    revalidatePath("/today");
    return {};
  });
}

export async function saveNote(input: {
  day: string;
  note: string;
}): Promise<{ error?: string }> {
  const { userId: profileId, bondId } = await currentUser();
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day." };
  const note = input.note.trim().slice(0, 240) || null;
  return safely(async () => {
    await upsertMeta(bondId, profileId, day, { note: encryptOrNull(note) });
    revalidatePath("/");
    revalidatePath("/today");
    revalidateTag(LEDGER_TAG, { expire: 0 });
    return {};
  });
}
