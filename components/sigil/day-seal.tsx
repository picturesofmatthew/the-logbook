// The day's seal, with its caption: tier, chords struck, or the legendary's
// name in union's color. Never a scold — an open ring just waits.

import { CHORDS, LEGENDARIES, type SigilSpec } from "@/lib/engine/sigil";
import { SigilGlyph } from "./sigil-glyph";

const TIER_LABELS: Record<SigilSpec["tier"], string> = {
  open: "the ring is open",
  common: "a common seal",
  fine: "a fine seal",
  resonant: "a resonant seal",
  legendary: "",
};

export function DaySeal({
  spec,
  missingName,
  isToday,
}: {
  spec: SigilSpec;
  missingName: string | null;
  isToday: boolean;
}) {
  const legendary = spec.legendary ? LEGENDARIES[spec.legendary] : null;

  return (
    <section className="flex items-center gap-3">
      <div className={spec.tier === "legendary" ? "lantern-pool rounded-full" : undefined}>
        <SigilGlyph spec={spec} size={88} bloom={spec.completed && isToday} />
      </div>
      <div className="min-w-0 flex-1">
        {legendary ? (
          <>
            <p className="font-pixel text-sm tracking-wide text-violet">
              ✦ {legendary.name}
            </p>
            <p className="mt-0.5 text-xs italic text-ink-soft">
              {legendary.epigraph}
            </p>
          </>
        ) : (
          <p className="font-pixel text-xs tracking-wide text-ink-soft">
            {TIER_LABELS[spec.tier]}
            {!spec.completed && missingName
              ? ` — waiting on ${missingName}`
              : ""}
          </p>
        )}
        {spec.chords.length > 0 ? (
          <p className="mt-1 text-xs leading-snug text-ink-soft">
            {spec.chords.map((c) => CHORDS[c].name).join(" · ")}
          </p>
        ) : spec.completed && !legendary ? (
          <p className="mt-1 text-xs text-ink-soft/80">
            sealed together — no chords today, and that is enough
          </p>
        ) : null}
      </div>
    </section>
  );
}
