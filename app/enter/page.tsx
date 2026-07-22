import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { FamiliarGlyph } from "@/components/familiar/familiar-glyph";
import { EnterForm } from "./enter-form";

export const metadata: Metadata = {
  title: "Come in — signed × sealed",
};

export default async function EnterPage() {
  // The door lists the bond's keepers, read from the DB (Postgres orders the
  // slot enum by declaration order, so moss shows before ember).
  const keepers = await db
    .select({ id: profiles.id, displayName: profiles.displayName })
    .from(profiles)
    .orderBy(asc(profiles.slot));

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
          <EnterForm keepers={keepers} />
        </div>
        <p className="mt-4 text-center text-sm text-ink-soft">
          the glade is waiting, and someone small is in it
        </p>
      </div>
    </main>
  );
}
