import type { Metadata } from "next";
import { legendarySpec } from "@/components/sigil/display-spec";
import { SigilGlyph } from "@/components/sigil/sigil-glyph";
import { requireBond } from "@/lib/bond";
import { InvitePanel } from "./invite-panel";

export const metadata: Metadata = {
  title: "Invite your partner — signed × sealed",
};

export default async function InvitePage() {
  const { members } = await requireBond();
  const paired = !!members.ember;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 p-6">
      <header className="flex flex-col items-center gap-3 text-center">
        {/* the mark: The Mirror at Dusk, turning slowly — two facing arcs, which
            is the whole argument for sending this. */}
        <div className="sigil-turn">
          <SigilGlyph
            spec={legendarySpec("mirror-at-dusk")}
            size={104}
            detail="full"
            bloom
          />
        </div>
        <h1 className="font-display text-2xl tracking-wide">
          invite your partner
        </h1>
        <p className="-mt-2 text-sm text-ink-soft">
          the seal can&apos;t close alone — bring the second keeper in
        </p>
      </header>

      {paired ? (
        <p className="wobbly border-2 border-ink/15 bg-cream/60 p-4 text-center text-ink-soft shadow-card">
          Your book is whole — {members.ember?.displayName} has joined.
        </p>
      ) : (
        <div className="wobbly border-2 border-ink/20 bg-cream/70 p-6 shadow-card">
          <InvitePanel />
        </div>
      )}

    </main>
  );
}
