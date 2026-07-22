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

- **Current focus (2026-07-21, branch `sigil-turn-foundation`):** post-audit execution. A 3-lens adversarial audit (`AUDIT.md`) drove work across **Track A (make the loop real) · Track B (finish the book) · Track C (harden)**, then a fresh re-audit verified it. **10 commits, live on www.signedxsealed.com** (passcode `mochi`), 54/54 tests throughout.
- **⭐ NEXT — start here: the async ~36–48h close window** (Track A). It's what turns the shipped canonical-day + reliable ceremonies from "works when both log the same couple-day" into "works long-distance." **Needs a model decision first:** when Matthew logs Mon and Kennedy logs Tue (in-window), which couple-day does the seal close on — *the opener's day (retroactive, plank on Mon)* or *the closer's day (Tue)*? **Precondition: set `COUPLE_TZ` in Vercel prod.** Then its inseparable pair, the **web-push love-tap** ("your half is waiting" — same-day nudge + cross-distance hero + growth invite; no push infra exists yet — needs VAPID + a subscription table).
- **Shipped this session:**
  - **Track A:** *canonical couple-day* — `todayIso()` buckets every `day` write on one `COUPLE_TZ` anchor; device tz (`currentTz`) is now display-only (`lib/dates.ts` + `lib/dates-client.ts` + `tests/dates.test.ts`). *Solo half-seal* — a solo log kindles the glade **firepit** + lights the keeper's lantern and the caption reframes to "your half is kept" (never a scold); the boat plank stays two-player (`glade-scene.tsx`, `day-seal.tsx`, `page.tsx`). *Ceremonies off GET-render* — legendary/arrival/shore now fire on **fact + per-device seen-gate** (`lib/ceremony-seen.ts`) so BOTH keepers witness each once (was: only whoever loaded first).
  - **Track B:** thumbnail seals de-mudded (`sigil-glyph` threads `detail:"thumb"` <72px); the Glade seal is a tappable `today's page ❯` door; nav type floor lifted; **the Library / Field Book** shipped (`/library` unifies Pantry+Bestiary+Legendarium+Relics) with the new nav **Glade · Library · Log · Spellbook · Almanac**; glade seal 248→208 (scroll fix, first cut); `/trends` (the Almanac) plated.
  - **Track C:** `food-estimate` hardened (parallel USDA lookups, per-instance cache in `lib/usda`, 401 re-auth); log actions revalidate `/today`.
  - Docs: `AUDIT.md` (new) + ROADMAP re-sequenced + RISK-REGISTER refreshed with "→ Addressed" notes.
- **Design work still queued (per the re-audit):** finish the **plate rollout** to `/today` + `components/journal/*` (+ settings, capture, shore) — the daily surface is still the least booklike; **fix the CVD seal** (moss/terra differ only by hue → texture + lightness split + Okabe–Ito toggle); full **type-floor sweep** (~40 sub-11px Fraunces labels remain); further **glade-scroll trim** (may still scroll on small phones — try `pt-12`→`pt-6` + `w-[150%]`→`~132%`); **unify keeper colors** across seal/lanterns/charts; water/mood in the fast-log path.
- **⚠ Manual steps:** (1) **set `COUPLE_TZ` in Vercel prod** (falls back to Denver — before the Asia dogfood, or evening Chiang Mai logs bucket to Denver's *yesterday*). (2) real passcode (still `mochi`). (3) confirm `FDC_API_KEY` in Vercel prod. (4) `signxsealed.vercel.app` alias SSO-gated; Vercel project rename — both dashboard-only.
- **Deferred (with reasons):** async-close model (above) · `UNIQUE(lower(name))` (prod migration + dupe pre-check) · data/ledger-layer tests · uncached full-history ledger recompute · **Phase C growth gate** (accounts/pairing/households — the ceiling on any 3rd couple; `PROFILES` hardcoded in `lib/auth.ts`).
- **Repo:** https://github.com/picturesofmatthew/the-logbook (public) · **Live:** https://www.signedxsealed.com
- **Positioning thesis (v1 marketing spine):** "the tracker you can't use alone" — the seal cannot close solo, chords only strike together, abundance/rest/hard-days are *named achievements* (anti-red-number), the Spellbook is a rereadable shared memory. Moat = two-player-mandatory architecture incumbents can't retrofit + trust (book stays readable forever, even on cancel).

## Project notes

- Two users only: `matthew` and `kennedy` (profile ids are hardcoded in `lib/auth.ts`)
- The familiar is a shared arctic fox — the couple's *resident* creature (not a "pet"; the wandering ones are `beings`) — that grows antlers by **lifetime both-logged days** (thresholds in `lib/engine/familiar.ts`); it is never punished — tone rule: no red numbers, no broken streaks, over-target renders in soft terracotta
- The museum collection IS the food database; USDA is only touched when donating a new specimen
- Engine logic (`lib/engine/*`) is pure and unit-tested: `npm test`
- The familiar is an **Inklight SVG** (`components/familiar/familiar-glyph.tsx` — pure `foxSvg(stage)` composer + thin renderer, 5 stages drawn by antler growth); the old pixel layer (`sprites.ts`/`pixel-sprite.tsx`/`preview-sprite.mjs`) is **deleted**. The seal is the same pattern (`components/sigil/glyphs.ts` `composeSeal` → `sigil-glyph.tsx`) — both are swappable for hand-drawn masters. App icons regenerate with `npm run icons` (`gen-icons.mjs` has a self-contained pixel map, independent of the deleted sprites)
- The shared "today" — the `day` key for every log + the seal — buckets on one **couple timezone** (`COUPLE_TZ` env → `coupleTz()` in `lib/dates.ts`), so two devices in two zones can't split the seal; the device-tz cookie (`components/tz-sync.tsx`) is now **display-only**. ⚠ set `COUPLE_TZ` in Vercel prod (falls back to Denver). Still same-couple-day until the async close window lands.
- DB is Neon via the Vercel marketplace integration; schema changes are versioned: edit `db/schema.ts`, then `npx drizzle-kit generate` + `npm run migrate` (never `push` — history lives in `db/migrations/`)

## Session Logs

`~/.claude/sessions/the-logbook/`
