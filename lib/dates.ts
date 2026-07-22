import { cookies } from "next/headers";
import { isoDateInTz, resolveTz } from "./dates-client";

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

// The couple's shared "today" — EVERY `day` write and the seal's notion of
// today bucket on the couple tz. (currentTz() below is the *device* tz, for
// display + future descriptive long-distance chords — never the day key.)
export async function todayIso(): Promise<string> {
  return isoDateInTz(new Date(), coupleTz());
}

// The device timezone (the TzSync cookie keeps it current as the couple travels).
// Display + descriptive only — it must not bucket the shared day.
export async function currentTz(): Promise<string> {
  const tz = (await cookies()).get(TZ_COOKIE)?.value;
  return resolveTz(tz, DEFAULT_TZ);
}

export { addDays, diffDays, isoDateInTz } from "./dates-client";

export function friendlyDate(iso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(iso + "T12:00:00"));
}
