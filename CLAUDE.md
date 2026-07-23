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
spellbook, fast food/workout logging, ceremonies, sound. The **tenancy spine is live** (multi-`bond`
data model — see Quick Resume) but the site still logs in via the B1 passcode; **real accounts +
pairing + at-rest encryption + breakup flows are built and awaiting a coordinated cutover deploy**.
Pure engine in `lib/engine/*` (unit-tested, `npm test`, 61/61).

**Strategic stance (DECIDED 2026-07-21):** **build on the current free stack.** The native
Expo + Convex + Rive rewrite (`LAUNCH-PATH.md`) is **PARKED until multiple users are willing to pay**
— only then is migration reconsidered. **$0 until users** is the law: no recurring spend before
paying couples. Beachhead ICP = **long-distance couples** (the cross-distance "love-tap" is the hero
there — and Matthew's own Oct-2026 Chiang Mai situation).

**Orientation:** read **`PROJECT-BRAIN.md`** first (state, decision log, full doc map). Design canon:
`THE-SIGIL-TURN.md` (thesis), `DIRECTION.md` + `art/ART-BIBLE.md` (art), `RISK-REGISTER.md` (the
contingency findings to build around).

## Quick Resume

- **Current focus (2026-07-22, branch `sigil-turn-foundation`):** the **multi-user foundation**. A 5-lens adversarial audit (`AUDIT.md`) found single-tenancy was the root ceiling. From it: **Bucket A** (reliability + perf) and the **Bucket B tenancy spine** are **shipped live**; **B2–B4** (accounts, pairing, encryption, breakup) are **built + committed, holding for one coordinated cutover deploy**. 61/61 tests throughout.
- **⭐ NEXT — the coordinated cutover deploy** (turns the live site from passcode-B1 to full accounts). It's tightly ordered because it changes login:
  1. Apply migrations **0006→0009** (0004+backfill+0005 already applied live; 0006/0007/0009 additive; **0008 needs the encryption backfill between**).
  2. Run `scripts/encrypt-health-data.ts` (via tsx) — needs `ENCRYPTION_KEY` set.
  3. **Seed matthew + kennedy real email/password** (their B1 profiles have `email`/`password_hash` null — they can't log in under B2 until seeded). Ask Matthew for two emails + starting passwords.
  4. Set **`ENCRYPTION_KEY`** (32-byte hex) + **`COUPLE_TZ`** in Vercel prod.
  5. Deploy (push `main`) — do 0005-style: migrations/backfill/seed close to the deploy so old-code + new-schema don't overlap for long.
  Then: `/privacy` needs **real legal review** (it's a template; contact/effective-date are placeholders).
- **After the cutover — the next phases (in order):** **logging-tech overhaul** (seamless, low-friction logging — Matthew's stated next focus), then the **"growing world" redesign** (retire the fox → the book glows + the glade/garden grows lusher + the boat responds to the goal + a money/coffers mechanic — a deferred creative phase), then re-pair (a `bond_members` membership model).
- **Architecture now (post-B1):** tenant = **`bond`** (`bonds` table + `bond_id` everywhere; kinds couple/gym_partners/friends). Identity = **`Slot` (moss/ember)**, membership runtime data (`lib/bond.ts` `getBondMembers`/`requireBond`); the old `Profile`/`PROFILES` union is gone. matthew=moss, kennedy=ember in **bond `e8ee96b7-…`** (the one live bond). `foods` is a **shared global museum**. Full design: `~/.claude/plans/distributed-seeking-snail.md`.
- **⚠ Manual/deploy steps:** `COUPLE_TZ` + `ENCRYPTION_KEY` in Vercel prod · seed matthew/kennedy credentials · real `/privacy` review + contact email · real passcode is moot (B2 replaces it).
- **Deferred (with reasons):** re-pair into a book with a former keeper (needs `bond_members`) · solo-state UI polish · E2E for private notes (at-rest done) · per-bond `tz` wiring (column exists, still env-based) · the design-debt list (CVD seal, plate rollout to `/today`, type-floor sweep, glade-scroll trim, keeper-color unification) · billing/coffers.
- **Repo:** https://github.com/picturesofmatthew/the-logbook (public) · **Live:** https://www.signedxsealed.com (running **B1** until the cutover)
- **Positioning thesis (v1 marketing spine):** "the tracker you can't use alone" — the seal cannot close solo, chords only strike together, the Spellbook is a rereadable shared memory. Moat = two-player-mandatory architecture incumbents can't retrofit + trust (book stays readable forever, even on cancel).

## Project notes

- **Multi-tenant now (B1, live):** the tenant is a **`bond`** (`bond_id` on every per-bond table; kinds couple/gym_partners/friends). Identity is a **`Slot`** (moss/ember); membership is runtime data via `lib/bond.ts` (`getBondMembers`/`requireBond`) — the old hardcoded `matthew`/`kennedy` `Profile` union is gone. The two original keepers are **bond `e8ee96b7-…`** (matthew=moss, kennedy=ember). New users sign up + pair (B2/B3, built, undeployed).
- The familiar is a shared arctic fox — the bond's *resident* creature (not a "pet"; the wandering ones are `beings`) — grows antlers by **lifetime both-logged days** (`lib/engine/familiar.ts`); never punished (no red numbers/broken streaks; over-target = soft terracotta). **De-singletoned in B1** (one row per bond, keyed by `bond_id`). **Being retired** — the "growing world" redesign replaces the raised-fox as the thing that grows with the bond.
- The museum collection IS the food database; USDA is only touched when donating a new specimen
- Engine logic (`lib/engine/*`) is pure and unit-tested: `npm test`
- The familiar is an **Inklight SVG** (`components/familiar/familiar-glyph.tsx` — pure `foxSvg(stage)` composer + thin renderer, 5 stages drawn by antler growth); the old pixel layer (`sprites.ts`/`pixel-sprite.tsx`/`preview-sprite.mjs`) is **deleted**. The seal is the same pattern (`components/sigil/glyphs.ts` `composeSeal` → `sigil-glyph.tsx`) — both are swappable for hand-drawn masters. App icons regenerate with `npm run icons` (`gen-icons.mjs` has a self-contained pixel map, independent of the deleted sprites)
- The shared "today" — the `day` key for every log + the seal — buckets on one **couple timezone** (`COUPLE_TZ` env → `coupleTz()` in `lib/dates.ts`), so two devices in two zones can't split the seal; the device-tz cookie (`components/tz-sync.tsx`) is now **display-only**. ⚠ set `COUPLE_TZ` in Vercel prod (falls back to Denver). Still same-couple-day until the async close window lands.
- DB is Neon via the Vercel marketplace integration; schema changes are versioned: edit `db/schema.ts`, then `npx drizzle-kit generate` + `npm run migrate` (never `push` — history lives in `db/migrations/`). **drizzle-kit gotchas (learned):** it botches PK-swaps — hand-fix the ADD/DROP ordering (see 0005's `pet`); and it omits `USING` on incompatible type changes (0008 real→text, added by hand). For a **staged apply** (backfill between migrations), temporarily delete the not-yet-ready migration's `_journal.json` entry so `migrate` stops early, then `git checkout` it back.
- **Health data is encrypted at rest (B4a):** `day_meta.note/mood` + `weigh_ins.weight_lb` via AES-256-GCM (`lib/crypto.ts`, key = `ENCRYPTION_KEY`). Encrypt on write, decrypt on read at every boundary; `weight_lb` is now ciphertext-text. `/privacy` + a signup consent gate exist (B4b).

## Session Logs

`~/.claude/sessions/the-logbook/`
