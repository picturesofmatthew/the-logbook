import { useEffect, useState } from "react";

// The cold open — the whole world as a gate you choose to cross, then a fluid
// push-in to the hearth. All contained; no route change, no loading, and no
// auto-enter — you tap "begin". Reduced-motion skips the push-in and lands live.
export type ColdOpenPhase = "overview" | "entering" | "live";

const ZOOM_MS = 2000; // the (slower) fluid zoom through the warm window

export function useColdOpen(reduced: boolean): {
  phase: ColdOpenPhase;
  enter: () => void;
} {
  const [phase, setPhase] = useState<ColdOpenPhase>("overview");

  // once entering, hold the beat of the push-in, then land live.
  useEffect(() => {
    if (phase !== "entering") return;
    const t = setTimeout(() => setPhase("live"), ZOOM_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // the gate is a threshold you choose to cross — no auto-enter. Reduced-motion
  // skips the push-in animation and lands at the hearth at once.
  const enter = () =>
    setPhase((p) => (p !== "overview" ? p : reduced ? "live" : "entering"));

  return { phase, enter };
}
