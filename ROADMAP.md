# ROADMAP — Signed × Sealed (toward a v1 for real couples)

*The phased build plan: "what we're building, in what order." Read `PROJECT-BRAIN.md` first for
state + decision log; this is the sequencing doc. Last updated 2026-07-21.*

## Where we are
- **Act One is LIVE** (Next.js 16 + Neon PWA): the two-keeper seal composing from both users' data,
  the full sigil engine (chords/tiers/legendaries), the glade + familiar + beings, the spellbook,
  fast food/workout logging, ceremonies, sound.
- **The Sigil Turn + the boat-to-the-far-shore quest are built** — the sigil is the hero of the home,
  a quest glimpse shows the ship sailing toward the Dream, `/shore` is the focus view.
- On branch **`sigil-turn-foundation`**. Two hardcoded keepers (matthew/kennedy), passcode-gated.
  **50/50 engine tests green.**

## North star
Both keepers log → the day's **sigil** composes → the completion **ceremony** fires → a **plank**
sets into the **boat** → the boat carries the whole glade (the **familiar** + **companions**, lanterns
lit, star-spirits aboard) to the shared **Dream** (far shore, e.g. Kauai). Retention = *the spell you
can only cast together* + *the accumulating shared book*. No streaks; the world states the score
wordlessly.

## Guardrails (carried)
- **$0 until users** — no recurring spend before paying couples.
- **Tone law** — no red numbers, no broken streaks; over-target renders in soft terracotta.
- **Sensitive / health-adjacent data** → real legal duties before ANY external user.
- **Not the Next.js you know** — read `node_modules/next/dist/docs/` before framework code (`AGENTS.md`).

---

## Phase 0 — Foundation & Organization  ← WE ARE HERE
**Goal:** a clean, on-model substrate so adding content, sigils, art, and UI later is frictionless.

**Done this session (2026-07-21):**
- ✅ **Consolidation / hardening pass** — removed the dead streak (`currentRun` + the "N in a row"
  display; aligns code with the no-streaks law); one source of truth for "both logged"
  (`bothLoggedDays()`); one KeeperDay assembly (`keeperDayFromDay()` — home + the book page can't
  drift); `?planks=N` dev-gated (kept for the ship-visual pass, closed as a prod backdoor). 50/50
  tests, clean typecheck.
- ✅ **`convex/` archived** — banner + `convex/README.md` + memory; parked native-rewrite artifact,
  kept to learn from, excluded from the build.
- ✅ **Coffers research recorded** — `COFFERS.md` (the real-money trip fund, decided at spec level).
- ✅ **`familiar` naming decided** — the fox is *the familiar* (resident creature), not a "pet".

**Remaining in Phase 0:**
- ⏳ **The `familiar` rename** — `pet` → `familiar` across code signifiers: `lib/engine/pet.ts` →
  `familiar.ts`, `getPetState` → `getFamiliarState`, `PetStateRaw` → `FamiliarStateRaw`, `PET_*`
  sprites → `FAMILIAR_*`, `components/pet/` → `components/familiar/`, `app/pet/` → `app/familiar/`.
  Code symbols only; the physical `pet` DB table stays (it gets `household_id` + its rename in the
  multi-user pass anyway). Mechanical, test-guarded, no behavior change.
- ⏳ **Doc reconciliation** — retire stale framing across the `.md` set (boat not bridge; familiar not
  pet; 50 not 44 tests; consolidation done; coffers researched). Audit in progress.

---

## Phase 1 — Art Direction & UI Overhaul  *(its own dedicated session)*
**Goal:** the app *feels* intentional; the Sigil Turn reads on first open (no more "mockup" feeling).

- **Cement the curative direction** — resolve the three fighting languages (pixel-art vs. ornate
  storybook vs. lightbox) into ONE committed visual identity. Reckon with `DIRECTION.md` +
  `art/ART-BIBLE.md`; *decide*, don't blend.
- **Full-app design pass** — bring every surface to the chosen language.
- **Build out the library** — the food museum / Compendium (beings + pantry/museum + artifacts) as
  one navigable book.
- **Rework the logging system** — log-first, lore-later; lower friction, faster time-to-first-value
  (`NEXT-SESSION.md` §2 macro/calorie fixes).
- **Sigils — a TON of time** — the composed seal, chord-runes, the emblem ladder
  (open→common→fine→resonant→legendary), the completion ceremony. The hero of the home.
- **The living quest** — realize "the companions sail with you": the familiar + beings aboard the
  ship, lanterns lit, star-spirit sprites; arriving = the whole world arriving together, not a bar
  hitting 100%.

*Prereq: Phase 0 substrate clean.*

---

## Phase 2 — Coffers (the real-money trip fund)
**Goal:** reaching the far shore coincides with a *real, funded* trip. **Researched — see `COFFERS.md`.**

- **Ship first ($0, zero risk):** a manual shared tracker — both log money set aside in their own
  account; the coffer is a shared thermometer; the app touches nothing.
- **Later:** link out to a rail the couple *owns* (a couple-controlled Stripe Payment Link, or a
  Zola/Hitchd cash registry); the coffer mirrors the total; friends can really contribute; the couple
  is merchant-of-record. **🚫 Never Stripe Connect.**
- **Deferred:** auto-mirror a real savings balance (Teller, not Plaid).
- *Decoupled* — build as a focused mini-pass whenever desired.

---

## Phase 3 — Multi-user v1 (usability beyond Matthew & Kennedy)  *(its own pass)*
**Goal:** any couple / partner pair can use it. **Documented now; built later.**

- **Onboarding** — a first-run flow; create the shared world.
- **Profiles / user information** — real user records replacing the two hardcoded keepers (`lib/auth.ts`).
- **Accounts** — per-user auth, replacing the single passcode gate (`lib/session.ts`).
- **Partner account entanglement** — invite + pairing; the half-lit seal one partner *sends* is the
  acquisition unit; the seal still can't close alone.
- **Households boundary** — `household_id` on every table; per-household familiar / museum / discovery
  board / ledger; session expiry + rotation; depersonalize "for Matthew & Kennedy" → the couple.
- (Billing per couple rides this track — deferred with it.)
- *Prereq: a v1-readiness technical audit at the start of this pass.*

---

## Sequence at a glance
**Phase 0 (now) → Phase 1 (art/UI session) → Phase 2 (coffers) + Phase 3 (multi-user v1).**
Phases 2 and 3 are decoupled from each other; Phase 1 comes before both. `$0 until users` throughout.
