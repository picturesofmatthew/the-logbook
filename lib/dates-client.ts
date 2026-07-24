// Pure date helpers, safe for client and server.

// YYYY-MM-DD for an instant in a given timezone. Pure — the primitive the
// canonical couple-day is built on (see coupleTz/todayIso in ./dates).
export function isoDateInTz(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

// ── The PATIENT day ──
// The couple-day does not turn at midnight; it turns at a grace hour after it
// (default 4am couple-time). Two reasons, both about the seal:
//   · a keeper logging at 1am is still keeping the day they just lived — the
//     night belongs to the day it grew out of, not the one it technically is;
//   · it hands the ring a few more hours to close, which is the whole point for
//     a couple whose evenings don't overlap (the long-distance beachhead).
// The invariant is UNCHANGED: one shared clock still buckets every `day` key,
// so the two halves can never file under different keys. This only moves where
// that one clock's day begins. Pure — the primitive todayIso() is built on.
export const DEFAULT_ROLLOVER_HOUR = 4;

// 0 = midnight (the old behaviour); capped at 8 so a "day" can never swallow a
// real morning. Anything bogus falls back to the default.
export function clampRolloverHour(h: number | undefined): number {
  if (h == null || !Number.isFinite(h)) return DEFAULT_ROLLOVER_HOUR;
  return Math.min(8, Math.max(0, Math.trunc(h)));
}

export function coupleDayFor(
  now: Date,
  tz: string,
  rolloverHour: number = DEFAULT_ROLLOVER_HOUR,
): string {
  const hours = clampRolloverHour(rolloverHour);
  // Shift the instant back, then read the date in the couple's zone: the small
  // hours land on yesterday's key, everything else on today's. Shifting the
  // instant (not the wall clock) keeps DST honest at the boundary.
  return isoDateInTz(new Date(now.getTime() - hours * 3_600_000), tz);
}

// A validated IANA tz, or the fallback if the candidate is missing/bogus.
// Shared by both the couple tz (env) and the device tz (cookie).
export function resolveTz(candidate: string | undefined, fallback: string): string {
  if (!candidate) return fallback;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: candidate });
    return candidate;
  } catch {
    return fallback;
  }
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Days from b to a (positive when a is later).
export function diffDays(a: string, b: string): number {
  return Math.round(
    (Date.parse(a + "T12:00:00Z") - Date.parse(b + "T12:00:00Z")) / 86400000,
  );
}
