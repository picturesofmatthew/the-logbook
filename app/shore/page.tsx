import Link from "next/link";
import { DreamForm } from "@/components/shore/dream-form";
import { ShoreScene } from "@/components/shore/shore-scene";
import { getReachedShores } from "@/lib/data";
import { currentTz, friendlyDate, todayIso } from "@/lib/dates";
import { getGladeState } from "@/lib/ledger";
import { currentProfile } from "@/lib/session";
import { renameDream, setNextShore } from "./actions";

// THE FAR SHORE — the Dream in focus. Reached by tapping the distance on the
// Glade. The boat you're building, the reckoning of planks, the coffers (soon),
// and the setter. Detail lives here so the Glade stays a calm hub.
export default async function ShorePage({
  searchParams,
}: {
  searchParams: Promise<{ planks?: string }>;
}) {
  await currentProfile();
  const today = await todayIso();
  const [glade, reached, tz] = await Promise.all([
    getGladeState(today),
    getReachedShores(),
    currentTz(),
  ]);
  const dream = glade.dream;
  let boat = glade.boat;

  // Dev-only tuning aid: ?planks=N previews the vessel at N planks without
  // touching data — lets us see the whole assembly arc before real days accrue.
  // Gated to development so it can never be a live progress backdoor in prod.
  const sp = await searchParams;
  if (boat && sp.planks != null && process.env.NODE_ENV !== "production") {
    const n = Math.max(0, Math.min(boat.plankGoal, Math.round(Number(sp.planks)) || 0));
    boat = {
      ...boat,
      planksLaid: n,
      remaining: Math.max(0, boat.plankGoal - n),
      complete: n >= boat.plankGoal,
    };
  }

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-6rem)] w-full max-w-md flex-col gap-6 px-6 py-8">
      <header className="text-center">
        <p className="font-pixel text-sm tracking-widest text-violet-bright">
          THE FAR SHORE
        </p>
      </header>

      {dream && boat ? (
        <>
          <div className="wobbly overflow-hidden border border-ink/15 bg-cream/60 shadow-card">
            <ShoreScene boat={boat} dreamName={dream.name} />
          </div>

          {/* the reckoning — how whole the vessel is, spoken warmly */}
          <section className="text-center">
            <h1 className="font-serif text-2xl text-ink">{dream.name}</h1>
            {boat.complete ? (
              <p className="mt-1 font-pixel text-xs tracking-wide text-violet">
                the vessel is whole — you sail for {dream.name}
              </p>
            ) : (
              <p className="mt-1 text-sm text-ink-soft">
                <span className="font-pixel text-ink">{boat.planksLaid}</span> of{" "}
                {boat.plankGoal} planks set ·{" "}
                {boat.remaining === 1
                  ? "one plank from setting sail"
                  : `${boat.remaining} to go`}
              </p>
            )}
            {boat.goldenCount > 0 ? (
              <p className="mt-1 font-pixel text-[10px] tracking-wide text-gold">
                {boat.goldenCount} golden{" "}
                {boat.goldenCount === 1 ? "plank" : "planks"} in the hull — the
                brightest days
              </p>
            ) : null}
          </section>

          {/* the coffers — the real fund for the journey. Designed next; the slot
              lives here so it's visible where it will land. */}
          <section className="wobbly border border-dashed border-ink/20 bg-cream/40 p-4 text-center">
            <p className="font-pixel text-[10px] tracking-widest text-ink-soft">
              THE COFFERS
            </p>
            <p className="mt-1 text-xs italic text-ink-soft/80">
              what you set aside for {dream.name} will gather here.
            </p>
          </section>

          {/* the setter — a finished voyage begins the next vessel */}
          <section className="flex flex-col gap-3">
            {boat.complete ? (
              <>
                <p className="text-sm text-ink-soft">
                  The boat carried you home. Where to next?
                </p>
                <DreamForm
                  action={setNextShore}
                  cta="build the next vessel"
                  namePlaceholder="the next dream"
                />
              </>
            ) : (
              <>
                <p className="font-pixel text-[10px] tracking-widest text-ink-soft">
                  THE DREAM
                </p>
                <DreamForm
                  action={renameDream}
                  name={dream.name}
                  distanceDays={dream.distanceDays}
                  cta="save the dream"
                  namePlaceholder="Kauai"
                />
              </>
            )}
          </section>

          {/* shores reached — the record of voyages made */}
          {reached.length > 0 ? (
            <section className="flex flex-col gap-1.5">
              <p className="font-pixel text-[10px] tracking-widest text-ink-soft">
                SHORES REACHED
              </p>
              <ul className="flex flex-col gap-1">
                {reached.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between border-b border-ink/10 py-1 text-sm text-ink"
                  >
                    <span>{s.name}</span>
                    <span className="text-xs text-ink-soft">
                      {s.reachedDay ? friendlyDate(s.reachedDay, tz) : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : (
        <p className="text-center text-sm italic text-ink-soft">
          No far shore is set yet.
        </p>
      )}

      <Link
        href="/"
        className="mt-auto self-center font-pixel text-[10px] tracking-widest text-ink-soft"
      >
        ← back to the glade
      </Link>
    </main>
  );
}
