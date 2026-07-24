# The Atoms — evening build handoff

*Pickup doc, 2026-07-24 (Matthew). Decided after two exploration lenses (an over-engineering audit + a
fresh-angles pass) **converged on the same conclusion**: the retention and the moat don't live in the
five-room world — they live in two atoms, **the light that waits for your partner** and **the record
you'd never delete**. So: **shrink the daily loop to a light and a word; freeze the world-deepening;
keep the LLM layer dormant; take the free cuts.** Everything grand (the lighthouse, the boat, the
archipelago) becomes the reward you *visit*, not the daily toll. Build from this tonight.*

**Branch:** `feat/world-interactivity` (NOT merged to main, NOT deployed). `npm test` green,
`tsc` clean. Testing on the current live signup is unaffected and open now.

---

## BUILT — the evening run (2026-07-24 night, branch `feat/world-interactivity`)

All five build-order items landed. `npm test` **89/89**, `tsc` clean, build green, lint back to its
pre-existing 9. Migration `0011_sealed_word_and_cold_open` generated **and applied** (additive +
nullable, so the deployed code was never affected). Still **not merged, not deployed.**

1. **The Carry** ✅ — `"carry"` in `ChordId` + `CHORD_REGISTRY` (seated by the Mirror), its rune (a
   shoulder under a leaning stroke) in `CHORD_GLYPHS`, tests for both seats + the both-low and
   both-strong non-cases. Chord count reconciled 12 → **13** in `SIGIL-HANDOFF.md`.
2. **The Sealed Word** ✅ (v1) — `day_meta.sealed_word`, AES-GCM at rest. The reveal law is one pure
   tested module (`lib/sealed-word.ts`), applied server-side at every boundary, so an unopened word
   never crosses to the client. Written in the capture sheet's new signature line; revealed as the
   ceremony's third beat and permanently in `app/book/[day]` (both words cross at a violet ×).
   `lib/leave.ts`: a word that OPENED was delivered and stays in the recipient's book; undelivered
   ones leave with their writer. **v1.1 remains: the words crossing at the sigil's own union ×.**
3. **The free cuts** ✅ — `world-spread.tsx` + its ~155 lines of CSS deleted (hotspots open the real
   pages); the bestiary is pure — `beingStates()` now derives `arrivedOn`, so the render-time
   `recordArrival` loop, `getArrivals`/`recordArrival` and the arrival ceremony are gone and the Pale
   Elk is a live glimpse again. `being_arrivals` kept in-schema, marked retired.
4. **The Letter** ✅ — write a line + **press the seal** (`invites.message`), and `/join?invite=`
   unfurls: the living half-lit seal, their keeper figure, their line, wax → unroll → ink. Onboarding
   went light with it: signup now elects a **character** (the 8 archetypes, drawn in the picker) and a
   **vow**. Acceptance is a once-per-book greeting (`keeper-arrival-ceremony.tsx`).
   **Remaining: the elected character at the hearth MANTLE** — surgery on the baked hearth art, i.e.
   world-deepening, which is frozen.
5. **The patient day** ✅ — the couple-day turns at a grace hour (default **4am**,
   `COUPLE_DAY_ROLLOVER`; 0 = old behaviour), one chokepoint `coupleDayOf`/`coupleDayFor`,
   unit-tested, invariant unchanged. The hearth says it out loud past midnight (`inNightGrace()`).
   **Not done, wants Matthew's eye: the leaner `/` surface that is mostly the light** (a redesign of
   the daily face — not a unilateral call while the world is frozen).

