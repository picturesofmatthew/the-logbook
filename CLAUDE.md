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

- **Current focus (2026-07-21):** **Phase 1 — Art Direction & the Sigil, mid-flight.** This session **redesigned the seal to the north-star, staged it as the home hero, de-pixeled the fox, and renamed the type utility** — all live-verified against a running dev server (`localhost:3000`, passcode `mochi`) via a static `composeSeal`/`foxSvg` preview harness + real-app screenshots. Specifically: (1) **seal rebuilt** (`components/sigil/glyphs.ts`) to match `art/reference/hero-sigil.png` — a **dark teal cartouche travels with the seal** (Matthew's decision over paper-native), fat moss/ember bands, star-boss gold frame with breathing room, bright compass-core, **chords now render as gold cabochon-studs on the cartouche ring** (the old mechanical "weave" is gone), ember-over-moss **braid** at the base seam, saturated-glowing legendaries, + a simplified 38px thumbnail (`composeSeal(spec,{detail:"thumb"})`); (2) **home reskinned** (`app/page.tsx` + `components/sigil/day-seal.tsx`) — the seal is the **big centered hero**, caption *beneath* not beside; (3) **fox de-pixeled** — new Inklight SVG familiar (`components/familiar/familiar-glyph.tsx`, 5 stages by antlers), wired into home glade-strip + `/enter`, and the **entire pixel layer deleted** (`sprites.ts`, `pixel-sprite.tsx`, dead `glade-header.tsx`, orphaned `preview-sprite.mjs`); (4) **type utility renamed** `font-pixel`→`font-display` across ~35 files (Fraunces's next/font var is now `--font-fraunces`; `@theme --font-display: var(--font-fraunces)`). 50/50 tests, clean typecheck. **⚠ Uncommitted at session end** (branch `sigil-turn-foundation`; prior sigil work is `d95aa69`).
  - *(Phase 0 shipped earlier: consolidation, coffers research (`COFFERS.md`), the `pet`→`familiar` rename, doc reconciliation, and a prod deploy — commits `bdac6d4` + `dc183ea`.)*
  - **Also shipped this session (commits `2346236` → `88e88b0`):** (a) **the "alive when logging" ceremony** — `composeSeal({reveal:true})` + a `.rv-*` CSS timeline in `globals.css`: a radial-wipe inks the ring on, then field → core → chord-runes (in sequence) → union-gem bloom → spark-motes; reduced-motion shows the finished seal instantly; wired into `seal-ceremony.tsx`, verified frame-by-frame via the Web Animations API. (b) **per-chord bespoke runes** — new `CHORD_GLYPHS` registry (12 marks); the seal now has two rune-rings: INNER = struck chords (each its own mark), OUTER = food halls + training lifts (merged); the generic studs are gone. (c) **per-legendary faces** — `LEGENDARY_FACES` registry: each of the 10 legendaries its own emblem + colour cast (Green Cathedral verdant, not violet); a module-level `LEG` threads it through. (d) **latent signals** — `SigilSpec.moon/water/lowMood` are real now (full-moon crown on any sealed full-moon night, water-ring, gentle hard-day dusk tint); `natureFor` reads them instead of guessing. (e) **base-seam fix** — the one-sided ember-over-moss "braid" read as the auburn overflowing the moss; removed → clean symmetric seam + gold clasp-bead.
  - **Next up:** (1) **ceremony polish** — a symmetric "both halves close from the top → base" wipe (currently a clockwise sweep), and sequence the plank→boat beat *after* the seal completes; (2) **deferred latent signals** — time-of-day / day-of-week / long-distance (need tz threading / per-keeper timezone → rides Phase 3 multi-user); (3) **small-caps micro-label tuning** (deferred taste call); (4) README rewrite. Then **Phase 2 = coffers** (`COFFERS.md`), **Phase 3 = multi-user v1**. Sequence in `ROADMAP.md`. *(`SIGIL-HANDOFF.md` predates this session's redesign — read it for grammar, not current geometry.)*
- **Repo:** https://github.com/picturesofmatthew/the-logbook (public) · **Live:** https://the-logbook-six.vercel.app (serving the signxsealed build)
- **⚠ Manual steps outstanding:** (1) real passcode (still `mochi`) + **`FDC_API_KEY`** — the real key already works locally (`.env.local`, verified in Phase 4); the open step is confirming it in **Vercel prod** (`npm exec --yes vercel@latest -- env add … --value "x" --yes`, then verify). (2) `signxsealed.vercel.app` alias still SSO-gated → dashboard → Settings → Domains. (3) Vercel project **rename** (dashboard: https://vercel.com/matthewmakesthings-projects/signxsealed → Settings → General → Project Name). (4) branch `inklight-v1-polish` not yet merged to the default branch — deploys are CLI-driven so prod is current regardless, but merge when ready.
- **Deferred to the subscription (Phase C) track:** households schema + `household_id` on every table, per-user auth + invite pairing, per-household fox/museum/discovery board, session expiry/rotation, manifest depersonalization ("for Matthew & Kennedy"), billing (per-couple), per-household ledger caching. See the audit for the full blocker list.
- **Positioning thesis (v1 marketing spine):** "the tracker you can't use alone" — the seal cannot close solo, chords only strike together, abundance/rest/hard-days are *named achievements* (anti-red-number), the Spellbook is a rereadable shared memory. Moat = two-player-mandatory architecture incumbents can't retrofit + trust (book stays readable forever, even on cancel).

## Project notes

- Two users only: `matthew` and `kennedy` (profile ids are hardcoded in `lib/auth.ts`)
- The familiar is a shared arctic fox — the couple's *resident* creature (not a "pet"; the wandering ones are `beings`) — that grows antlers by **lifetime both-logged days** (thresholds in `lib/engine/familiar.ts`); it is never punished — tone rule: no red numbers, no broken streaks, over-target renders in soft terracotta
- The museum collection IS the food database; USDA is only touched when donating a new specimen
- Engine logic (`lib/engine/*`) is pure and unit-tested: `npm test`
- The familiar is an **Inklight SVG** (`components/familiar/familiar-glyph.tsx` — pure `foxSvg(stage)` composer + thin renderer, 5 stages drawn by antler growth); the old pixel layer (`sprites.ts`/`pixel-sprite.tsx`/`preview-sprite.mjs`) is **deleted**. The seal is the same pattern (`components/sigil/glyphs.ts` `composeSeal` → `sigil-glyph.tsx`) — both are swappable for hand-drawn masters. App icons regenerate with `npm run icons` (`gen-icons.mjs` has a self-contained pixel map, independent of the deleted sprites)
- "Today" follows a timezone cookie (`components/tz-sync.tsx`) — survives the move to Chiang Mai
- DB is Neon via the Vercel marketplace integration; schema changes are versioned: edit `db/schema.ts`, then `npx drizzle-kit generate` + `npm run migrate` (never `push` — history lives in `db/migrations/`)

## Session Logs

`~/.claude/sessions/the-logbook/`
