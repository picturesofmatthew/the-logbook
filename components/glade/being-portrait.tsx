// Framed windows into the Glade — each portrait is a tight viewBox around a
// being's scene-space position, so ceremony cards and the bestiary always
// show exactly what lives in the scene. Portrait mode reveals night-gated
// details (lantern eyes, the moth itself) in any light.

import type { BeingId } from "@/lib/engine/beings";
import {
  Crow,
  Hare,
  Heron,
  Koi,
  Moth,
  Owl,
  PaleElk,
  Salamander,
  Stag,
  Tortoise,
} from "./glade-scene";

// ⚠ Each viewBox frames a being at its scene-space position — the numbers
// track the translate() coordinates in glade-scene.tsx. Move a being there
// and its window here must move too, or portraits will frame empty ground.
// (Placeholder-art coupling; folds away when real sprite masters land.)
type Window = { viewBox: string; width: number; height: number };

const WINDOWS: Record<BeingId | "pale-elk", Window> = {
  stag: { viewBox: "276 50 60 78", width: 120, height: 156 },
  heron: { viewBox: "60 76 40 56", width: 100, height: 140 },
  tortoise: { viewBox: "102 114 34 28", width: 136, height: 112 },
  moth: { viewBox: "160 88 24 22", width: 120, height: 110 },
  crow: { viewBox: "12 52 30 28", width: 120, height: 112 },
  hare: { viewBox: "246 112 26 28", width: 104, height: 112 },
  salamander: { viewBox: "210 120 30 18", width: 150, height: 90 },
  owl: { viewBox: "320 104 20 22", width: 100, height: 110 },
  koi: { viewBox: "80 116 22 16", width: 132, height: 96 },
  "pale-elk": { viewBox: "12 48 66 64", width: 132, height: 128 },
};

export function BeingPortrait({
  being,
  stage = 1,
}: {
  being: BeingId | "pale-elk";
  stage?: number;
}) {
  const w = WINDOWS[being];
  return (
    <svg viewBox={w.viewBox} width={w.width} height={w.height} aria-hidden>
      {being === "stag" ? <Stag stage={stage} /> : null}
      {being === "heron" ? <Heron stage={stage} /> : null}
      {being === "tortoise" ? <Tortoise stage={stage} /> : null}
      {being === "moth" ? <Moth stage={stage} portrait /> : null}
      {being === "crow" ? <Crow stage={stage} portrait /> : null}
      {being === "hare" ? <Hare stage={stage} /> : null}
      {being === "salamander" ? <Salamander stage={stage} /> : null}
      {being === "owl" ? <Owl stage={stage} portrait /> : null}
      {being === "koi" ? <Koi stage={stage} /> : null}
      {being === "pale-elk" ? <PaleElk /> : null}
    </svg>
  );
}
