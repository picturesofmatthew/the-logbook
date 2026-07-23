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
the two-keeper seal, the full sigil engine (chords/tiers/legendaries), the glade + beings, the
spellbook, fast food/workout logging, **voice "speak your day" logging**, ceremonies, sound. The
**B2 cutover is LIVE** — real accounts + pairing + at-rest encryption + breakup flows deployed on
`main` (the old B1 passcode is retired; DB clean-wiped, awaiting the first signup). Pure engine in
`lib/engine/*` (unit-tested, `npm test`, 75/75).

**Strategic stance (DECIDED 2026-07-21):** **build on the current free stack.** The native
Expo + Convex + Rive rewrite (`LAUNCH-PATH.md`) is **PARKED until multiple users are willing to pay**
— only then is migration reconsidered. **$0 until users** is the law: no recurring spend before
paying couples. Beachhead ICP = **long-distance couples** (the cross-distance "love-tap" is the hero
there — and Matthew's own Oct-2026 Chiang Mai situation).

**Orientation:** read **`PROJECT-BRAIN.md`** first (state, decision log, full doc map). **World canon:
`THE-LIGHTHOUSE.md`** (the app is a lighthouse on an island — the current north star). Design canon:
`THE-SIGIL-TURN.md` (thesis), `DIRECTION.md` + `art/ART-BIBLE.md` (art), `RISK-REGISTER.md` (the
contingency findings to build around).

## Quick Resume

- **Current focus (2026-07-22, on `main`):** the **Lighthouse world** — the app re-centered as one inhabited place (canon: **`THE-LIGHTHOUSE.md`**). **Voice "speak your day" logging shipped + deployed**; the **B2–B4 cutover is LIVE** (accounts + pairing + encryption on `main`, DB clean-wiped, awaiting Matthew's first signup). 75/75 tests.
- **⭐ NEXT — the Lighthouse build.** Prepare a **Fable-subagent implementation plan** for the world's ornate graphics (sigil-level quality → polish passes): the **hearth-hall** + mantle/cast (two chosen sprites, splayed Spellbook, the day's sigil emanating), the **tower** (Library/Compendium up the stairs), the **island** (Garden west, Docks + far shore east), the **swipe/rise** nav, and the **cast cinematics** (onboarding zoom-out → hearth; the cast rises to the lamp → beam sweeps the shore → ceremonious return). Architect the Library/Compendium (**five** books; retire the "museum" → the **Apothecary**; silver-ghosted inspiration engine), the Glade/Garden, and the Docks/ship (**coffers-linked** — real money later). Discipline: game-*feel* not scope; **current web stack** (NOT the parked native rewrite); the spectacle stays *earned*.
- **Dogfood in parallel:** Matthew + Kennedy start using voice logging (~2026-07-23); notes on real gaps feed classifier tuning + the world build.
- **Architecture now (post-B1):** tenant = **`bond`** (`bonds` table + `bond_id` everywhere; kinds couple/gym_partners/friends). Identity = **`Slot` (moss/ember)**, membership runtime data (`lib/bond.ts` `getBondMembers`/`requireBond`); the old `Profile`/`PROFILES` union is gone. matthew=moss, kennedy=ember in **bond `e8ee96b7-…`** (the one live bond). `foods` is a **shared global museum**. Full design: `~/.claude/plans/distributed-seeking-snail.md`.
- **⚠ Manual/deploy steps (cutover DONE):** `COUPLE_TZ` + `ENCRYPTION_KEY` set in Vercel prod ✓ · migrations 0006–0010 applied ✓ · DB clean-wiped, **no credential seed needed** — Matthew + Kennedy sign up fresh via `/enter` + invite. Remaining: real `/privacy` legal review before any external users.
- **Deferred (with reasons):** re-pair into a book with a former keeper (needs `bond_members`) · solo-state UI polish · E2E for private notes (at-rest done) · per-bond `tz` wiring (column exists, still env-based) · the design-debt list (CVD seal, plate rollout to `/today`, type-floor sweep, glade-scroll trim, keeper-color unification) · billing/coffers.
- **Repo:** https://github.com/picturesofmatthew/the-logbook (public) · **Live:** https://www.signedxsealed.com (**B2** live — accounts + pairing + voice; awaiting first signup)
- **Positioning thesis (v1 marketing spine):** "the tracker you can't use alone" — the seal cannot close solo, chords only strike together, the Spellbook is a rereadable shared memory. Moat = two-player-mandatory architecture incumbents can't retrofit + trust (book stays readable forever, even on cancel).

## Project notes

- **Multi-tenant now (B1, live):** the tenant is a **`bond`** (`bond_id` on every per-bond table; kinds couple/gym_partners/friends). Identity is a **`Slot`** (moss/ember); membership is runtime data via `lib/bond.ts` (`getBondMembers`/`requireBond`) — the old hardcoded `matthew`/`kennedy` `Profile` union is gone. New users sign up + pair (B2/B3, **live on `main`**); the DB was clean-wiped for the fresh start, so Matthew + Kennedy create the first accounts via `/enter` + invite (the old hardcoded bond is gone).
- The familiar is a shared arctic fox — the bond's *resident* creature (not a "pet"; the wandering ones are `beings`) — grows antlers by **lifetime both-logged days** (`lib/engine/familiar.ts`); never punished (no red numbers/broken streaks; over-target = soft terracotta). **De-singletoned in B1** (one row per bond, keyed by `bond_id`). **Being retired** — the "growing world" redesign replaces the raised-fox as the thing that grows with the bond.
- The museum collection IS the food database; USDA is only touched when donating a new specimen
- Engine logic (`lib/engine/*`) is pure and unit-tested: `npm test`
- The familiar is an **Inklight SVG** (`components/familiar/familiar-glyph.tsx` — pure `foxSvg(stage)` composer + thin renderer, 5 stages drawn by antler growth); the old pixel layer (`sprites.ts`/`pixel-sprite.tsx`/`preview-sprite.mjs`) is **deleted**. The seal is the same pattern (`components/sigil/glyphs.ts` `composeSeal` → `sigil-glyph.tsx`) — both are swappable for hand-drawn masters. App icons regenerate with `npm run icons` (`gen-icons.mjs` has a self-contained pixel map, independent of the deleted sprites)
- The shared "today" — the `day` key for every log + the seal — buckets on one **couple timezone** (`COUPLE_TZ` env → `coupleTz()` in `lib/dates.ts`), so two devices in two zones can't split the seal; the device-tz cookie (`components/tz-sync.tsx`) is now **display-only**. ⚠ set `COUPLE_TZ` in Vercel prod (falls back to Denver). Still same-couple-day until the async close window lands.
- DB is Neon via the Vercel marketplace integration; schema changes are versioned: edit `db/schema.ts`, then `npx drizzle-kit generate` + `npm run migrate` (never `push` — history lives in `db/migrations/`). **drizzle-kit gotchas (learned):** it botches PK-swaps — hand-fix the ADD/DROP ordering (see 0005's `pet`); and it omits `USING` on incompatible type changes (0008 real→text, added by hand). For a **staged apply** (backfill between migrations), temporarily delete the not-yet-ready migration's `_journal.json` entry so `migrate` stops early, then `git checkout` it back.
- **Health data is encrypted at rest (B4a):** `day_meta.note/mood` + `weigh_ins.weight_lb` via AES-256-GCM (`lib/crypto.ts`, key = `ENCRYPTION_KEY`). Encrypt on write, decrypt on read at every boundary; `weight_lb` is now ciphertext-text. `/privacy` + a signup consent gate exist (B4b).

## Session Logs

`~/.claude/sessions/the-logbook/`
