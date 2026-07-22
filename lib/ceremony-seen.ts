// Client-only. Once-per-day, per-DEVICE gating for a ceremony overlay, so each
// keeper witnesses each earned moment exactly once on their own device —
// decoupled from the DB claim-once (which only the first page-load wins, which
// used to mean the partner never saw it). Call once, in an effect: it marks the
// day seen and sweeps prior days. Returns true when the ceremony should play.
export function ceremonyUnseen(prefix: string, day: string): boolean {
  try {
    const key = `${prefix}${day}`;
    if (window.localStorage.getItem(key) === "1") return false;
    // sweep prior days so storage doesn't accrete a key per day forever
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(prefix) && k !== key) window.localStorage.removeItem(k);
    }
    window.localStorage.setItem(key, "1");
    return true;
  } catch {
    // storage unavailable — may repeat; better than a moment never witnessed
    return true;
  }
}
