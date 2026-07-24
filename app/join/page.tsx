import type { Metadata } from "next";
import Link from "next/link";
import { FamiliarGlyph } from "@/components/familiar/familiar-glyph";
import {
  KEEPER_ARCHETYPES,
  KeeperGlyph,
  type KeeperArchetype,
} from "@/components/keeper/keeper-glyph";
import { SigilGlyph } from "@/components/sigil/sigil-glyph";
import type { SigilSpec } from "@/lib/engine/sigil";
import { invitePreview } from "@/lib/invites";
import { JoinForm } from "./join-form";

export const metadata: Metadata = {
  title: "Begin a book — signed × sealed",
};

// The letter's living seal: the sender's half is inked, yours is an open gap in
// the ink. Nothing here is invented — a bond with one keeper IS a half-lit
// seal, and it stays half-lit until you fill the other side.
function halfLitSeal(seed: number): SigilSpec {
  return {
    completed: false,
    moss: { inked: true, weight: "even" },
    ember: { inked: false, weight: "open" },
    radicals: [],
    ornaments: [],
    newMark: false,
    chords: [],
    legendary: null,
    tier: "open",
    seed,
    moon: false,
    water: false,
    lowMood: false,
  };
}

function asArchetype(v: string | null): KeeperArchetype | null {
  return KEEPER_ARCHETYPES.some((a) => a.id === v)
    ? (v as KeeperArchetype)
    : null;
}

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite } = await searchParams;
  const preview = invite ? await invitePreview(invite) : null;
  const character = preview ? asArchetype(preview.inviterCharacter) : null;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {preview ? (
          /* THE LETTER — it unfurls: the seal presses in, the page unrolls
             beneath it, then the hand-written line settles. */
          <div className="letter wobbly border-2 border-violet/40 bg-cream/80 p-8 shadow-card">
            <div className="letter-wax flex flex-col items-center gap-2">
              <SigilGlyph
                spec={halfLitSeal(preview.seed)}
                size={104}
                detail="full"
              />
              <p className="font-display text-[10px] tracking-widest text-violet">
                HALF-KEPT · IT CANNOT CLOSE ALONE
              </p>
            </div>

            <div className="letter-page mt-5 flex flex-col items-center gap-3 text-center">
              {character ? (
                <KeeperGlyph
                  archetype={character}
                  size={64}
                  title={`${preview.inviterName}, at the mantle`}
                />
              ) : null}
              <h1 className="font-display text-2xl leading-tight tracking-wide">
                {preview.inviterName} is keeping a book,
                <br />
                and half of it is yours
              </h1>
              {preview.message ? (
                <p className="letter-line text-base italic leading-snug text-ink">
                  “{preview.message}”
                </p>
              ) : null}
              <p className="text-sm text-ink-soft">
                Their half of the seal is already kept. Fill yours and the ring
                closes — the light on the island only lights for two.
              </p>
            </div>

            <div className="mt-6">
              <JoinForm invite={invite} />
            </div>
          </div>
        ) : (
          <div className="wobbly border-2 border-ink/20 bg-cream/70 p-8 shadow-card">
            <div className="mb-6 flex flex-col items-center gap-3 text-center">
              <FamiliarGlyph stage="kit" size={72} title="A small arctic fox kit" />
              <h1 className="font-display text-2xl tracking-wide">
                begin your book
              </h1>
              <p className="text-sm text-ink-soft">
                A shared logbook for two — you&apos;ll invite the other keeper
                next.
              </p>
            </div>
            <JoinForm invite={invite} />
          </div>
        )}
        <p className="mt-4 text-center text-sm text-ink-soft">
          already have a book?{" "}
          <Link href="/enter" className="text-terracotta underline underline-offset-4">
            come in
          </Link>
        </p>
      </div>
    </main>
  );
}
