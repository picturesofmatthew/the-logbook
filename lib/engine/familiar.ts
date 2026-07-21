// The familiar's growth and moods — pure functions.
//
// Growth is driven by LIFETIME days both people logged (never regresses;
// a missed day pauses growth, it never shrinks antlers). Mood is a daily
// expression layered on top. The familiar is never sick and never scolds —
// at worst, it gets a little lonely.

export type FamiliarStageId = "kit" | "yearling" | "young" | "adult" | "elder";

export const FAMILIAR_STAGES: {
  id: FamiliarStageId;
  label: string;
  minDays: number;
}[] = [
  { id: "kit", label: "kit", minDays: 0 },
  { id: "yearling", label: "yearling", minDays: 7 },
  { id: "young", label: "young fox", minDays: 21 },
  { id: "adult", label: "adult fox", minDays: 45 },
  { id: "elder", label: "elder fox", minDays: 90 },
];

export function stageForDays(lifetimeDays: number): FamiliarStageId {
  let stage: FamiliarStageId = "kit";
  for (const s of FAMILIAR_STAGES) {
    if (lifetimeDays >= s.minDays) stage = s.id;
  }
  return stage;
}

export function nextStageIn(lifetimeDays: number): {
  label: string;
  daysLeft: number;
} | null {
  const next = FAMILIAR_STAGES.find((s) => s.minDays > lifetimeDays);
  return next
    ? { label: next.label, daysLeft: next.minDays - lifetimeDays }
    : null;
}

export type FamiliarMood = "thriving" | "cozy" | "waiting" | "lonely";

export function moodFor(input: {
  loggedTodayCount: number;
  daysSinceAnyEntry: number | null;
}): FamiliarMood {
  if (input.loggedTodayCount >= 2) return "thriving";
  if (input.loggedTodayCount === 1) return "cozy";
  if (input.daysSinceAnyEntry != null && input.daysSinceAnyEntry >= 2) {
    return "lonely";
  }
  return "waiting";
}

const SPEECH: Record<FamiliarMood, string[]> = {
  thriving: [
    "Both of you! The den is warm tonight.",
    "A full logbook makes the antlers tingle.",
    "Fed twice over. What a day to be a fox.",
    "The pantry grows, and so do I.",
  ],
  cozy: [
    "Half the den is fed. Waiting on {missing}...",
    "{missing} hasn't stopped by the logbook yet.",
    "One bowl down. Saving a seat for {missing}.",
  ],
  waiting: [
    "Sniffing around for breakfast news...",
    "The logbook is open. The fox is patient.",
    "Ears up. Something delicious is coming.",
  ],
  lonely: [
    "It's been quiet in the den lately...",
    "The fox curled up by the empty logbook.",
    "Still here. Still hopeful. Still small.",
  ],
};

// Deterministic within a day so speech doesn't change on every render.
export function speechFor(
  mood: FamiliarMood,
  daySeed: string,
  missingName?: string,
): string {
  const lines = SPEECH[mood];
  let hash = 0;
  for (const ch of daySeed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const line = lines[hash % lines.length];
  return line.replace("{missing}", missingName ?? "the other one");
}
