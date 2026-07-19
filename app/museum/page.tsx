import type { Metadata } from "next";
import Link from "next/link";
import {
  SpecimenCard,
  type SpecimenCardData,
} from "@/components/museum/specimen-card";
import { DISPLAY_NAMES, PROFILES, type Profile } from "@/lib/auth";
import { getAllSpecimens } from "@/lib/data";
import { currentTz } from "@/lib/dates";
import { HALLS } from "@/lib/halls";
import { currentProfile } from "@/lib/session";

export const metadata: Metadata = {
  title: "The Museum - signxsealed",
};

export default async function MuseumPage() {
  await currentProfile();
  const tz = await currentTz();
  const specimens = await getAllSpecimens();

  const donationCounts = Object.fromEntries(
    PROFILES.map((p) => [
      p,
      specimens.filter((s) => s.discoveredBy === p).length,
    ]),
  ) as Record<Profile, number>;

  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "short",
    day: "numeric",
  });

  function toCard(s: (typeof specimens)[number]): SpecimenCardData {
    return {
      id: s.id,
      name: s.name,
      icon: s.icon,
      servingLabel: s.servingLabel,
      calories: s.calories,
      proteinG: s.proteinG,
      carbsG: s.carbsG,
      fatG: s.fatG,
      donorName:
        DISPLAY_NAMES[s.discoveredBy as Profile] ?? s.discoveredBy,
      discoveredLabel: fmt.format(new Date(s.discoveredAt)),
    };
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 p-4 pb-16">
      <header className="text-center">
        <h1 className="font-pixel text-2xl tracking-wide">🏛 THE MUSEUM</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {specimens.length}{" "}
          {specimens.length === 1 ? "specimen" : "specimens"} ·{" "}
          {PROFILES.map((p) => `${DISPLAY_NAMES[p]} ${donationCounts[p]}`).join(
            " · ",
          )}
        </p>
        <Link
          href="/"
          className="mt-1 inline-block text-sm text-ink-soft underline decoration-dotted underline-offset-4"
        >
          back to the journal
        </Link>
      </header>

      {specimens.length === 0 ? (
        <div className="wobbly border-2 border-dashed border-ink/25 p-8 text-center text-ink-soft">
          <p className="text-3xl">🏛</p>
          <p className="mt-2">
            The halls are empty and echoing. Log your first meal to donate the
            museum&apos;s very first specimen.
          </p>
        </div>
      ) : (
        HALLS.map((hall) => {
          const inHall = specimens.filter((s) => s.hall === hall.id);
          return (
            <section key={hall.id}>
              <h2 className="mb-2 flex items-baseline justify-between font-pixel text-sm tracking-wide">
                <span>
                  {hall.emoji} {hall.label.toUpperCase()}
                </span>
                <span className="text-[10px] text-ink-soft">
                  {inHall.length || "—"}
                </span>
              </h2>
              {inHall.length === 0 ? (
                <p className="wobbly-sm border-2 border-dashed border-ink/15 px-3 py-2 text-xs text-ink-soft/70">
                  awaiting its first donation
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {inHall.map((s) => (
                    <SpecimenCard key={s.id} s={toCard(s)} />
                  ))}
                </div>
              )}
            </section>
          );
        })
      )}
    </main>
  );
}
