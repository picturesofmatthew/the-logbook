"use server";

import { revalidatePath } from "next/cache";
import { and, eq, lt } from "drizzle-orm";
import { db } from "@/db";
import { voiceNotes } from "@/db/schema";
import { decrypt, decryptOrNull, encrypt, encryptOrNull } from "@/lib/crypto";
import { safely } from "@/lib/safe";
import { todayIso } from "@/lib/dates";
import {
  VOICE_MAX_AUDIO_B64,
  VOICE_MAX_DURATION_S,
  isAllowedVoiceMime,
  voiceNoteIsLive,
  voiceNoteLiveCutoff,
} from "@/lib/voice-notes";
import { currentUser } from "@/lib/session";
import { partnerSlot, requireBond } from "@/lib/bond";
import { donateSpecimen } from "@/app/log/actions";
import { logWorkout, type SetInput } from "@/app/train/actions";
import { saveNote, saveWeighIn, setMood, setWater } from "@/app/day/actions";
import type { Meal } from "@/lib/meals";
import type { Hall } from "@/lib/halls";

function validDay(day: unknown): day is string {
  return typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day);
}

async function guardedDay(day: unknown): Promise<string | null> {
  if (!validDay(day)) return null;
  const today = await todayIso();
  return day > today ? null : day;
}

// ── The ephemeral voice note ──

export async function saveVoiceNote(input: {
  day: string;
  audioBase64: string;
  mime: string;
  transcript?: string;
  durationS?: number;
}): Promise<{ error?: string }> {
  const { userId: profileId, bondId } = await currentUser();
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day." };
  if (!isAllowedVoiceMime(input.mime)) {
    return { error: "That audio format isn't supported." };
  }
  if (!input.audioBase64 || input.audioBase64.length > VOICE_MAX_AUDIO_B64) {
    return { error: "Keep the note under 30 seconds." };
  }
  if (input.durationS != null && input.durationS > VOICE_MAX_DURATION_S) {
    return { error: "Keep the note under 30 seconds." };
  }
  return safely(async () => {
    const audio = encrypt(input.audioBase64);
    const transcript = encryptOrNull(input.transcript ?? null);
    const durationS =
      input.durationS != null ? Math.round(input.durationS) : null;
    await db
      .insert(voiceNotes)
      .values({ bondId, profileId, day, audio, mime: input.mime, transcript, durationS })
      .onConflictDoUpdate({
        target: [voiceNotes.profileId, voiceNotes.day],
        // Re-recording replaces the note (createdAt bumps to the new take).
        set: { audio, mime: input.mime, transcript, durationS, createdAt: new Date() },
      });
    revalidatePath("/");
    revalidatePath("/today");
    return {};
  });
}

export type VoiceNoteView = {
  mime: string;
  dataUri: string;
  durationS: number | null;
  transcript: string | null;
};

export async function getVoiceNoteForDay(input: {
  day: string;
  which: "self" | "partner";
}): Promise<VoiceNoteView | null> {
  const { bondId, viewerSlot, members } = await requireBond();
  if (!validDay(input.day)) return null;
  const targetSlot = input.which === "partner" ? partnerSlot(viewerSlot) : viewerSlot;
  const target = members[targetSlot];
  if (!target) return null;

  const today = await todayIso();
  // Lazy reap: anything past the window is erased into the night (no cron).
  await db
    .delete(voiceNotes)
    .where(and(eq(voiceNotes.bondId, bondId), lt(voiceNotes.day, voiceNoteLiveCutoff(today))));

  const [row] = await db
    .select()
    .from(voiceNotes)
    .where(and(eq(voiceNotes.profileId, target.id), eq(voiceNotes.day, input.day)));
  if (!row || !voiceNoteIsLive(row.day, today)) return null;

  const audioB64 = decrypt(row.audio);
  if (audioB64 == null) return null;
  return {
    mime: row.mime,
    dataUri: `data:${row.mime};base64,${audioB64}`,
    durationS: row.durationS,
    transcript: decryptOrNull(row.transcript),
  };
}

// ── The reviewed spoken day → the existing writers ──

export type VoiceFoodInput = {
  meal: Meal;
  name: string;
  hall: Hall;
  icon: string;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  estimated: boolean;
  servings: number;
};

export type VoiceCommitInput = {
  day: string;
  foods: VoiceFoodInput[];
  workout: { title: string; sets: SetInput[] } | null;
  rituals: {
    waterCups: number | null;
    weightLb: number | null;
    mood: string | null;
    note: string | null;
  };
};

export type VoiceCommitResult = {
  error?: string;
  counts: { foods: number; sets: number; rituals: number };
};

// Fan the reviewed day out to the writers that already guard + encrypt. Best
// effort: one writer failing doesn't abandon the rest; the first error surfaces
// as a gentle partial message and the counts say what landed.
export async function commitVoiceDay(
  input: VoiceCommitInput,
): Promise<VoiceCommitResult> {
  await currentUser(); // fail closed to /enter before doing any work
  const counts = { foods: 0, sets: 0, rituals: 0 };
  const day = await guardedDay(input.day);
  if (!day) return { error: "Unknown day.", counts };

  const errors: string[] = [];
  const note = (r: { error?: string }, ok: () => void) => {
    if (r.error) errors.push(r.error);
    else ok();
  };

  for (const f of input.foods ?? []) {
    const r = await donateSpecimen({
      name: f.name,
      hall: f.hall,
      icon: f.icon,
      servingLabel: f.servingLabel,
      calories: Number(f.calories) || 0,
      proteinG: Number(f.proteinG) || 0,
      carbsG: Number(f.carbsG) || 0,
      fatG: Number(f.fatG) || 0,
      fdcId: null,
      estimated: f.estimated,
      logAs: { meal: f.meal, servings: f.servings > 0 ? f.servings : 1, day },
    });
    note(r, () => counts.foods++);
  }

  if (input.workout && input.workout.sets.length > 0) {
    const r = await logWorkout({
      day,
      title: input.workout.title,
      sets: input.workout.sets,
    });
    note(r, () => (counts.sets += input.workout!.sets.length));
  }

  const rit = input.rituals ?? {};
  if (rit.waterCups != null) {
    note(await setWater({ day, cups: rit.waterCups }), () => counts.rituals++);
  }
  if (rit.weightLb != null) {
    note(await saveWeighIn({ day, weightLb: rit.weightLb }), () => counts.rituals++);
  }
  if (rit.mood) {
    note(await setMood({ day, mood: rit.mood }), () => counts.rituals++);
  }
  if (rit.note) {
    note(await saveNote({ day, note: rit.note }), () => counts.rituals++);
  }

  return { error: errors[0], counts };
}
