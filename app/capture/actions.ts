"use server";

import {
  bothLoggedDays,
  getDayExtras,
  getRecentSpecimens,
  getRecentWorkouts,
  type RecentWorkout,
} from "@/lib/data";
import { getBondMembers, partnerSlot } from "@/lib/bond";
import { todayIso } from "@/lib/dates";
import type { Specimen } from "@/lib/meals";
import { revealSealedWord, wordWaits } from "@/lib/sealed-word";
import { currentUser } from "@/lib/session";

// Today's Sealed Word, from the viewer's seat: what they pressed, what their
// keeper pressed (only once the ring closed), and whether one is waiting. The
// reveal gate is applied HERE, on the server — an unopened word never crosses
// to the client, so there is nothing to read in the payload.
export type SealedWordState = {
  partnerName: string | null; // null = no second keeper yet; the line hides
  mine: string | null;
  theirs: string | null;
  waiting: boolean;
  sealed: boolean;
};

// Everything the capture sheet needs when it opens: today (tz-aware, for
// logging), this keeper's recent specimens (the one-tap eat grid), their
// recent workouts (repeat-last for the train pane), and the day's sealed word.
export async function loadCaptureData(): Promise<{
  day: string;
  recents: Specimen[];
  recentWorkouts: RecentWorkout[];
  word: SealedWordState;
}> {
  const { userId, bondId, slot } = await currentUser();
  const day = await todayIso();
  const [recents, recentWorkouts, members, extras, bothDays] = await Promise.all([
    getRecentSpecimens(bondId, userId, 12),
    getRecentWorkouts(bondId, userId, 12),
    getBondMembers(bondId),
    getDayExtras(bondId, day),
    bothLoggedDays(bondId, { start: day, end: day }),
  ]);

  const theirSlot = partnerSlot(slot);
  const partner = members[theirSlot];
  const sealed = bothDays.has(day);
  const theirWord = extras.meta[theirSlot].sealedWord;

  return {
    day,
    recents,
    recentWorkouts,
    word: {
      partnerName: partner && !partner.leftAt ? partner.displayName : null,
      mine: extras.meta[slot].sealedWord,
      theirs: revealSealedWord({ word: theirWord, own: false, sealed }),
      waiting: wordWaits({ word: theirWord, own: false, sealed }),
      sealed,
    },
  };
}
