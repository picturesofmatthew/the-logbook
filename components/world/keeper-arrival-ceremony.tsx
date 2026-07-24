"use client";

// THE SECOND KEEPER COMES — the one moment a book stops being solo. The letter
// was answered: the empty slot at the mantle is filled, and from here the seal
// can actually close. Fires once per device, keyed by the keeper who arrived
// (same gate as the other ceremonies), and only in the days right after they
// joined — a book that has been whole for months never greets anyone.

import { useEffect, useState } from "react";
import {
  KEEPER_ARCHETYPES,
  KeeperGlyph,
  type KeeperArchetype,
} from "@/components/keeper/keeper-glyph";
import { sealTone } from "@/lib/sounds";

const SEEN_PREFIX = "logbook_keeper_seen_";

export function KeeperArrivalCeremony({
  keeperId,
  name,
  character,
  viewerIsThem,
}: {
  keeperId: string;
  name: string;
  character: string | null;
  /** the arriving keeper sees the mirror of it: the light they just walked into */
  viewerIsThem: boolean;
}) {
  const [stage, setStage] = useState<"hidden" | "shown" | "fading">("hidden");
  const archetype = KEEPER_ARCHETYPES.some((a) => a.id === character)
    ? (character as KeeperArchetype)
    : null;

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_PREFIX + keeperId) === "1";
    } catch {}
    if (seen) return;
    try {
      window.localStorage.setItem(SEEN_PREFIX + keeperId, "1");
    } catch {
      // Storage unavailable — the greeting may repeat; better than never.
    }
    const show = window.setTimeout(() => {
      setStage("shown");
      sealTone();
    }, 400);
    const fade = window.setTimeout(() => setStage("fading"), 5200);
    const done = window.setTimeout(() => setStage("hidden"), 5700);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(fade);
      window.clearTimeout(done);
    };
  }, [keeperId]);

  if (stage === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-[56] flex items-center justify-center p-6 transition-opacity duration-500 ${
        stage === "fading" ? "opacity-0" : "opacity-100"
      }`}
      onClick={() => setStage("hidden")}
      role="dialog"
      aria-label="The second keeper has come"
    >
      <div className="absolute inset-0 bg-ink/45" />
      <div className="ceremony-card relative w-full max-w-xs">
        <p className="mb-3 text-center font-display text-sm tracking-widest text-violet-bright">
          the letter is answered
        </p>
        <div className="wobbly lantern-pool border-2 border-violet/50 bg-cream p-6 text-center shadow-card">
          {archetype ? (
            <div className="flex justify-center">
              <KeeperGlyph
                archetype={archetype}
                size={92}
                title={`${name}, at the mantle`}
              />
            </div>
          ) : null}
          <p className="mt-3 font-display text-base text-ink">
            {viewerIsThem
              ? "you have come to the light"
              : `${name} has come to the light`}
          </p>
          <p className="mt-2 text-xs italic leading-snug text-ink-soft">
            {viewerIsThem
              ? "two keepers at the mantle. the seal waits for both your hands."
              : "two keepers at the mantle. from tonight, the ring can close."}
          </p>
        </div>
        <p className="mt-3 text-center text-xs text-cream/90">
          tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
