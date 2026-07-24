"use client";

// The daily union moment: the first time the ring closes each day, on this
// device, the seal gets its own small ceremony — softer than a legendary,
// but never silent. Gated per-day in localStorage so each keeper sees it
// once on their own device. When a grander ceremony (legendary, arrival)
// owns the render, we mark the day seen and stay quiet.

import { useEffect, useState } from "react";
import { CHORDS, type SigilSpec } from "@/lib/engine/sigil";
import { plankTone, sealTone } from "@/lib/sounds";
import { StarMark } from "@/components/glyphs";
import { PlankBeat } from "./plank-beat";
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
  dreamName,
  planksLaid,
  remaining,
  word,
  wordFrom,
}: {
  spec: SigilSpec;
  day: string;
  closerLine?: string | null;
  sealedCount?: number;
  suppressed: boolean;
  // The boat toward the far shore — the second beat: a plank is set.
  dreamName?: string;
  planksLaid?: number | null;
  remaining?: number | null;
  // The Sealed Word your keeper pressed today — the third beat. The parent
  // hands it over only once the ring has closed (lib/sealed-word).
  word?: string | null;
  wordFrom?: string | null;
}) {
  const [stage, setStage] = useState<"hidden" | "shown" | "fading">("hidden");
  const milestone = sealedCount != null ? MILESTONES[sealedCount] : undefined;
  const laysPlank = planksLaid != null && dreamName != null;

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
    // The second beat: the plank draws itself into the boat (CSS-timed to
    // ~1.45s after the card shows) — meet it with a dry wooden knock.
    const plank = laysPlank
      ? window.setTimeout(() => plankTone(), 1700)
      : undefined;
    // The seal draws itself on over ~3s (composeSeal reveal); hold the moment
    // long enough to watch the union bloom and the motes spark before fading.
    const fade = window.setTimeout(() => setStage("fading"), laysPlank ? 5400 : 4700);
    const done = window.setTimeout(() => setStage("hidden"), laysPlank ? 5900 : 5200);
    return () => {
      window.clearTimeout(show);
      if (plank) window.clearTimeout(plank);
      window.clearTimeout(fade);
      window.clearTimeout(done);
    };
  }, [day, suppressed, laysPlank]);

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
        <p className="mb-3 text-center font-display text-sm tracking-widest text-violet-bright">
          the ring closes
        </p>
        <div className="wobbly lantern-pool border-2 border-violet/50 bg-cream p-6 text-center shadow-card">
          <div className="flex justify-center">
            <SigilGlyph spec={spec} size={132} bloom reveal />
          </div>
          <p className="mt-3 font-display text-sm text-ink">
            {TIER_LINES[spec.tier]}
          </p>
          {spec.chords.length > 0 ? (
            <p className="mt-1 text-xs text-ink-soft">
              {spec.chords.map((c) => CHORDS[c].name).join(" · ")}
            </p>
          ) : null}
          {closerLine ? (
            <p className="mt-2 font-display text-[10px] tracking-wide text-ink-soft">
              {closerLine}
            </p>
          ) : null}
          {milestone ? (
            <p className="mt-2 flex items-center justify-center gap-1 font-display text-xs tracking-wide text-violet">
              <StarMark size={12} /> {milestone}
            </p>
          ) : null}
          <PlankBeat
            dreamName={dreamName}
            planksLaid={planksLaid}
            remaining={remaining}
            golden={spec.tier === "legendary" || spec.tier === "resonant"}
          />
          {word ? (
            <div className="mt-3 border-t border-dashed border-violet/40 pt-2">
              <p className="font-display text-[10px] tracking-widest text-violet">
                {wordFrom
                  ? `${wordFrom.toLowerCase()} pressed a word`
                  : "a word was pressed"}
              </p>
              <p className="mt-1 text-sm italic leading-snug text-ink">
                “{word}”
              </p>
            </div>
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
