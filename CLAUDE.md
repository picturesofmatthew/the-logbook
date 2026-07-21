@AGENTS.md

## What Signed × Sealed is

**Signed × Sealed** (shortcut `sxs`; signedxsealed.com, IG @signed_x_sealed) is a
**two-player-mandatory** couples / gym-partner wellness logbook, reframed as a shared arcane grimoire.
Two people log food + workouts; each day composes a deterministic **sigil (the seal)** from *both*
their data. **The seal cannot close alone** — that single rule is the product.

**The loop / thesis:** both log → the day's **sigil** composes → the completion **ceremony** fires →
a **spell** is cast → a **plank** lays on a **bridge** toward the couple's shared **Dream** (the far
shore, e.g. Kauai). Retention runs on *the spell you can only cast together* + an *accumulating shared
book* — **no streaks, never punishing** (the world states the score wordlessly). Moat = two-player
architecture an incumbent can't retrofit + trust (the book stays readable forever).

**Current form:** a **LIVE** Next.js 16 + Neon (Postgres) + Vercel **PWA** at signedxsealed.com —
"Act One" works today: the two-keeper seal, the full sigil engine (chords/tiers/legendaries), the
glade + beings, the spellbook, fast food/workout logging, ceremonies, sound. Two hardcoded keepers
(matthew/kennedy), passcode-gated. Pure engine in `lib/engine/*` (unit-tested, `npm test`).

**Strategic stance (DECIDED 2026-07-21):** **build on the current free stack.** The native
Expo + Convex + Rive rewrite (`LAUNCH-PATH.md`) is **PARKED until multiple users are willing to pay**
— only then is migration reconsidered. **$0 until users** is the law: no recurring spend before
paying couples. Beachhead ICP = **long-distance couples** (the cross-distance "love-tap" is the hero
there — and Matthew's own Oct-2026 Chiang Mai situation).

**Orientation:** read **`PROJECT-BRAIN.md`** first (state, decision log, full doc map). Design canon:
`THE-SIGIL-TURN.md` (thesis), `DIRECTION.md` + `art/ART-BIBLE.md` (art), `RISK-REGISTER.md` (the
contingency findings to build around).

## Quick Resume

- **Current focus (2026-07-21 evening):** ⭐ **The quest system (the boat to the far shore) is BUILT + being deployed.** This session wired **the second half of the spine**: both log → the day's seal closes → **a plank is set into a boat** → the vessel that carries you to your shared **Dream** (Kauai). **Pivoted the metaphor from a bridge to a BOAT** (Matthew's call): a plank = a both-logged day (derived, never stored); **vessel grandeur scales with the goal's gravity** — ≤21 planks = a dory, ≤55 = a sloop, else a grand **tall ship** (~90 planks = a 3-month deficit); its parts **rig on as planks accrue** (hull keel-up → deck/bowsprit → figurehead → 3 masts → yards → sails → pennant), with a **faint full-ship blueprint** shown from day one and **golden planks** (legendary/resonant days) as a gold wale. **Home restructured toward the Sigil Turn:** the **sigil is the hero** up top; a **quest glimpse** (sea + glowing far shore + your ship sailing toward it + a `toward Kauai · N of 90 planks` progress bar) in the middle; the **glade + fox demoted** to a quiet foot strip (creatures decentered). Tapping the glimpse → **`/shore`** focus view (the ship built in full + reckoning + shores-reached + the light Dream setter). New engine `lib/engine/boat.ts` (pure, 6 tests, **50/50 green**); `dreams` table (migration `0002`, Kauai seeded at **90 planks**); `getGladeState` returns `dream`+`boat` off the one ledger scan; arrival gated once-per-shore via `reachShore`. Verified live via Playwright (phone viewport). **Committed on `sigil-turn-foundation`.**
  - **Next up (this evening) — see the session log for the full catalogue:** (1) **`/enter` door** reoriented toward the quest (how far along the ship is, not the fox); (2) **visual tuning** of the ship/glimpse (empty-ship ghost boldness, far-shore size/tint, sea, seams, dory/sloop variants); (3) **coffers** design pass (Phase 1.5 — the real trip fund; slot already stubbed in `/shore`; open fork: gates arrival vs companion tracker); (4) **Stage-2 hardening pass** (remove the `?planks=N` `/shore` preview knob; kill the unused `currentRun` streak; unify the 3-way "both logged"; de-dupe `buildKeeperDay`; consolidate the 4 ceremony overlays; decide `convex/`'s fate — currently **excluded from `tsconfig`** to unblock the build); (5) refresh docs (`PROJECT-BRAIN`, `THE-SIGIL-TURN`) for the boat pivot.
- **Repo:** https://github.com/picturesofmatthew/the-logbook (public) · **Live:** https://the-logbook-six.vercel.app (serving the signxsealed build)
- **⚠ Manual steps outstanding:** (1) real passcode (still `mochi`) + real `FDC_API_KEY` (still `DEMO_KEY`; free key https://api.data.gov/signup) — set in `.env.local` **and** Vercel env (`npm exec --yes vercel@latest -- env add … --value "x" --yes`, then verify). (2) `signxsealed.vercel.app` alias still SSO-gated → dashboard → Settings → Domains. (3) Vercel project **rename** (dashboard: https://vercel.com/matthewmakesthings-projects/signxsealed → Settings → General → Project Name). (4) branch `inklight-v1-polish` not yet merged to the default branch — deploys are CLI-driven so prod is current regardless, but merge when ready.
- **Deferred to the subscription (Phase C) track:** households schema + `household_id` on every table, per-user auth + invite pairing, per-household fox/museum/discovery board, session expiry/rotation, manifest depersonalization ("for Matthew & Kennedy"), billing (per-couple), per-household ledger caching. See the audit for the full blocker list.
- **Positioning thesis (v1 marketing spine):** "the tracker you can't use alone" — the seal cannot close solo, chords only strike together, abundance/rest/hard-days are *named achievements* (anti-red-number), the Spellbook is a rereadable shared memory. Moat = two-player-mandatory architecture incumbents can't retrofit + trust (book stays readable forever, even on cancel).

## Project notes

- Two users only: `matthew` and `kennedy` (profile ids are hardcoded in `lib/auth.ts`)
- The pet is a shared arctic fox that grows antlers by **lifetime both-logged days** (thresholds in `lib/engine/pet.ts`); it is never punished — tone rule: no red numbers, no broken streaks, over-target renders in soft terracotta
- The museum collection IS the food database; USDA is only touched when donating a new specimen
- Engine logic (`lib/engine/*`) is pure and unit-tested: `npm test`
- Sprites are string maps in `components/sprites.ts`; preview to PNG with `node scripts/preview-sprite.mjs <outDir>`; icons regenerate with `npm run icons`
- "Today" follows a timezone cookie (`components/tz-sync.tsx`) — survives the move to Chiang Mai
- DB is Neon via the Vercel marketplace integration; schema changes are versioned: edit `db/schema.ts`, then `npx drizzle-kit generate` + `npm run migrate` (never `push` — history lives in `db/migrations/`)

## Session Logs

`~/.claude/sessions/the-logbook/`
