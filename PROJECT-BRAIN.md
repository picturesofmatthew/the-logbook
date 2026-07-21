# Signed × Sealed — Project Brain

*The orientation index + current state + decision log. Read this FIRST on any cold start, then follow
the doc map. Last updated 2026-07-21.*

## Status snapshot

- **Act One is LIVE** — a deployed Next.js 16 + Neon PWA at signedxsealed.com (serving from the
  `inklight-v1-polish` branch, prod on Vercel). The core loop works today on real phones: the
  two-keeper seal composing from both users' data, the full sigil engine (chords/tiers/legendaries),
  the glade + beings, the spellbook, fast food/workout logging, ceremonies, sound. 44/44 engine tests
  pass. Two hardcoded users (matthew/kennedy), passcode-gated.
- **This session (overnight 2026-07-20 → 21) made three big moves** — see the decision log.
- **Nothing here is thrown away.** The stack decision + foundation + register are the playbook for the
  *native* build; the current call is only about *sequencing*.

## The thesis (one line)

Both keepers log → the day composes its **sigil** → the completion **ceremony** fires → a **spell** is
cast → a **plank** lays on the **bridge** toward the couple's **Dream** (far shore, e.g. Kauai).
Retention = the spell you can only cast together + the accumulating shared book. (`THE-SIGIL-TURN.md`)

## The one open decision

**Validate-first vs build-native-now.** A 4-lens adversarial contingency round (product, technical,
business, scope) converged: the two-player-mandatory same-day close is the magic AND the fragility,
and we were about to *rewrite* an un-validated loop natively instead of testing it cheaply on the
working PWA. **Recommended (strongly — all lenses): brakes on the rewrite; fix-and-validate on the PWA
first.** Awaiting Matthew's explicit confirm before re-pointing the plan of record.

## The immediate next step (the recommended path, $0)

On the LIVE PWA (no new stack):
1. Fix the **core-loop cluster** (RISK-REGISTER Tier 1): an async ~36–48h close window + standalone
   value for one person's half + a graceful absent-partner state.
2. Cheap wins that apply regardless: the **colorblind seal** (shape/texture per keeper + an Okabe–Ito
   palette) and the **canonical-couple-day** rule in the engine.
3. Build the **bridge-to-Kauai Phase 0** (`ACT-TWO-THE-FAR-SHORE.md` §Phase 0 — "a render + a row").
4. Run a **30-day both-of-you retention test.** Gate everything downstream on it.

## The document map (read order)

| Doc | What it is |
|---|---|
| **PROJECT-BRAIN.md** (this) | Orientation, state, decision log, doc map. Read first. |
| **THE-SIGIL-TURN.md** | The current thesis: sigil-as-spell, the emblem ladder, the four books, creatures demoted to a summoned bonus. |
| **RISK-REGISTER.md** | The 4-agent contingency findings, deduped + ranked by severity + phase. The "what to watch." |
| **ACT-TWO-THE-FAR-SHORE.md** | The far shore / bridge / Dream + **§Phase 0, the lean validate-first plan** (re-promoted). |
| **DIRECTION.md** + **art/ART-BIBLE.md** + **art/tokens.json** | Inklight art direction, palette, emblem-ladder materials, DTCG tokens. |
| **art/RIVE-SEAL-BLUEPRINT.md** | Rive authoring spec — the view model mirrors `SigilSpec` 1:1. |
| **art/asset-sheets.md** + **art/prompts.md** | AI-gen bootstrap boards + the Inklight prompt library (free via Google AI Studio). |
| **LAUNCH-PATH.md** | The **deferred** native build/ship plan (Expo + Convex + Rive, $0-until-users, reader-model billing). The "when we go native" playbook. |
| **convex/schema.ts** | The backend spine — a **design artifact** (needs a real migration pass; RISK-REGISTER Tier 6). |
| **lib/engine/sigil.ts** | The registry-driven sigil engine — adding a chord/legendary is one entry. |
| **NEXT-SESSION.md** | Art tooling = resolved; **macro/calorie estimation logic is still open.** |
| **CLAUDE.md** | Standing briefing + Quick Resume (points here). |

## Decision log — this session (2026-07-20 → 21)

1. **The Sigil Turn** — the app re-centered on the sigil (not creature-raising); creatures → a summoned
   bonus; IA → a shelf of four books; the emblem ladder (material escalates with tier).
2. **Native stack decided, then deferred** — Expo + Convex + Rive + Clerk + reader-model billing, via a
   4-agent adversarial round; $0-until-users. **Deferred** by the contingency round (#4).
3. **Sigil engine → registry** (`lib/engine/sigil.ts`), 44/44 tests still green. Convex `seals` store
   chord/legendary as strings → adding a component is one engine edit, no schema change.
4. **Contingency round → validate-first reframe** (`RISK-REGISTER.md`) — the recommended next path.
5. **Foundation laid** — ART-BIBLE, tokens, RIVE-SEAL-BLUEPRINT, convex/schema, asset-sheets.
6. Committed on branch **`sigil-turn-foundation`** (commit `b8151a4`); + `RISK-REGISTER.md` + this brain.

## Name

**Keep `signedxsealed`** (domain + IG @signed_x_sealed secured 2026-07-21). The "unsearchable" critique
applies only to the literal **× (multiply symbol)** as a typed/store name — not the brand. Resolution:
use a **typeable store/search name** ("Signed x Sealed" or "Signed & Sealed"); keep the **× as the
logo/wordmark** (two crossed into one — on-thesis). Run a **USPTO + App Store/Play collision check**
(watch "Signed Sealed Delivered" — Stevie Wonder + Hallmark — for SEO/TM) before locking. Verdict:
strong, on-brand name; the purchases were not a mistake.

**App Store cross-reference (2026-07-21, via iTunes Search API):** **no name collision** — nothing in
the App Store is called "Signed x Sealed" / "Signed Sealed" in the couples space *or anywhere*; the
couples category (Paired 8M, Between, PairStreak, Twig…) has no "Sealed"-named app. **BUT the search
term "signed sealed" is owned by the e-signature category** (DocuSign, Signeasy, SignNow, Adobe
Acrobat Sign) — a *findability*, not a *trademark*, problem. **Store strategy: keep the brand + add a
category descriptor** ("Signed x Sealed: A Ritual for Two"); build the subtitle/keyword field around
couples/together/long-distance terms, not "signed sealed"; let the app rank on its own unique token.
**Still to verify (session search budget spent): live Google Play + USPTO checks.** **GTM spine:** the
invite is the growth engine (two-player = built-in referral; the half-lit seal one partner *sends* is
the acquisition unit); beachhead = long-distance couples; founder-led content via @picturesofmatthew
(the ornate seals are the ad); a $0 waitlist landing now.

## Guardrails (carried)

- **$0 until users** (Matthew, hard constraint). The whole path is free-tier; reader/MoR billing and
  paid tools wait for real couples.
- Never `curl` on Windows; `node -c` after editing JS; deploys are CLI-driven.
- Tone law: no red numbers, no broken streaks; the world states the score wordlessly.
- Sensitive, health-adjacent data → real legal duties before ANY external user (RISK-REGISTER Tier 2).
