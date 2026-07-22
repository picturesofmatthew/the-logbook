# Signed × Sealed — Quality Audit (2026-07-21)

*A three-lens adversarial audit of the live app — technical, design, and real-human-UX — run as
three independent subagents, each briefed to be critical (not polite) and grounded in the actual
code + the project canon. Synthesized here. Companion to `RISK-REGISTER.md` (the 2026-07-20
contingency round): this is the **code-verified refresh** — what a read of the current build
confirms, what's new, and the sequenced plan out. Read `PROJECT-BRAIN.md` first for state.*

## The one-line verdict

**A genuinely crafted centerpiece mounted in a half-finished, partly-broken frame.** The engine is
excellent — pure, deterministic, well-tested, atomic where it counts. But the emotional payoff is
delivered *unreliably*, the two-player moat is currently a naked *liability*, and the surface you
touch every single day (logging) is the least-finished part of the app. None of it is fatal; all of
it is fixable **without new infra**. The through-line: the craft went to the monthly peak (the seal,
the ceremony, the glade) and skipped the 30-second daily interaction where retention actually lives.

## Where all three lenses converged (highest confidence)

Independent briefs; the same faults surfaced through all of them.

| # | Finding | Lenses | Evidence / why it's real |
|---|---|---|---|
| **1** | **No canonical couple-day.** `todayIso()` buckets on each *device's* tz cookie, so two partners in two zones file their halves under different `day` keys → **the seal silently never closes.** | Technical (Critical), UX (High) | `lib/dates.ts:8`, `components/tz-sync.tsx`; `composeSigil` keys one `day` (`lib/engine/sigil.ts:418`). Breaks the seal in the *exact* long-distance case, and **auto-activates on the Oct-2026 move.** |
| **2** | **The partner-lapse cliff.** One partner not logging → the other gets *nothing*: no seal, no plank, no chord, no ceremony. And **no surface exists to pull the lapsed partner back** (grep-confirmed: zero push/notification code). | UX (Critical) | `sigil.ts:159` (chords `[]` unless both), `boat.ts` (planks only on joint days), `seal-ceremony.tsx`. The moat *is* the single point of failure; only the fragile half is built. |
| **3** | **The magic often isn't delivered.** Claim-once ceremonies fire from **DB writes during GET render** — open `/book` before home and today's legendary ceremony is silently *consumed*, never shown. Plus it's device-local + same-day-only, so whoever logs *first* usually never sees the peak. | Technical (High), UX (Critical) | `app/page.tsx:91`, `book/page.tsx:42`, `book/[day]/page.tsx:98`, `seal-ceremony.tsx:18`. Data stays consistent (atomic); the *experience* vanishes. |
| **4** | **The plate rollout is half-done → two card languages collide** on the same screens. The hero seal is booklike; `/today`, the capture sheet, `/settings`, `/trends` are plain cream forms. | Design (#1 fix) | `.plate` vs. `wobbly hatch border-ink/20 bg-cream` coexist inside single pages (`library/page.tsx:125` above plated cards). This is the *cohesion pass*. |
| **5** | **The colorblind seal.** The two keeper halves differ **only by hue** (moss `#7c8a4d` vs terra `#c4704b`), near-equal luminance — textbook red-green failure, and the seal's *entire meaning* is telling the halves apart. | Design (High), UX, RISK Tier 5 | `glyphs.ts:261`. No shape/texture identity, no lightness split, no CVD toggle. Triple-flagged. |
| **6** | **Type floor below phone legibility** — 69 uses of 8–10px, and the *nav labels* are 8.5px **Fraunces** (a hairline serif that dissolves below ~11px). | Design (High), UX (tone) | `ribbon.tsx:61`, `library/page.tsx:127`, `top-bar.tsx:50`. Your navigation is muddy on a real device. |
| **7** | **The 38px thumbnail is dead code.** `composeSeal(…,{detail:"thumb"})` exists but `SigilGlyph` never passes it → calendar/Library grids render the *full* seal crushed to mud; every day shows the same dark medallion. | Design (Med, "highest ROI") | `glyphs.ts:411` (thumb branch) vs `sigil-glyph.tsx:33` (never passes `detail`). One prop-thread. |

## The adversarial read (strategic, beyond the line-items)

1. **The "deferred until users" items aren't deferrable — you're about to become your own long-distance
   test.** Canonical-day, async close, solo value, the love-tap are filed under "later." But the
   Oct-2026 Chiang Mai dogfood **is** the long-distance, two-timezone scenario, and it hits findings 1,
   2, and 3 on day one, simultaneously. "Validate on the PWA" and "defer the long-distance seam" are in
   direct conflict. The dogfood is meaningless until that seam works.
2. **The moat is a liability until you build its other half.** Two-player-mandatory is the defensibility
   story — but today it has no recovery mechanism. RISK Tier 1 already prescribed the fix (solo
   half-seal + personal plank; the joint close *fuses*). It's just unbuilt. The thing that makes you
   defensible is the thing that makes you churn.
3. **You built the cathedral and skipped the front door.** The seal/ceremony/glade are lavished with
   craft. The surface a user opens *every day* to log dinner is a plain form, tiny type, and a keyword
   USDA matcher ("a bowl of pho" → generic "Dishes"). That's inverted from where retention is won.
4. **Self-inflicted:** removing the `/today` tab (this session's nav rework) buried water + mood —
   which are **chord scoring inputs** (Spring needs both ≥8 cups; mood drives legendaries). Users now
   can't reach half the chords because they can't find the water tracker. A regression to undo.

## New findings not already in the risk register

Beyond the convergent seven, the code read surfaced fresh technical items:

- **[High] `food-estimate` route:** up to ~12 *sequential* USDA fetches (6 items × Foundation+Branded
  fallback), each an 8s timeout, no cache, no rate-limit, no in-handler session re-check
  (`app/api/food-estimate/route.ts:111`). Risks the Vercel duration limit + DEMO_KEY quota.
- **[Med→High at scale] Full-history recompute, uncached, on every home + library load.**
  `getGladeState` composes a sigil for *every day since day one* + a full `entries` scan; no
  `unstable_cache`/rollup anywhere (`lib/ledger.ts:124,223`; `lib/data.ts:105`). Fine at 2 users; a
  latency cliff as history/couples grow — and `/library` (just shipped) is one of the two hot pages.
- **[Med] Duplicate-specimen race:** app-level `SELECT lower(name)` then `INSERT`, no unique index on
  `foods.name` (`app/log/actions.ts:109`, `db/schema.ts:57`). A double-tap or both-log-same-food dupes
  the food DB.
- **[Med] The seal requires FOOD from both** — workouts alone never close it or strike the Anvil chord
  (`lib/engine/keeper-day.ts:26`), yet the glade fox lights for workouts. Likely user-surprise; decide
  on purpose.
- **[Med] Incomplete revalidation:** log actions only `revalidatePath("/")`; `/today`, `/library`,
  `/book` can serve stale client-cached copies after a log.
- **[Med] Sessions** are static, non-expiring, unrevocable, and identity is a shared-passcode + "pick
  who you are" dropdown — fine for 2 trusted users, a hard blocker before any external couple.
- **[Test gap] The entire impure data + ledger layer is untested** — exactly where the tz bucketing,
  both-logged rule, and discovery recording live. The green engine gives false confidence.
- **[Design] Three heading systems** (`.gilt-heading`, `RuledHeading`, bare) + keeper color *flips*
  between surfaces (green on the glade, red-brown in the charts) — pick one of each.

## The plan — three tracks

**Track A — Make the loop real** *(the retention spine; forced by the dogfood; no new infra)*

| Do | Effort | Kills |
|---|---|---|
| Canonical couple-day + async ~36–48h close window (engine invariant + golden cross-tz test) | M | #1 |
| Solo half-seal — a kept half is a warm artifact, not a scold: it kindles the glade fire + lights your lantern, and the caption reframes to "your half is kept" | S | #2 |
| Move claim-once ceremonies out of GET-render into the log action; "seen" = server-truth; fire on async close | M | #3 |
| One web-push primitive: "your half is waiting" — invite + love-tap + re-engagement in one mechanic | S–M | #2, #3, beachhead |

**Track B — Finish the book** *(the cohesion pass; cheap; improves the app in-hand now)*

| Do | Effort | Kills |
|---|---|---|
| Thread `detail:"thumb"` through `SigilGlyph` for grids | S | #7 |
| Make the seal visibly tappable / add a diegetic "today's page" entry (undo the buried-`/today` regression) | S | #4-self |
| Type-floor sweep (≥12 body, ≥10 struck labels; Fraunces out of sub-11px) | S | #6 |
| Finish plate rollout to `/today` + capture sheet + trends + settings; delete the second card recipe | M | #4 |
| Keeper identity system: one color pair + **texture**, reused in seal *and* charts — also closes the CVD gap | M | #5 |

**Track C — Harden before external couples** *(later, cheap-ish)*: test the data/ledger layer;
`food-estimate` hardening + confirm `FDC_API_KEY` in prod; `UNIQUE(lower(name))` on foods; decide the
food-vs-workout seal rule; revalidate affected paths on log. **The growth gate** (real accounts +
pairing so a *third* couple can exist) stays deferred — correctly — until the loop survives a lapse.

## Decisions since the audit

- **Solo value = the glade fire, NOT a boat plank (2026-07-21).** A plank stays
  strictly two-player — the boat is the thing you can only build together. A solo
  log instead *kindles the firepit + lights that keeper's lantern* (a warm,
  ambient, personal reward) and the seal's caption reframes from "waiting on X" to
  "your half is kept — [partner] closes the ring." The joint close still fires the
  ceremony + plank. *(Shipped — see the glade `firepit`/`DaySeal` change.)*

## Recommendation / sequence

Bank the **Track B cheap wins now** (thumb, type floor, tappable seal, plate rollout) — they make the
app immediately better and take ~an afternoon. Then commit to **Track A as the real next build, before
Asia** — it decides whether the thesis is even testable. Single first move if forced: **canonical
couple-day + the solo half-seal**, together (shared tooling; turns the dogfood from a landmine into a
real experiment).
