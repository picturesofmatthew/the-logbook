import type { Metadata } from "next";
import Link from "next/link";
import { FamiliarGlyph } from "@/components/familiar/familiar-glyph";
import {
  KEEPER_ARCHETYPES,
  KeeperGlyph,
  type KeeperArchetype,
} from "@/components/keeper/keeper-glyph";
import { SigilGlyph } from "@/components/sigil/sigil-glyph";
import { DoorGround } from "@/components/world/door-ground";
import type { SigilSpec } from "@/lib/engine/sigil";
import { invitePreview } from "@/lib/invites";
import { getSessionUser } from "@/lib/session";
import { logout } from "@/app/settings/actions";
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
  // A letter that no longer opens — used, expired, or a mangled link. This page
  // used to fall silently back to "begin your book", which is how a keeper ends
  // up starting a SECOND book instead of joining the one they were called to.
  const fadedLetter = !!invite && !preview;
  // Already signed in? A keeper holds one book; accepting a letter from this
  // seat would quietly start another. Say so instead of showing a signup form.
  const viewer = await getSessionUser();

  if (viewer) {
    return (
      <DoorGround>
        <div className="wobbly border-2 border-gold/30 bg-cream/90 p-8 text-center shadow-card">
            <h1 className="font-display text-2xl tracking-wide">
              you already keep a book
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              You&apos;re signed in as {viewer.displayName}.{" "}
              {invite
                ? "A letter can only be answered by a keeper who doesn't have a book yet — a keeper holds one, and two books can't be merged. Sign out to answer this one from a different account."
                : "There's nothing to begin here."}
            </p>
            <Link
              href="/"
              className="mt-5 inline-block font-display text-sm tracking-wide text-terracotta underline underline-offset-4"
            >
              back to your world
            </Link>
          <form action={logout} className="mt-4 border-t border-ink/10 pt-4">
            <button
              type="submit"
              className="cursor-pointer text-xs text-ink-soft underline decoration-dotted underline-offset-2"
            >
              sign out
            </button>
          </form>
        </div>
      </DoorGround>
    );
  }

  return (
    <DoorGround
      wordmark={!preview}
      footer={
        <p>
          already have a book? <Link href="/enter">come in</Link>
        </p>
      }
    >
      <>
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
          <div className="wobbly border-2 border-gold/30 bg-cream/90 p-8 shadow-card">
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

            {/* The fork that has to be unmissable: beginning here starts a
                SEPARATE book, and two books can't be merged. */}
            <div className="wobbly-sm mb-6 border-2 border-dashed border-terracotta/50 bg-gold-soft/25 p-3 text-center">
              <p className="font-display text-[10px] tracking-widest text-terracotta">
                {fadedLetter ? "THAT LETTER NO LONGER OPENS" : "WERE YOU SENT A LETTER?"}
              </p>
              <p className="mt-1 text-xs leading-snug text-ink-soft">
                {fadedLetter
                  ? "It was already opened, or it faded — letters last a week. Ask them to press a new seal and send it again. Beginning below starts a separate book instead of joining theirs, and two books can't be merged."
                  : "Open their link instead — it carries their half of the seal. Beginning here starts a separate book, and two books can't be merged."}
              </p>
            </div>

            <JoinForm invite={invite} />
          </div>
        )}
      </>
    </DoorGround>
  );
}