**Next session:** dogfood the two atoms (the word + the patient night) before adding anything · the
v1.1 crossing-at-the-× · the mantle character · the leaner daily face (Matthew's call) · then the
strategic one below — the parallel screen-app (two nav systems, two logging UIs), still to discuss.

---

## Already banked this session (don't redo)

- **Schema contracts** — `profiles.character` / `vow` / `vowKind`, `invites.message` (for the Letter).
  *Migration NOT yet generated/applied* — do that when the onboarding/Letter code lands
  (`npx drizzle-kit generate` + `npm run migrate`; never `push`).
- **Keeper cast** — `components/keeper/keeper-glyph.tsx`: 8 Inklight archetypes + `keeperSvg` composer
  (reusable when onboarding-light lands).
- **LLM-assisted logging** — flag-gated behind `FOOD_PARSE_LLM`, **off by default, dormant**. Do NOT
  extend it (the audit flagged it as speculative; it's harmless while off).
- **Anti-drift pass** — `ROADMAP.md` register created; sigil counts reconciled to the engine (8 halls,
  7 lift families); the Commons ideas rescued into `THE-BEACON.md`.
- **Free cut #1 done** — deleted the dead `lib/engine/stamps.ts` (+ its two tests). 80/80.

---

## The build order (cheapest + safest first)

### 1. The Carry — a chord that speaks *support*, not just *sameness*  ·  LOW risk, ~half a day
Every chord today fires on alignment. The days a couple most needs warmth are the **asymmetric** ones —
one had a brutal day. The Carry strikes when one keeper is low and the other showed up strong: the
strong light reaches over. Turns the scariest churn moment (one partner slumping) into the tenderest
mark in the book instead of a dark, missing chord. **Groundwork's done — this is ready to type.**
- **`lib/engine/sigil.ts`** — (a) add `"carry"` to the `ChordId` union; (b) append a `ChordDef` to
  `CHORD_REGISTRY` (seat it near `"mirror"`, the mood-adjacent chords):
  - `name: "the Carry"`, `line: "one hard day, carried by the other"`.
  - `detect(a,b)`: exactly one keeper is low-mood and the other is **not** low and had a strong day.
    Reuse `isLowMood()` (already exported). Define `strong(k) = k.training.trained || (k.targetProteinG
    != null && k.proteinG >= k.targetProteinG)`. So:
    `const carry = (lo, hi) => isLowMood(lo.mood) && !isLowMood(hi.mood) && strong(hi); return carry(a,b) || carry(b,a);`
  - `chordsForDay` already guards `both loggedAny`, so no extra logged check. No `subsumes`.
- **`components/sigil/glyphs.ts`** — `CHORD_GLYPHS` is `Record<ChordId, Glyph>` (exhaustive), so adding
  the id **requires** a rune. Author a `carry:` glyph in the terse path style of its neighbors — a
  **shoulder under a leaning stroke** (one upright bearing a second that leans into it). Keep it one
  or two `<path>`s, same weight.
- **Test** — sigil/chord tests aren't in `tests/engine.test.ts` (they're not there). Confirm where
  `chordsForDay` is exercised (grep found `tests/boat.test.ts` + `tests/inklight.test.ts` import from
  `sigil`; check both, or add `tests/sigil.test.ts`). Assert: an asymmetric day (one low + one strong)
  yields `"carry"`; a both-low day does NOT (that's Ember Vigil's register); a both-strong day does not.
- The registry drives the compendium + the seal render automatically — no other wiring.

### 2. The Sealed Word — a line to your partner, pressed into the day's seal, kept forever  ·  MEDIUM, the retention hero
Answers the app's literal name (*Signed × Sealed* records only macros today) and turns the Book of Days
from a food diary into a **rereadable correspondence** — the hero for long-distance. **Matthew's steer:
let the two words cross at the × of the sigil** (the seal already composes from both your data; now from
both your *words*).
- **Schema** — a per-keeper-per-day encrypted message-to-partner. Check `day_meta`'s shape (it already
  holds encrypted `note`/`mood` via `lib/crypto.ts` AES-GCM). Add a `sealed_word` (encrypted text)
  alongside `note`, or a small dedicated table if `day_meta` isn't per-keeper. Encrypt on write, decrypt
  on read at every boundary (mirror the `note` handling exactly).
- **Write** — one optional line at log-close (the capture flow: `components/shell/capture-sheet.tsx` /
  the close action). Store encrypted.
- **Reveal** — shown to the partner **only when the seal completes** (both logged), and permanently in
  `app/book/[day]`. Never before completion (the reveal is earned).
