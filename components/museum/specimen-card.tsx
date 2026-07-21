"use client";

import { useState } from "react";

export type SpecimenCardData = {
  id: number;
  name: string;
  icon: string;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  estimated: boolean;
  donorName: string;
  discoveredLabel: string;
};

export function SpecimenCard({ s }: { s: SpecimenCardData }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped(!flipped)}
      className="wobbly-sm min-h-28 cursor-pointer border-2 border-ink/20 bg-cream p-2.5 text-center shadow-card transition-all hover:border-gold"
      aria-pressed={flipped}
    >
      {flipped ? (
        <span key="back" className="card-flip block">
          <span className="block text-[11px] leading-tight">
            {Math.round(s.calories)} kcal
          </span>
          <span className="block text-[11px] leading-snug text-ink-soft">
            P {s.proteinG} · C {s.carbsG} · F {s.fatG}
          </span>
          <span className="block truncate text-[10px] text-ink-soft">
            per {s.servingLabel}
          </span>
          <span className="wobbly-sm mx-auto mt-1.5 block border border-gold bg-gold-soft px-1 py-0.5 text-[9px] leading-tight">
            Donated by {s.donorName}
            <br />
            {s.discoveredLabel}
          </span>
        </span>
      ) : (
        <span key="front" className="card-flip block">
          <span className="block text-3xl">{s.icon}</span>
          <span className="mt-1 block truncate text-xs leading-tight">
            {s.estimated ? (
              <span className="text-terracotta" title="an estimate">
                ~
              </span>
            ) : null}
            {s.name}
          </span>
          <span className="block font-display text-[10px] text-ink-soft">
            {Math.round(s.calories)} kcal
          </span>
        </span>
      )}
    </button>
  );
}
