import { cookies } from "next/headers";

export const TZ_COOKIE = "logbook_tz";
// Falls back to home base; the TzSync client component keeps the cookie
// current, so the app follows Matthew & Kennedy wherever they are.
const DEFAULT_TZ = "America/Denver";

export async function currentTz(): Promise<string> {
  const tz = (await cookies()).get(TZ_COOKIE)?.value;
  if (!tz) return DEFAULT_TZ;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return DEFAULT_TZ;
  }
}

// YYYY-MM-DD in the given timezone.
export function isoDateInTz(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export async function todayIso(): Promise<string> {
  return isoDateInTz(new Date(), await currentTz());
}

export { addDays, diffDays } from "./dates-client";

export function friendlyDate(iso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(iso + "T12:00:00"));
}
