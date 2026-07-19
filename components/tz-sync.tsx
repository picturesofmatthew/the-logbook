"use client";

import { useEffect } from "react";

// Keeps a timezone cookie current so server-rendered "today" matches the
// phone's clock — including after the move to Chiang Mai.
export function TzSync() {
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && !document.cookie.includes(`logbook_tz=${tz}`)) {
      document.cookie = `logbook_tz=${tz}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    }
  }, []);
  return null;
}
