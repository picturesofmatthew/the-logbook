import type { Metadata } from "next";
import Link from "next/link";
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
      <header className="text-center">
        <h1 className="font-display text-2xl tracking-wide">
          invite your partner
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
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

      <Link
        href="/"
        className="self-center font-display text-[11px] tracking-widest text-ink-soft"
      >
        ← back to the glade
      </Link>
    </main>
  );
}
