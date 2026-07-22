import type { Metadata } from "next";
import { RuledHeading } from "@/components/ruled-heading";
import { TrendsRune } from "@/components/shell/rune-icons";
import { HeartMark } from "@/components/glyphs";
import {
  WeightChart,
  type ChartSeries,
} from "@/components/trends/weight-chart";
import { SLOTS, requireBond, type Slot } from "@/lib/bond";
import {
  getAllWeighIns,
  getDailyTotalsSince,
  getMonthMarks,
  type WeighInPoint,
} from "@/lib/data";
import { addDays, currentTz, diffDays, todayIso } from "@/lib/dates";

export const metadata: Metadata = {
  title: "The Almanac - signed × sealed",
};

// An engraved plate caption, field-guide style — the book's shared rule.
function PlateCaption({ numeral, title }: { numeral: string; title: string }) {
  return (
    <div className="mb-3">
      <RuledHeading title={`PLATE ${numeral} — ${title}`} />
    </div>
  );
}

// Fixed series colors, validated for CVD + contrast on the cream surface.
// Kennedy sits a shade deeper than the plate-frame gold (#d9a441) so her line
// and dots don't blend into the gilt border now that the Almanac is plated.
// Keyed by slot (moss | ember). NOTE: these differ from the glade's
// moss/terracotta — unifying keeper colors across surfaces is a deferred design
// task; here we preserve the current Almanac appearance.
const SERIES_COLORS: Record<Slot, string> = {
  moss: "#a45438",
  ember: "#b8751a",
};

function rollingAverage(points: WeighInPoint[]): WeighInPoint[] {
  return points.map((p, i) => {
    const window = points.filter(
      (q, j) => j <= i && diffDays(p.day, q.day) < 7,
    );
    const mean =
      window.reduce((sum, q) => sum + q.weightLb, 0) / window.length;
    return { day: p.day, weightLb: Math.round(mean * 10) / 10 };
  });
}

function weekLabel(monday: string): string {
  const fmt = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  return `${fmt(monday)}–${fmt(addDays(monday, 6))}`;
}

