"use client";

import { useState } from "react";
import { diffDays } from "@/lib/dates-client";

export type ChartSeries = {
  name: string;
  color: string;
  points: { day: string; weightLb: number }[];
  rolling: { day: string; weightLb: number }[];
};

const W = 360;
const H = 190;
const PAD = { top: 12, right: 64, bottom: 22, left: 34 };

export function WeightChart({ series }: { series: ChartSeries[] }) {
  const [tip, setTip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const withData = series.filter((s) => s.points.length > 0);
  if (withData.length === 0 || withData.every((s) => s.points.length < 2)) {
    return (
      <p className="wobbly-sm border-2 border-dashed border-ink/25 px-4 py-6 text-center text-sm text-ink-soft">
        Keep weighing in — the trend line appears after a few mornings.
      </p>
    );
  }

  const allDays = withData.flatMap((s) => s.points.map((p) => p.day));
  const first = allDays.reduce((a, b) => (a < b ? a : b));
  const last = allDays.reduce((a, b) => (a > b ? a : b));
  const span = Math.max(diffDays(last, first), 1);

  const allW = withData.flatMap((s) => s.points.map((p) => p.weightLb));
  const yMin = Math.floor(Math.min(...allW) - 2);
  const yMax = Math.ceil(Math.max(...allW) + 2);

  const x = (day: string) =>
    PAD.left + (diffDays(day, first) / span) * (W - PAD.left - PAD.right);
  const y = (lb: number) =>
    PAD.top + (1 - (lb - yMin) / (yMax - yMin)) * (H - PAD.top - PAD.bottom);

  const yMid = Math.round((yMin + yMax) / 2);

  const fmt = (day: string) => {
    const d = new Date(day + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Weight trend chart"
      >
        {/* recessive grid */}
        {[yMin, yMid, yMax].map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(v)}
              y2={y(v)}
              stroke="#4a3b2a"
              strokeOpacity={0.12}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 5}
              y={y(v) + 3}
              textAnchor="end"
              fontSize={9}
              fill="#7a6a52"
            >
              {v}
            </text>
          </g>
        ))}
        <text
          x={PAD.left}
          y={H - 6}
          fontSize={9}
          fill="#7a6a52"
        >
          {fmt(first)}
        </text>
        <text
          x={W - PAD.right}
          y={H - 6}
          textAnchor="end"
          fontSize={9}
          fill="#7a6a52"
        >
          {fmt(last)}
        </text>

        {withData.map((s) => (
          <g key={s.name}>
            {/* raw weigh-ins: soft dots with a surface ring */}
            {s.points.map((p) => (
              <circle
                key={p.day}
                cx={x(p.day)}
                cy={y(p.weightLb)}
                r={3}
                fill={s.color}
                fillOpacity={0.45}
                stroke="#fbf6ea"
                strokeWidth={1}
              />
            ))}
            {/* 7-day rolling average */}
            {s.rolling.length >= 2 ? (
              <path
                d={s.rolling
                  .map(
                    (p, i) =>
                      `${i === 0 ? "M" : "L"}${x(p.day).toFixed(1)},${y(p.weightLb).toFixed(1)}`,
                  )
                  .join(" ")}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ) : null}
            {/* direct label at line end — ink text, colored chip */}
            {s.rolling.length > 0 ? (
              <g>
                <rect
                  x={x(s.rolling[s.rolling.length - 1].day) + 6}
                  y={y(s.rolling[s.rolling.length - 1].weightLb) - 4}
                  width={8}
                  height={8}
                  fill={s.color}
                  rx={2}
                />
                <text
                  x={x(s.rolling[s.rolling.length - 1].day) + 17}
                  y={y(s.rolling[s.rolling.length - 1].weightLb) + 4}
                  fontSize={10}
                  fill="#4a3b2a"
                >
                  {s.name}
                </text>
              </g>
            ) : null}
            {/* invisible fat hit targets for the tooltip */}
            {s.points.map((p) => (
              <circle
                key={`hit-${p.day}`}
                cx={x(p.day)}
                cy={y(p.weightLb)}
                r={10}
                fill="transparent"
                onPointerEnter={() =>
                  setTip({
                    x: x(p.day),
                    y: y(p.weightLb),
                    text: `${s.name} · ${fmt(p.day)} · ${p.weightLb} lb`,
                  })
                }
                onPointerLeave={() => setTip(null)}
                onClick={() =>
                  setTip({
                    x: x(p.day),
                    y: y(p.weightLb),
                    text: `${s.name} · ${fmt(p.day)} · ${p.weightLb} lb`,
                  })
                }
              />
            ))}
          </g>
        ))}
      </svg>

      {tip ? (
        <div
          className="wobbly-sm pointer-events-none absolute z-10 -translate-x-1/2 border-2 border-ink/20 bg-cream px-2 py-1 text-xs shadow-card"
          style={{
            left: `${(tip.x / W) * 100}%`,
            top: `${Math.max((tip.y / H) * 100 - 16, 0)}%`,
          }}
        >
          {tip.text}
        </div>
      ) : null}
    </div>
  );
}
