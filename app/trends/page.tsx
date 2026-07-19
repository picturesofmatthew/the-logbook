import type { Metadata } from "next";
import Link from "next/link";
import {
  WeightChart,
  type ChartSeries,
} from "@/components/trends/weight-chart";
import { DISPLAY_NAMES, PROFILES, type Profile } from "@/lib/auth";
import {
  getAllWeighIns,
  getDailyTotalsSince,
  getMonthMarks,
  type WeighInPoint,
} from "@/lib/data";
import { addDays, currentTz, diffDays, todayIso } from "@/lib/dates";
import { currentProfile } from "@/lib/session";

export const metadata: Metadata = {
  title: "Trends - signxsealed",
};

// Fixed series colors, validated for CVD + contrast on the cream surface.
const SERIES_COLORS: Record<Profile, string> = {
  matthew: "#a45438",
  kennedy: "#d9a441",
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
  await currentProfile();
  const today = await todayIso();
  const tz = await currentTz();

  const [weighIns, dailyTotals, monthMarks] = await Promise.all([
    getAllWeighIns(),
    getDailyTotalsSince(addDays(today, -42)),
    getMonthMarks(today.slice(0, 7)),
  ]);

  const series: ChartSeries[] = PROFILES.map((p) => ({
    name: DISPLAY_NAMES[p],
    color: SERIES_COLORS[p],
    points: weighIns[p],
    rolling: rollingAverage(weighIns[p]),
  }));

  // Weekly averages over logged days, most recent weeks first.
  const dow = (new Date(today + "T12:00:00Z").getUTCDay() + 6) % 7;
  const thisMonday = addDays(today, -dow);
  const weeks = Array.from({ length: 6 }, (_, i) => addDays(thisMonday, -7 * i));
  const weeklyRows = weeks
    .map((monday) => {
      const sunday = addDays(monday, 6);
      const cells = PROFILES.map((p) => {
        const days = dailyTotals[p].filter(
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
        <h1 className="font-pixel text-2xl tracking-wide">📈 TRENDS</h1>
        <Link
          href="/"
          className="mt-1 inline-block text-sm text-ink-soft underline decoration-dotted underline-offset-4"
        >
          back to the journal
        </Link>
      </header>

      <section className="wobbly border-2 border-ink/20 bg-cream/70 p-4 shadow-card">
        <h2 className="mb-1 font-pixel text-sm tracking-wide">WEIGHT</h2>
        <p className="mb-3 text-xs text-ink-soft">
          Dots are mornings; the line is your 7-day average — steer by the
          line, not the dots.
        </p>
        <WeightChart series={series} />
        {series.some((s) => s.points.length > 0) ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {series.map((s) => (
              <div key={s.name}>
                <p className="flex items-center gap-1.5 font-pixel text-[10px] tracking-wide text-ink-soft">
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
                      <span className="font-pixel">{p.weightLb} lb</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="wobbly border-2 border-ink/20 bg-cream/70 p-4 shadow-card">
        <h2 className="mb-3 font-pixel text-sm tracking-wide">
          WEEKLY AVERAGES
        </h2>
        {weeklyRows.length === 0 ? (
          <p className="text-sm text-ink-soft">
            Averages appear once meals start landing in the logbook.
          </p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left font-pixel text-[10px] text-ink-soft">
                <th className="pb-1 font-normal">WEEK</th>
                {PROFILES.map((p) => (
                  <th key={p} className="pb-1 text-right font-normal">
                    {DISPLAY_NAMES[p].toUpperCase()}
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
                          <span className="font-pixel">{c.avgCal}</span>
                          <span className="text-ink-soft"> kcal · </span>
                          <span className="font-pixel">{c.avgProtein}</span>
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

      <section className="wobbly border-2 border-ink/20 bg-cream/70 p-4 shadow-card">
        <h2 className="mb-3 font-pixel text-sm tracking-wide">
          {monthName.toUpperCase()}
        </h2>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["S", "M", "T", "W", "T2", "F", "S2"].map((d) => (
            <span
              key={d}
              className="font-pixel text-[9px] text-ink-soft"
            >
              {d.charAt(0)}
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
                  ...PROFILES.map((p) =>
                    monthMarks.training[p][day]
                      ? `${DISPLAY_NAMES[p]} ${monthMarks.training[p][day]}`
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
                  {monthMarks.bothDays.has(day) && day <= today ? "♥" : ""}
                  {PROFILES.map((p) =>
                    monthMarks.training[p][day] ? (
                      <span
                        key={p}
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: SERIES_COLORS[p] }}
                      />
                    ) : null,
                  )}
                </span>
              </div>
            ),
          )}
        </div>
        <p className="mt-2 text-center text-[10px] text-ink-soft">
          ♥ both logged ·{" "}
          {PROFILES.map((p, i) => (
            <span key={p}>
              {i > 0 ? " · " : ""}
              <span
                className="inline-block h-1.5 w-1.5 rounded-full align-middle"
                style={{ backgroundColor: SERIES_COLORS[p] }}
              />{" "}
              {DISPLAY_NAMES[p]} trained
            </span>
          ))}
        </p>
      </section>
    </main>
  );
}
