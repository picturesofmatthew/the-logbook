"use client";

import { useSyncExternalStore } from "react";
import { isMuted, logChime, setMuted, subscribeMuted } from "@/lib/sounds";

export function SoundToggle() {
  const muted = useSyncExternalStore(
    subscribeMuted,
    () => isMuted(),
    () => true,
  );

  return (
    <section className="wobbly flex items-center justify-between border-2 border-ink/20 bg-cream/70 p-4 shadow-card">
      <span className="font-pixel text-sm tracking-wide">CHIMES</span>
      <button
        type="button"
        onClick={() => {
          const next = !muted;
          setMuted(next);
          if (!next) logChime();
        }}
        className={`wobbly-sm cursor-pointer border-2 px-3 py-1.5 text-sm transition-all ${
          muted
            ? "border-ink/20 bg-paper-deep text-ink-soft"
            : "border-moss-deep bg-moss text-cream"
        }`}
      >
        {muted ? "off" : "on ♪"}
      </button>
    </section>
  );
}