export default async function TrendsPage() {
  const { bondId, members } = await requireBond();
  const today = await todayIso();
  const tz = await currentTz();

  const [weighIns, dailyTotals, monthMarks] = await Promise.all([
    getAllWeighIns(bondId),
    getDailyTotalsSince(bondId, addDays(today, -42)),
    getMonthMarks(bondId, today.slice(0, 7)),
  ]);

  const series: ChartSeries[] = SLOTS.map((slot) => ({
    name: members[slot]?.displayName ?? "",
    color: SERIES_COLORS[slot],
    points: weighIns[slot],
    rolling: rollingAverage(weighIns[slot]),
  }));

  // Weekly averages over logged days, most recent weeks first.
  const dow = (new Date(today + "T12:00:00Z").getUTCDay() + 6) % 7;
  const thisMonday = addDays(today, -dow);
  const weeks = Array.from({ length: 6 }, (_, i) => addDays(thisMonday, -7 * i));
  const weeklyRows = weeks
    .map((monday) => {
      const sunday = addDays(monday, 6);
      const cells = SLOTS.map((slot) => {
        const days = dailyTotals[slot].filter(
          (t) => t.day >= monday && t.day <= sunday,
        );
        if (days.length === 0) return null;
        return {
          avgCal: Math.round(
            days.reduce((s, t) => s + t.calories, 0) / days.length,
          ),
          avgProtein: Math.round(
            days.reduce((s, t) => s + t.proteinG, 0) / days.length,
          ),
          logged: days.length,
        };
      });
      return { monday, cells };
    })
    .filter((w) => w.cells.some((c) => c !== null));

  // Calendar for the current month.
  const monthPrefix = today.slice(0, 7);
  const monthName = new Date(today + "T12:00:00").toLocaleDateString("en-US", {
    timeZone: tz,
    month: "long",
    year: "numeric",
  });
  const firstOfMonth = `${monthPrefix}-01`;
  const startDow = new Date(firstOfMonth + "T12:00:00Z").getUTCDay();
  const [yr, mo] = monthPrefix.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(yr, mo, 0)).getUTCDate();

  const cells: (string | null)[] = [
    ...Array.from({ length: startDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      addDays(firstOfMonth, i),
    ),
  ];

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 p-4 pb-16">
      <header className="text-center">
        <h1 className="flex items-center justify-center gap-2 font-display text-2xl tracking-wide">
          <TrendsRune size={24} /> THE ALMANAC
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          the quiet data book — your numbers, drawn as plates
        </p>
      </header>

      <section className="plate p-4">
        <span className="plate-corner tl" aria-hidden />
        <span className="plate-corner tr" aria-hidden />
        <span className="plate-corner bl" aria-hidden />
        <span className="plate-corner br" aria-hidden />
        <PlateCaption numeral="I" title="THE WEIGHT LINE" />
        <p className="mb-3 text-xs text-ink-soft">
          Dots are mornings; the line is your 7-day average — steer by the
          line, not the dots.
        </p>
        <WeightChart series={series} />
        {series.some((s) => s.points.length > 0) ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {series.map((s) => (
              <div key={s.name}>
                <p className="flex items-center gap-1.5 font-display text-[10px] tracking-wide text-ink-soft">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.name.toUpperCase()} — RECENT
                </p>
                <ul className="mt-1 text-xs text-ink-soft">
                  {s.points.slice(-4).reverse().map((p) => (
                    <li key={p.day} className="flex justify-between">
                      <span>
                        {new Date(p.day + "T12:00:00").toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                      <span className="font-display">{p.weightLb} lb</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="plate p-4">
        <span className="plate-corner tl" aria-hidden />
        <span className="plate-corner tr" aria-hidden />
        <span className="plate-corner bl" aria-hidden />
        <span className="plate-corner br" aria-hidden />
        <PlateCaption numeral="II" title="THE WEEKS, AVERAGED" />
        {weeklyRows.length === 0 ? (
          <p className="text-sm text-ink-soft">
            Averages appear once meals start landing in the logbook.
          </p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left font-display text-[10px] text-ink-soft">
                <th className="pb-1 font-normal">WEEK</th>
                {SLOTS.map((slot) => (
                  <th key={slot} className="pb-1 text-right font-normal">
                    {(members[slot]?.displayName ?? "").toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeklyRows.map((w) => (
                <tr key={w.monday} className="border-t border-ink/10">
                  <td className="py-1.5 text-ink-soft">
                    {weekLabel(w.monday)}
                  </td>
                  {w.cells.map((c, i) => (
                    <td key={i} className="py-1.5 text-right">
                      {c ? (
                        <>
                          <span className="font-display">{c.avgCal}</span>
                          <span className="text-ink-soft"> kcal · </span>
                          <span className="font-display">{c.avgProtein}</span>
                          <span className="text-ink-soft">
                            g P ({c.logged}d)
                          </span>
                        </>
                      ) : (
                        <span className="text-ink-soft/50">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="plate p-4">
        <span className="plate-corner tl" aria-hidden />
        <span className="plate-corner tr" aria-hidden />
        <span className="plate-corner bl" aria-hidden />
        <span className="plate-corner br" aria-hidden />
        <PlateCaption numeral="III" title={monthName.toUpperCase()} />
        <div className="grid grid-cols-7 gap-1 text-center">
          {["s", "m", "t", "w", "t", "f", "s"].map((d, i) => (
            <span
              key={`${d}${i}`}
              className="font-display text-[9px] text-ink-soft"
            >
              {d}
            </span>
          ))}
          {cells.map((day, i) =>
            day === null ? (
              <span key={`pad-${i}`} />
            ) : (
              <div
                key={day}
                title={[
                  day,
                  monthMarks.bothDays.has(day) ? "both logged" : null,
                  ...SLOTS.map((slot) =>
                    monthMarks.training[slot][day]
                      ? `${members[slot]?.displayName ?? ""} ${monthMarks.training[slot][day]}`
                      : null,
                  ),
                ]
                  .filter(Boolean)
                  .join(" · ")}
                className={`wobbly-sm flex min-h-9 flex-col items-center justify-center border ${
                  day > today
                    ? "border-transparent text-ink-soft/30"
                    : monthMarks.bothDays.has(day)
                      ? "border-gold bg-gold-soft"
                      : "border-ink/10"
                }`}
              >
                <span className="text-[10px] leading-none">
                  {Number(day.slice(8))}
                </span>
                <span className="flex items-center gap-0.5 text-[8px] leading-tight">
                  {monthMarks.bothDays.has(day) && day <= today ? (
                    <HeartMark size={7} className="text-terracotta" />
                  ) : null}
                  {SLOTS.map((slot) =>
                    monthMarks.training[slot][day] ? (
                      <span
                        key={slot}
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: SERIES_COLORS[slot] }}
                      />
                    ) : null,
                  )}
                </span>
              </div>
            ),
          )}
        </div>
        <p className="mt-2 text-center text-[10px] text-ink-soft">
          <HeartMark size={9} className="inline-block align-middle text-terracotta" /> both logged ·{" "}
          {SLOTS.map((slot, i) => (
            <span key={slot}>
              {i > 0 ? " · " : ""}
              <span
                className="inline-block h-1.5 w-1.5 rounded-full align-middle"
                style={{ backgroundColor: SERIES_COLORS[slot] }}
              />{" "}
              {members[slot]?.displayName ?? ""} trained
            </span>
          ))}
        </p>
      </section>
    </main>
  );
}
