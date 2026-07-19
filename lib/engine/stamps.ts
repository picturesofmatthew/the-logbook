// Day stamps — little inked rewards on the journal page. Pure.

import type { Macros } from "./totals";
import type { Target } from "@/lib/meals";

export type Stamp = { id: string; emoji: string; label: string };

export function stampsForDay(input: {
  people: {
    name: string;
    total: Macros;
    target: Target;
    loggedAny: boolean;
    training: string | null;
    waterCups: number;
  }[];
  newSpecimens: number;
}): Stamp[] {
  const stamps: Stamp[] = [];

  if (input.people.length > 0 && input.people.every((p) => p.loggedAny)) {
    stamps.push({
      id: "both-logged",
      emoji: "♥",
      label: "both logged today",
    });
  }

  for (const p of input.people) {
    if (p.target && p.loggedAny && p.total.proteinG >= p.target.proteinG) {
      stamps.push({
        id: `protein-${p.name}`,
        emoji: "★",
        label: `${p.name} hit protein`,
      });
    }
    if (p.training === "lift" || p.training === "cardio") {
      stamps.push({
        id: `training-${p.name}`,
        emoji: p.training === "lift" ? "🏋" : "👟",
        label: `${p.name} trained`,
      });
    }
    if (p.waterCups >= 8) {
      stamps.push({
        id: `water-${p.name}`,
        emoji: "💧",
        label: `${p.name} watered the garden`,
      });
    }
  }

  if (input.newSpecimens > 0) {
    stamps.push({
      id: "new-specimens",
      emoji: "✦",
      label:
        input.newSpecimens === 1
          ? "new specimen donated"
          : `${input.newSpecimens} new specimens donated`,
    });
  }

  return stamps;
}
