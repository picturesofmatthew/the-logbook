import type { Metadata } from "next";
import Link from "next/link";
import { FamiliarGlyph } from "@/components/familiar/familiar-glyph";
import { EnterForm } from "./enter-form";

export const metadata: Metadata = {
  title: "Come in — signed × sealed",
};

export default function EnterPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="wobbly border-2 border-ink/20 bg-cream/70 p-8 shadow-card">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <FamiliarGlyph stage="kit" size={88} title="A small arctic fox kit" />
            <h1 className="font-display text-3xl tracking-wide">
              signed<span className="text-violet"> × </span>sealed
            </h1>
            <p className="text-ink-soft">a spellbook for two</p>
          </div>
          <EnterForm />
        </div>
        <p className="mt-4 text-center text-sm text-ink-soft">
          new here?{" "}
          <Link
            href="/join"
            className="text-terracotta underline underline-offset-4"
          >
            begin a book
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-ink-soft/70">
          <Link href="/privacy" className="underline underline-offset-4">
            privacy &amp; your health data
          </Link>
        </p>
      </div>
    </main>
  );
}
