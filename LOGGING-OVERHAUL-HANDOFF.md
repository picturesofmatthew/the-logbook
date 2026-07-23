# Handoff — the Logging-Tech Overhaul

**Written 2026-07-22, end of the multi-user-foundation session. Branch
`sigil-turn-foundation`, 61/61 tests, prod on B1 (cutover pending — see
CLAUDE.md Quick Resume).**

The next major phase (Matthew's stated priority after the B2–B4 cutover):
**make logging seamless — the fewest possible taps, the least friction, from
intent to a kept half-seal.** Logging is the atomic act of the whole product;
every tap of friction is a tax on the loop that has to fire *twice a day, by two
people*, forever. This handoff maps what exists and hands you a kickoff prompt.

## Why this matters (the thesis lens)

The moat is "the tracker you can't use alone." That only works if using it is
*effortless* — a two-player-mandatory app with high logging friction is a
two-player-mandatory app nobody finishes a week of. Retention = both keepers log
easily enough that the seal closes without it feeling like a chore.

## The current logging surface (map)

**The fast path — the Capture Sheet** (`components/shell/capture-sheet.tsx`, opened
from the center ribbon button). Two panes:
- *Eat*: a one-tap grid of recent specimens (`getRecentSpecimens`, bond+profile
  scoped) + a free-text "eat" line that estimates macros.
- *Train*: repeat-last-workout by split family (`getRecentWorkouts`), + free-text
  workout parsing.
- Data loaded by `app/capture/actions.ts` `loadCaptureData()`.

**Food entry paths** (`app/log/actions.ts`):
- `logEntry` — log a known museum food (foodId, meal, servings, day).
- `donateSpecimen` — a new food → the shared museum (the "museum IS the food DB"
  thesis: first log donates, reuse is ~2 taps), optionally logging it too.
- `createRecipe` — compose a dish from ingredients.

**The written-in estimate** (`app/api/food-estimate/route.ts` + `lib/engine/food-parse.ts`
`parseFoodLine`/`gramsFor`/`portionConfidence` + `lib/usda.ts`): a typed line
("2 eggs and toast") → parse portions → USDA lookup → a deterministic macro
estimate that files itself into a hall (wears a soft `~`, stays editable).

**Workout entry** (`app/train/actions.ts` + `lib/engine/training.ts` /
`workout-parse`): free-text lines ("bench 135x5x3, run 20min") expand into sets;
split family is guessed.

**The daily rituals** (`app/day/actions.ts`): water, mood, note, weight — these
live on `/today`, NOT in the fast capture path (a known friction gap: the old
roadmap flagged "water/mood in the fast-log path" as queued).

**Engine (pure, tested):** `lib/engine/food-parse.ts`, `training.ts`, `totals.ts`
— all unit-tested; extend tests as you change parsing.

## Known friction / opportunities (unverified leads — audit first)

- Common re-logs still cost meal + servings taps after the food tap.
- Water/mood/weight aren't in the fast path — they're a separate trip to `/today`.
- The "eat" line is powerful but discovery/trust of the estimate is unclear.
- Smart defaults are thin: meal could default by time of day; servings could
  default to last-used per food.
- No voice / photo / barcode input (bigger bets — gauge appetite).
- The seal is the reward, but the *moment after logging* (did my half land?)
  could be more immediate/satisfying.

## Open questions for Matthew (define the vision before building)

1. What's the friction you personally *feel* most when logging a normal day?
2. Appetite for new input modes — voice? photo-of-plate? barcode? — or is the
   win in making the *existing* text/tap path frictionless?
3. Is the target "log a known food in 1 tap" or "log anything I say in one line"?
4. Should water/mood/weight fold into the capture sheet (one place to log
   everything) or stay on `/today`?

## ⭐ Kickoff prompt (paste this to start the phase)

> We're starting the **logging-tech overhaul** for Signed × Sealed — the goal is
> **seamless, low-friction logging** (fewest taps from intent → a kept half-seal),
> because logging is the atomic act the two-player loop depends on twice a day.
>
> Before proposing anything, **audit the current logging friction**: trace every
> tap/interaction in each path — the Capture Sheet eat-grid + eat-line
> (`components/shell/capture-sheet.tsx`, `app/capture/actions.ts`,
> `app/log/actions.ts`, `app/api/food-estimate/route.ts`,
> `lib/engine/food-parse.ts`, `lib/usda.ts`), the train pane
> (`app/train/actions.ts`, `lib/engine/training.ts`), and the daily rituals that
> live off the fast path (`app/day/actions.ts`, `/today`). For each path, count
> the taps to log a *common* item and name where the friction/latency/ambiguity
> is. Use subagents to fan the audit out if useful.
>
> Then **bring me 3–5 concrete, ranked enhancement directions** with the
> tap-count before/after and the effort — e.g. one-tap re-log with remembered
> meal+servings, time-of-day meal defaults, folding water/mood/weight into the
> capture sheet, a stronger/clearer "eat" estimate, or a new input mode (voice/
> barcode/photo) if the effort is justified. **Ask me the 4 vision questions in
> `LOGGING-OVERHAUL-HANDOFF.md` first** so we aim at the friction I actually feel,
> then we pick the slice and build it — keeping the engine pure + unit-tested,
> the museum-is-the-food-DB thesis intact, and the tone rule (never a scold).
>
> Context: multi-user foundation (bond tenancy + accounts + pairing + encryption
> + breakup) is built; branch `sigil-turn-foundation`; read CLAUDE.md Quick
> Resume for the cutover state. Don't regress the bond/Slot scoping or the
> at-rest encryption of note/mood/weight.
