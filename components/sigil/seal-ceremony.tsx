"use client";

// The daily union moment: the first time the ring closes each day, on this
// device, the seal gets its own small ceremony — softer than a legendary,
// but never silent. Gated per-day in localStorage so each keeper sees it
// once on their own device. When a grander ceremony (legendary, arrival)
// owns the render, we mark the day seen and stay quiet.

import { useEffect, useState } from "react";
import { CHORDS, type SigilSpec } from "@/lib/engine/sigil";
import { sealTone } from "@/lib/sounds";
import { SigilGlyph } from "./sigil-glyph";

const SEEN_PREFIX = "logbook_seal_seen_";

function markSeen(day: string) {
  try {
    // One key per day; sweep yesterday's on the way in.
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(SEEN_PREFIX) && key !== SEEN_PREFIX + day) {
        window.localStorage.removeItem(key);
      }
    }
    window.localStorage.setItem(SEEN_PREFIX + day, "1");
  } catch {
    // Storage unavailable — the ceremony may repeat; better than never.
  }
}

const TIER_LINES: Record<SigilSpec["tier"], string> = {
  open: "",
  common: "a common seal — and that is enough",
  fine: "a fine seal",
  resonant: "a resonant seal",
  legendary: "a legendary seal",
};

// Sealed-day counts worth marking — a shared milestone, spoken in union's
// color. (Day 1 is the First Page legendary's own ceremony, so it isn't here.)
const MILESTONES: Record<number, string> = {
  7: "a week of pages, kept",
  30: "thirty days, sealed together",
  50: "fifty days",
  100: "one hundred days",
  200: "two hundred days",
  365: "a year of pages",
};

export function SealCeremony({
  spec,
  day,
  closerLine,
  sealedCount,
  suppressed,
}: {
  spec: SigilSpec;
  day: string;
  closerLine?: string | null;
  sealedCount?: number;
  suppressed: boolean;
}) {
  const [stage, setStage] = useState<"hidden" | "shown" | "fading">("hidden");
  const milestone = sealedCount != null ? MILESTONES[sealedCount] : undefined;

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_PREFIX + day) === "1";
    } catch {}
    if (seen) return;
    markSeen(day);
    if (suppressed) return;
    // A settling beat, then the ring closes.
    const show = window.setTimeout(() => {
      setStage("shown");
      sealTone();
    }, 250);
    const fade = window.setTimeout(() => setStage("fading"), 3850);
    const done = window.setTimeout(() => setStage("hidden"), 4350);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(fade);
      window.clearTimeout(done);
    };
  }, [day, suppressed]);

  if (stage === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-[55] flex items-center justify-center p-6 transition-opacity duration-500 ${
        stage === "fading" ? "opacity-0" : "opacity-100"
      }`}
      onClick={() => setStage("hidden")}
      role="dialog"
      aria-label="The day is sealed"
    >
      <div className="absolute inset-0 bg-ink/45" />
      <div className="ceremony-card relative w-full max-w-xs">
        <p className="mb-3 text-center font-pixel text-sm tracking-widest text-violet-bright">
          the ring closes
        </p>
        <div className="wobbly lantern-pool border-2 border-violet/50 bg-cream p-6 text-center shadow-card">
          <div className="flex justify-center">
            <SigilGlyph spec={spec} size={110} bloom />
          </div>
          <p className="mt-3 font-pixel text-sm text-ink">
            {TIER_LINES[spec.tier]}
          </p>
          {spec.chords.length > 0 ? (
            <p className="mt-1 text-xs text-ink-soft">
              {spec.chords.map((c) => CHORDS[c].name).join(" · ")}
            </p>
          ) : null}
          {closerLine ? (
            <p className="mt-2 font-pixel text-[10px] tracking-wide text-ink-soft">
              {closerLine}
            </p>
          ) : null}
          {milestone ? (
            <p className="mt-2 font-pixel text-xs tracking-wide text-violet">
              ✦ {milestone}
            </p>
          ) : null}
          <p className="mt-3 text-xs italic text-ink-soft">
            another page kept, together
          </p>
        </div>
        <p className="mt-3 text-center text-xs text-cream/90">
          tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
