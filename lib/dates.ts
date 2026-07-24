import { cookies } from "next/headers";
import {
  clampRolloverHour,
  coupleDayFor,
  DEFAULT_ROLLOVER_HOUR,
  isoDateInTz,
  resolveTz,
} from "./dates-client";

export const TZ_COOKIE = "logbook_tz";
const DEFAULT_TZ = "America/Denver";

// ── The canonical couple-day ──
// One shared clock buckets the day key, so both keepers file today's halves
// under the SAME `day` no matter where each device physically is. Without this,
// two keepers in two timezones bucket under different keys and the seal silently
// never closes — the exact failure mode of the long-distance beachhead. This is
// a single shared anchor (deliberately NOT device-following); it is the bridge
// to a per-couple `couples.tz` in the multi-user pass. Set COUPLE_TZ per
// deployment (must be set in Vercel prod); falls back to home base.
const COUPLE_TZ_FALLBACK = "America/Denver";

export function coupleTz(): string {
  return resolveTz(process.env.COUPLE_TZ, COUPLE_TZ_FALLBACK);
}

// When the shared day turns: the grace hour after midnight, couple-time (the
// PATIENT day — see coupleDayFor). Set COUPLE_DAY_ROLLOVER to 0 for a strict
// midnight; anything outside 0–8 falls back to the default.
export function coupleRolloverHour(): number {
  const raw = process.env.COUPLE_DAY_ROLLOVER;
  return raw == null || raw === ""
    ? DEFAULT_ROLLOVER_HOUR
    : clampRolloverHour(Number(raw));
}

// Any instant, bucketed into the couple's day — the ONE place a Date becomes a
// `day` key. EVERY `day` write and the seal's notion of today go through here.
// (currentTz() below is the *device* tz, for display + future descriptive
// long-distance chords — never the day key.)
export function coupleDayOf(d: Date): string {
  return coupleDayFor(d, coupleTz(), coupleRolloverHour());
}

// The couple's shared "today".
export async function todayIso(): Promise<string> {
  return coupleDayOf(new Date());
}

// Are we in the small hours the patient day still counts as yesterday? (The
// calendar has turned; the couple-day hasn't.) The world says so out loud —
// otherwise the grace hours are a secret, and a keeper who thinks the day is
// gone won't reach for the light.
export async function inNightGrace(): Promise<boolean> {
  const now = new Date();
  return isoDateInTz(now, coupleTz()) !== coupleDayOf(now);
}

// The device timezone (the TzSync cookie keeps it current as the couple travels).
// Display + descriptive only — it must not bucket the shared day.
export async function currentTz(): Promise<string> {
  const tz = (await cookies()).get(TZ_COOKIE)?.value;
  return resolveTz(tz, DEFAULT_TZ);
}

export { addDays, coupleDayFor, diffDays, isoDateInTz } from "./dates-client";

export function friendlyDate(iso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(iso + "T12:00:00"));
}
