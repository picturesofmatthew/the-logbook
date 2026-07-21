@AGENTS.md

## What Signed × Sealed is

**Signed × Sealed** (shortcut `sxs`; signedxsealed.com, IG @signed_x_sealed) is a
**two-player-mandatory** couples / gym-partner wellness logbook, reframed as a shared arcane grimoire.
Two people log food + workouts; each day composes a deterministic **sigil (the seal)** from *both*
their data. **The seal cannot close alone** — that single rule is the product.

**The loop / thesis:** both log → the day's **sigil** composes → the completion **ceremony** fires →
a **spell** is cast → a **plank** sets into the **boat** that carries you toward the couple's shared **Dream** (the far
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

- **Current focus (2026-07-21):** **Phase 1 — Art Direction & the Sigil.** ⭐ **Read `SIGIL-HANDOFF.md` first to continue.** Art is locked to **Inklight** (pixel retired). This session: (1) fonts wired — **Fraunces** (display, behind the `font-pixel` utility) + **Hanken Grotesk** (body); (2) the **hero sigil designed** across 4 artifact passes (Matthew's reference in `art/reference/`) — a Witch-Hat-Atelier spell-glyph: braided moss/ember ring, ornate gold frame, **carved-in-stone runes**, a generative spell-circle (signs = food halls, weave = chords), the material ladder (ink→gilt→stained glass), and legendaries as conjunctions; (3) **wired into the live `SigilGlyph`** via a swappable parts registry (`components/sigil/glyphs.ts`, Iron-Man modular) drawing from real `SigilSpec`. Committed + pushed (`d95aa69`); 50/50 tests, clean typecheck. **⚠ Not yet visually verified in the running app** — first task next session.
  - *(Phase 0 shipped earlier: consolidation, coffers research (`COFFERS.md`), the `pet`→`familiar` rename, doc reconciliation, and a prod deploy — commits `bdac6d4` + `dc183ea`.)*
  - **Next up (full catalogue in `SIGIL-HANDOFF.md`):** (1) **run/deploy to *see* the wired sigil** + tune (glyph positions when full, carve depth, the 38px book-calendar thumbnail); (2) the **"alive when logging" ceremony** — the seal drawing itself on as the day closes (Matthew's big want); (3) per-chord specific connections + bespoke legendary faces + wire the **latent signals** (absolute time-of-day, day-of-week, long-distance, mood/moon/water) into `SigilSpec`; (4) **home reskin** + de-pixel the fox (Inklight familiar SVG, then delete `sprites.ts`/`pixel-sprite.tsx`/dead `glade-header.tsx`); (5) type tuning + rename `font-pixel`→`font-display`; (6) README rewrite. Then **Phase 2 = coffers** (`COFFERS.md`), **Phase 3 = multi-user v1**. Sequence in `ROADMAP.md`.
- **Repo:** https://github.com/picturesofmatthew/the-logbook (public) · **Live:** https://the-logbook-six.vercel.app (serving the signxsealed build)
- **⚠ Manual steps outstanding:** (1) real passcode (still `mochi`) + **`FDC_API_KEY`** — the real key already works locally (`.env.local`, verified in Phase 4); the open step is confirming it in **Vercel prod** (`npm exec --yes vercel@latest -- env add … --value "x" --yes`, then verify). (2) `signxsealed.vercel.app` alias still SSO-gated → dashboard → Settings → Domains. (3) Vercel project **rename** (dashboard: https://vercel.com/matthewmakesthings-projects/signxsealed → Settings → General → Project Name). (4) branch `inklight-v1-polish` not yet merged to the default branch — deploys are CLI-driven so prod is current regardless, but merge when ready.
- **Deferred to the subscription (Phase C) track:** households schema + `household_id` on every table, per-user auth + invite pairing, per-household fox/museum/discovery board, session expiry/rotation, manifest depersonalization ("for Matthew & Kennedy"), billing (per-couple), per-household ledger caching. See the audit for the full blocker list.
- **Positioning thesis (v1 marketing spine):** "the tracker you can't use alone" — the seal cannot close solo, chords only strike together, abundance/rest/hard-days are *named achievements* (anti-red-number), the Spellbook is a rereadable shared memory. Moat = two-player-mandatory architecture incumbents can't retrofit + trust (book stays readable forever, even on cancel).

## Project notes

- Two users only: `matthew` and `kennedy` (profile ids are hardcoded in `lib/auth.ts`)
- The familiar is a shared arctic fox — the couple's *resident* creature (not a "pet"; the wandering ones are `beings`) — that grows antlers by **lifetime both-logged days** (thresholds in `lib/engine/familiar.ts`); it is never punished — tone rule: no red numbers, no broken streaks, over-target renders in soft terracotta
- The museum collection IS the food database; USDA is only touched when donating a new specimen
- Engine logic (`lib/engine/*`) is pure and unit-tested: `npm test`
- Sprites are string maps in `components/sprites.ts`; preview to PNG with `node scripts/preview-sprite.mjs <outDir>`; icons regenerate with `npm run icons`
- "Today" follows a timezone cookie (`components/tz-sync.tsx`) — survives the move to Chiang Mai
- DB is Neon via the Vercel marketplace integration; schema changes are versioned: edit `db/schema.ts`, then `npx drizzle-kit generate` + `npm run migrate` (never `push` — history lives in `db/migrations/`)

## Session Logs

`~/.claude/sessions/the-logbook/`
