"use client";

import { useEffect } from "react";

// Keeps the *device* timezone cookie current as the couple travels. This drives
// display + descriptive long-distance chords only — the shared day key is the
// couple tz (see coupleTz in lib/dates), so two devices never split the seal.
export function TzSync() {
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && !document.cookie.includes(`logbook_tz=${tz}`)) {
      document.cookie = `logbook_tz=${tz}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    }
  }, []);
  return null;
}