- **Render at the × (Matthew's addition)** — the moss + ember words cross at the sigil's union center
  (`components/sigil/glyphs.ts`, the union gem region). This is the deeper part — **v1 can ship the
  words on completion + in the book; the crossing-at-the-× is the v1.1 flourish.**
- Note: this is the permanent cousin of the ephemeral voice note (which expires into the night) — it
  may make the voice note optional rather than the main "speak to your partner" channel.

### 3. The patient day + the waiting light — the long-distance hero mechanic  ·  MEDIUM-HIGH, careful
The async close window (filed in ROADMAP as **Track A / reliability**) is really the LDR hero: for a
couple twelve timezones apart, "your today" and "their today" don't line up, and the seal can split.
Make the day **patient** — the seal stays half-lit past local midnight until both log, within a grace
window.
- **`lib/dates.ts`** (`coupleTz()` / the couple-day bucket) — extend the bucket to a rolling grace
  window. ⚠ **This touches the ONE load-bearing bucketing invariant** — do it as a deliberate,
  unit-tested engine pass, NOT a side effect. Highest-care item on the list.
- **The waiting light** — foreground the half-lit seal as the daily face (the "your keeper hasn't
  sealed yet" tenderness, never a nag). Consider a leaner `/` surface that is mostly *the light*
  (dark / half-lit / whole) — this dovetails with the audit's "shrink the daily surface."

### 4. The Letter — the invite made worthy (the growth engine; keep it)  ·  MEDIUM
The one piece of the paused onboarding-world build that's load-bearing: the half-lit seal you *send* is
the acquisition unit. Keep onboarding **light** around it (name + character-lite + vow — don't
over-cinematic).
- **Compose** — `app/invite/invite-panel.tsx` + `makeInvite()` (`app/invite/actions.ts`) →
  `createInvite()` (`lib/invites.ts`). Add a summons line + a press-your-seal gesture; persist the line
  on `invites.message` (column already added ✓). Output stays a **$0 share link**.
- **Unfurl** — `app/join/page.tsx` (`?invite=`). Transform the small card into the **letter**: addressed
  to them, the summons line, the **living half-lit seal** (the sender's inked side), the dark island
  that lights on accept. Extend `invitePreview(token)` (`lib/invites.ts`, returns `{inviterName}` today)
  to also return `{ message, inviterCharacter, halfSealSpec }`.
- **Acceptance** — when ember joins, the sender's world gains the second sprite; `needsKeeper`
  (`app/page.tsx`) already flips false — make the arrival a small ceremony.

### 5. The remaining free cuts  ·  LOW–MEDIUM
- **Collapse the `world-spread` stub.** Today room hotspots open a v1 title-page that *deep-links OUT*
  to the real legacy pages — a stub nobody reads, adding a tap + a maintenance layer. Point hotspots
  **straight at the real pages** (`components/world/world-spread.tsx` + the `onOpen`/`onDeepLink` in
  `world-shell.tsx`). Collapses three layers to two, no new build.
- **Trim the bestiary to its pure derivation.** Drop the **render-time** `recordArrival` write-loop in
  `app/page.tsx` (~L80 — the fragile pattern the risk register flagged); keep the pure `beingStates`.
  Defer the arrival ceremony / dedicated book unless a real couple loves beings.
- **(Strategic, discuss first) the parallel screen-app.** The audit's #1: the old app never got deleted
  — two nav systems (the ribbon still links `/library` `/book` `/trends`), two logging UIs
  (`components/journal/*` vs `components/shell/capture-sheet.tsx`). Picking one lane is the biggest
  accidental-complexity win, but it's a real decision — **talk it through before cutting.**

---

## Frozen (do NOT resume until a paying couple says the world is why they stay)
Deepening every interior into a rereadable spread · the cast cinematic (rise-to-lamp, beam sweep) · the
archipelago · world-wide day/night · any new rooms or room surface. Both lenses said: stop growing it.

## Discipline (unchanged)
$0-until-users (LLM stays dormant) · current web stack, no native rewrite · every ornament on a **true**
number · tone law (no streaks, no scold, the world states the score wordlessly) · game-*feel* not scope.

## Open decisions waiting on Matthew (logged in ROADMAP.md)
- **Font stack** — BRAND-BIBLE bans neutral sans, but the app runs Fraunces + **Hanken Grotesk**. Lean:
  bless one quiet grotesk for tiny UI labels, keep serif for display.
- **Publish the private tenancy design** (`~/.claude/plans/distributed-seeking-snail.md`) into the
  **public** repo? Lean: no — keep it private, just repoint the reference.

## Suggested evening order
The Carry (finish — it's teed up) → the Sealed Word v1 → the two easy cuts (world-spread stub, bestiary
render-writes) → the Letter → the patient day (last, most care). Migration + `npm test`/build green
before any deploy talk.
