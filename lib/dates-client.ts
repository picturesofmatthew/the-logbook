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
