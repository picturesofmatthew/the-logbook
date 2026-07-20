import type { Macros } from "@/lib/engine/totals";
import type { Target } from "@/lib/meals";

function Bar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number | null;
}) {
  const over = max != null && value > max;
  const pct = max ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-3 font-pixel text-[10px] text-ink-soft">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-paper-deep">
        {max ? (
          <div
            className={`h-full rounded-full transition-[width] duration-500 ease-out ${over ? "bg-terracotta-soft" : "bg-moss"}`}
            style={{ width: `${pct}%` }}
          />
        ) : null}
      </div>
      <span
        className={`w-14 text-right font-pixel text-[11px] ${over ? "text-terracotta" : "text-ink-soft"}`}
      >
        {Math.round(value)}
        {max != null ? `/${max}` : ""}g
      </span>
    </div>
  );
}

// Calories as a number line, macros as little bars. Over-target renders in
// soft terracotta — a fact, not an alarm.
export function MacroBars({
  total,
  target,
}: {
  total: Macros;
  target: Target;
}) {
  const overCal = target != null && total.calories > target.calories;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span
          className={`font-pixel text-sm ${overCal ? "text-terracotta" : ""}`}
        >
          {Math.round(total.calories).toLocaleString()}
        </span>
        <span className="font-pixel text-[10px] text-ink-soft">
          {target ? `of ${target.calories.toLocaleString()} kcal` : "kcal"}
        </span>
      </div>
      <Bar label="P" value={total.proteinG} max={target?.proteinG ?? null} />
      <Bar label="C" value={total.carbsG} max={target?.carbsG ?? null} />
      <Bar label="F" value={total.fatG} max={target?.fatG ?? null} />
    </div>
  );
}
