"use server";

import { revalidatePath } from "next/cache";
import {
  chooseNextShore,
  updateActiveDream,
} from "@/lib/data";
import { todayIso } from "@/lib/dates";
import { safely } from "@/lib/safe";
import { currentUser } from "@/lib/session";

type FormState = { error: string } | null;

function readName(formData: FormData): string {
  return String(formData.get("name") ?? "").trim().slice(0, 40);
}

// A reachable, non-punishing distance — clamped so the shore is never absurd.
function readDistance(formData: FormData): number {
  const n = Math.round(Number(formData.get("distance")));
  if (!Number.isFinite(n)) return 14;
  return Math.min(365, Math.max(3, n));
}

// Rename / re-scope the active shore (the light setter).
export async function renameDream(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { bondId } = await currentUser();
  const name = readName(formData);
  if (name.length < 1) return { error: "Name your far shore." };
  return safely(async () => {
    await updateActiveDream(bondId, {
      name,
      distanceDays: readDistance(formData),
    });
    revalidatePath("/shore");
    revalidatePath("/");
    return null;
  });
}

// After arrival: archive the reached shore and set out for the next one.
export async function setNextShore(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { bondId } = await currentUser();
  const name = readName(formData);
  if (name.length < 1) return { error: "Name your next shore." };
  return safely(async () => {
    const today = await todayIso();
    await chooseNextShore(bondId, {
      name,
      distanceDays: readDistance(formData),
      startedDay: today,
    });
    revalidatePath("/shore");
    revalidatePath("/");
    return null;
  });
}
