// The familiar — the couple's resident arctic fox, in Inklight (ink line over
// matte gouache), replacing the old pixel sprite. A front-facing seated kit
// whose antlers reveal across five stages, driven by lifetime both-logged days
// (thresholds in lib/engine/familiar.ts). Pure `foxSvg()` composer + a thin
// renderer, so it previews like the seal and swaps out for a hand-drawn master
// later. Deterministic → SSR-safe.

import type { FamiliarStageId } from "@/lib/engine/familiar";

const C = {
  ink: "#4a3b2a", cream: "#fbf6ea", creamDeep: "#efe6d2", shadow: "#ece0c6",
  terra: "#c4704b", gold: "#d9a441", goldSoft: "#ecd9a8", moss: "#7c8a4d",
};

// mirror an x across the vertical centerline (x=60)
const mx = (x: number) => 120 - x;

// antlers grow with the stage — ink branches tipped in gold. Symmetric.
function antlers(stage: FamiliarStageId): string {
  // each entry: a polyline "branch" of points [[x,y]...]; drawn left, mirrored right
  // bases sit near the top-center of the head and rise UP-and-out, crowning
  // above the ears (ear tips ~y15) so they read as antlers, not extra ears.
  const sets: Record<FamiliarStageId, number[][][]> = {
    kit: [],
    yearling: [[[53, 30], [49, 15]]],
    young: [
      [[53, 31], [47, 11]],
      [[50, 22], [44, 17]],
    ],
    adult: [
      [[53, 32], [45, 8]],
      [[51, 24], [43, 19]],
      [[48, 16], [41, 12]],
    ],
    elder: [
      [[53, 33], [43, 5]],
      [[51, 25], [42, 20]],
      [[49, 18], [40, 13]],
      [[46, 12], [38, 8]],
    ],
  };
  const branches = sets[stage];
  if (!branches.length) return "";
  const stroke = `stroke="${C.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  let paths = "", tips = "";
  for (const side of [1, -1] as const) {
    for (const b of branches) {
      const pts = b.map(([x, y]) => [side === 1 ? x : mx(x), y]);
      paths += `<path d="M ${pts.map((p) => p.join(" ")).join(" L ")}" ${stroke}/>`;
      const [tx, ty] = pts[pts.length - 1];
      tips += `<circle cx="${tx}" cy="${ty}" r="1.9" fill="${C.gold}" stroke="${C.ink}" stroke-width="0.7"/>`;
    }
  }
  return paths + tips;
}

export function foxSvg(stage: FamiliarStageId): string {
  const line = `stroke="${C.ink}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
  let s = "";

  // grounding shadow
  s += `<ellipse cx="60" cy="112" rx="26" ry="3.6" fill="${C.ink}" opacity="0.14"/>`;

  // antlers rise from behind the head
  s += antlers(stage);

  // ears (outer cream, inner terracotta) — behind the head
  for (const side of [1, -1] as const) {
    const f = (x: number) => (side === 1 ? x : mx(x));
    s += `<path d="M ${f(43)} 46 L ${f(31)} 15 L ${f(59)} 35 Z" fill="${C.cream}" ${line}/>`;
    s += `<path d="M ${f(43)} 42 L ${f(36)} 22 L ${f(54)} 35 Z" fill="${C.terra}" stroke="none" opacity="0.85"/>`;
  }

  // the chest/ruff below the chin, suggesting a seated body
  s += `<path d="M 47 76 C 41 92 46 106 60 107 C 74 106 79 92 73 76 C 68 84 52 84 47 76 Z" fill="${C.cream}" ${line}/>`;
  s += `<path d="M 53 92 q 7 5 14 0" fill="none" stroke="${C.shadow}" stroke-width="2" opacity="0.7"/>`;

  // the head
  s += `<path d="M 60 27 C 45 27 34 38 34 53 C 34 63 42 70 52 75 L 60 82 L 68 75 C 78 70 86 63 86 53 C 86 38 75 27 60 27 Z" fill="${C.cream}" ${line}/>`;

  // muzzle shadow + nose
  s += `<path d="M 52 66 Q 60 62 68 66 Q 66 77 60 82 Q 54 77 52 66 Z" fill="${C.shadow}" stroke="none"/>`;
  s += `<path d="M 55 66 L 65 66 L 60 71 Z" fill="${C.ink}"/>`;
  s += `<path d="M 60 71 Q 56 76 52 74 M 60 71 Q 64 76 68 74" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round"/>`;

  // cheek blush
  for (const side of [1, -1] as const) {
    const cx = side === 1 ? 44 : mx(44);
    s += `<circle cx="${cx}" cy="61" r="4.4" fill="${C.terra}" opacity="0.42"/>`;
  }

  // eyes (with a soft catchlight)
  for (const side of [1, -1] as const) {
    const cx = side === 1 ? 49 : mx(49);
    s += `<ellipse cx="${cx}" cy="54" rx="3" ry="3.8" fill="${C.ink}"/><circle cx="${cx - 1}" cy="52.4" r="1" fill="${C.cream}" opacity="0.9"/>`;
  }

  return s;
}

export function FamiliarGlyph({
  stage,
  size = 64,
  className,
  title,
}: {
  stage: FamiliarStageId;
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title ?? "the familiar"}
      dangerouslySetInnerHTML={{ __html: foxSvg(stage) }}
    />
  );
}
