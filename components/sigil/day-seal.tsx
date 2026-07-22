// The day's seal — the hero of the home. Big and centered in its dark
// cartouche; the caption sits beneath it (tier, chords struck, or the
// legendary's name in union's color). Never a scold — an open ring just waits.

import { CHORDS, LEGENDARIES, type SigilSpec } from "@/lib/engine/sigil";
import { StarMark } from "@/components/glyphs";
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
  standingLine,
  isToday,
  size = 248,
}: {
  spec: SigilSpec;
  // Where the day stands before the ring closes — a warm, viewer-aware line
  // ("your half is kept — …"), never a scold. Computed on the home.
  standingLine: string | null;
  isToday: boolean;
  size?: number;
}) {
  const legendary = spec.legendary ? LEGENDARIES[spec.legendary] : null;

  return (
    <section className="flex flex-col items-center gap-3 text-center">
      <div className={spec.tier === "legendary" ? "lantern-pool rounded-full" : undefined}>
        <SigilGlyph spec={spec} size={size} bloom={spec.completed && isToday} />
      </div>
      <div className="min-w-0 max-w-[280px]">
        {legendary ? (
          <>
            <p className="flex items-center justify-center gap-1.5 font-display text-base tracking-wide text-violet">
              <StarMark size={14} /> {legendary.name}
            </p>
            <p className="mt-0.5 text-xs italic text-ink-soft">
              {legendary.epigraph}
            </p>
          </>
        ) : (
          <p className="font-display text-sm tracking-wide text-ink-soft">
            {spec.completed ? TIER_LABELS[spec.tier] : standingLine}
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
