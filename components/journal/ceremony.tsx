"use client";

import { StarMark } from "@/components/glyphs";

export type CeremonyData = {
  icon: string;
  name: string;
  hallLabel: string;
  donorName: string;
  servingLabel: string;
  calories: number;
};

export function Ceremony({
  data,
  onClose,
}: {
  data: CeremonyData;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog"
      aria-label="New specimen discovered"
    >
      <div className="absolute inset-0 bg-ink/50" />
      <div className="ceremony-card relative w-full max-w-xs">
        <p className="mb-3 flex items-center justify-center gap-2 font-pixel text-sm tracking-widest text-gold-soft">
          <StarMark size={13} /> NEW SPECIMEN DISCOVERED <StarMark size={13} />
        </p>
        <div className="wobbly border-2 border-ink/30 bg-cream p-6 text-center shadow-card">
          <span className="block text-5xl">{data.icon}</span>
          <p className="mt-2 font-pixel text-lg leading-tight">{data.name}</p>
          <p className="mt-1 text-sm text-ink-soft">{data.hallLabel}</p>
          <p className="text-sm text-ink-soft">
            {data.servingLabel} · {Math.round(data.calories)} kcal
          </p>
          <p className="wobbly-sm mt-4 inline-block border border-gold bg-gold-soft px-3 py-1 text-xs">
            Donated by {data.donorName}
          </p>
        </div>
        <p className="mt-3 text-center text-xs text-cream/90">
          tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
