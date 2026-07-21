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

- **Current focus (2026-07-21):** ⭐ **Read `PROJECT-BRAIN.md` first** — full orientation + decision log + doc map. In brief: **Act One is LIVE** (the deployed `inklight-v1-polish` PWA at signedxsealed.com — the two-keeper seal + full engine + glade + spellbook all working; 44/44 engine tests pass). This session made three moves: (1) **The Sigil Turn** — re-centered on the sigil-as-spell laying planks toward the far shore (`THE-SIGIL-TURN.md`); (2) a **native build stack decided** — Expo + Convex + Rive — via a 4-agent adversarial round (`LAUNCH-PATH.md`); then (3) a **contingency round (`RISK-REGISTER.md`) reframed the next move to VALIDATE-FIRST on the existing PWA before any rewrite.** The native rewrite + stack are **deferred** (the playbook for later). **DECISION MADE (2026-07-21): continue on the current free Next.js/Neon/Vercel PWA; the native rewrite is PARKED until multiple users will pay. $0 until users.** **Next dev (all on the current PWA, SVG/CSS — not Rive): (1) the core sigil system** — the SVG `SigilGlyph` + composed seal + chord-runes + emblem-ladder tiers + the completion ceremony; **(2) the logging overhaul** — time-to-first-value + macro/calorie estimation (`NEXT-SESSION.md` §2); **(3) compendium navigation** — the four-books IA, the Compendium (beings + pantry/museum + artifacts) as one navigable book in `/book`. Fold in the cheap `RISK-REGISTER.md` fixes as we touch them (colorblind seal, canonical-couple-day, standalone half-value + async close window); then the bridge-to-Kauai Phase 0 + a 30-day retention test. Foundation work committed on branch `sigil-turn-foundation` (`b8151a4`→`0ea1048`).
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
