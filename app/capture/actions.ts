"use server";

import {
  getRecentSpecimens,
  getRecentWorkouts,
  type RecentWorkout,
} from "@/lib/data";
import { todayIso } from "@/lib/dates";
import type { Specimen } from "@/lib/meals";
import { currentUser } from "@/lib/session";

// Everything the capture sheet needs when it opens: today (tz-aware, for
// logging), this keeper's recent specimens (the one-tap eat grid), and their
// recent workouts (repeat-last for the train pane).
export async function loadCaptureData(): Promise<{
  day: string;
  recents: Specimen[];
  recentWorkouts: RecentWorkout[];
}> {
  const { userId, bondId } = await currentUser();
  const [day, recents, recentWorkouts] = await Promise.all([
    todayIso(),
    getRecentSpecimens(bondId, userId, 12),
    getRecentWorkouts(bondId, userId, 12),
  ]);
  return { day, recents, recentWorkouts };
}
