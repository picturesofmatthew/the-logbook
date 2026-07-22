import type { Metadata } from "next";
import Link from "next/link";
import { FamiliarGlyph } from "@/components/familiar/familiar-glyph";
import { invitePreview } from "@/lib/invites";
import { JoinForm } from "./join-form";

export const metadata: Metadata = {
  title: "Begin a book — signed × sealed",
};

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite } = await searchParams;
  const preview = invite ? await invitePreview(invite) : null;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="wobbly border-2 border-ink/20 bg-cream/70 p-8 shadow-card">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <FamiliarGlyph stage="kit" size={72} title="A small arctic fox kit" />
            {preview ? (
              <>
                <h1 className="font-display text-2xl tracking-wide">
                  {preview.inviterName} is waiting for you
                </h1>
                <p className="text-sm text-ink-soft">
                  Their half of the seal is already kept. Fill yours to close the
                  first ring together.
                </p>
              </>
            ) : (
              <>
                <h1 className="font-display text-2xl tracking-wide">
                  begin your book
                </h1>
                <p className="text-sm text-ink-soft">
                  A shared logbook for two — you&apos;ll invite the other keeper
                  next.
                </p>
              </>
            )}
          </div>
          <JoinForm invite={invite} />
        </div>
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
