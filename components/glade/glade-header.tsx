// The Glade header: the scene with the fox living in it, and the keeper's
// strip beneath — name, speech, days fed together. Replaces the old FoxHeader;
// same engine, bigger world.

import { PixelSprite } from "@/components/pixel-sprite";
import { PET_PALETTE, PET_SPRITES } from "@/components/sprites";
import { NameForm } from "@/components/pet/name-form";
import type { PetStateRaw } from "@/lib/data";
import type { GladeState } from "@/lib/ledger";
import {
  moodFor,
  nextStageIn,
  speechFor,
  stageForDays,
  PET_STAGES,
} from "@/lib/engine/pet";
import { DISPLAY_NAMES, PROFILES } from "@/lib/auth";
import { GladeScene, type BeingStages } from "./glade-scene";

export function GladeHeader({
  petState,
  today,
  dayNumber,
  glade,
  paleElk,
  hearthDay,
}: {
  petState: PetStateRaw;
  today: string;
  dayNumber: number;
  glade: GladeState;
  paleElk: boolean;
  hearthDay: boolean;
}) {
  const stage = stageForDays(petState.lifetimeDays);
  const stageLabel = PET_STAGES.find((s) => s.id === stage)?.label ?? stage;
  const mood = moodFor({
    loggedTodayCount: petState.loggedToday.length,
    daysSinceAnyEntry: petState.daysSinceAnyEntry,
  });
  const missing = PROFILES.find((p) => !petState.loggedToday.includes(p));
  const speech = speechFor(
    mood,
    today + mood,
    missing ? DISPLAY_NAMES[missing] : undefined,
  );
  const next = nextStageIn(petState.lifetimeDays);

  const stages = Object.fromEntries(
    glade.beings.map((b) => [b.id, b.stage]),
  ) as BeingStages;

  return (
    <header className="wobbly overflow-hidden border-2 border-ink/20 bg-cream/70 shadow-card">
      <div className="relative">
        <GladeScene
          tier={glade.tier}
          beings={stages}
          paleElk={paleElk}
          inklings={petState.loggedToday.length}
          hearthDay={hearthDay}
        />
        {/* The fox lives in the scene, by the lantern. */}
        <div
          className={`absolute bottom-[4%] left-[47%] ${
            mood === "lonely" ? "opacity-80 saturate-50" : ""
          }`}
        >
          <PixelSprite
            map={PET_SPRITES[stage]}
            palette={PET_PALETTE}
            className="idle-bounce h-12 w-12 pixelated"
            title={`${petState.name ?? "The fox"}, a ${stageLabel} — the Glade is ${glade.tier}`}
          />
          {mood === "thriving" ? (
            <span className="absolute -right-1 -top-1 animate-pulse font-pixel text-xs text-gold">
              ✦
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 pt-2">
        <div className="min-w-0 flex-1">
          {petState.name ? (
            <p className="truncate font-pixel text-sm tracking-wide">
              {petState.name}
              <span className="ml-1.5 text-[10px] text-ink-soft">
                the {stageLabel}
              </span>
            </p>
          ) : (
            <NameForm />
          )}
          <p className="mt-0.5 text-xs leading-snug text-ink-soft">
            “{speech}”
          </p>
          <p className="mt-0.5 text-[11px] text-ink-soft/80">
            ♥ {petState.lifetimeDays}{" "}
            {petState.lifetimeDays === 1 ? "day" : "days"} fed together
            {petState.currentRun >= 2 ? ` · ${petState.currentRun} in a row` : ""}
            {next ? ` · ${next.daysLeft} to ${next.label}` : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="font-pixel text-sm">day {Math.max(dayNumber, 1)}</p>
        </div>
      </div>
    </header>
  );
}
