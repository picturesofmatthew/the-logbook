# Signed × Sealed — Project Brain

*The orientation index + current state + decision log. Read this FIRST on any cold start, then follow
the doc map. Last updated 2026-07-22.*

## Status snapshot

- **⚡ Update 2026-07-22 — voice shipped + a new world canon.** "Speak your day" voice logging is live
  in prod; the B2–B4 cutover is deployed (DB clean-wiped, awaiting first signup). And the world has
  been re-centered: **`THE-LIGHTHOUSE.md`** is the new canon — the app is a **lighthouse on an island**
  (garden west, library up the stair, docks + far shore east; the cast rises to the lamp). See the doc
  map + the 2026-07-22 decision log.
- **Act One is LIVE** — a deployed Next.js 16 + Neon PWA at signedxsealed.com (serving from the
  `inklight-v1-polish` branch, prod on Vercel). The core loop works today on real phones: the
  two-keeper seal composing from both users' data, the full sigil engine (chords/tiers/legendaries),
  the glade + beings, the spellbook, fast food/workout logging, ceremonies, sound. 50/50 engine tests
  pass. Two hardcoded users (matthew/kennedy), passcode-gated.
- **This session (overnight 2026-07-20 → 21) made three big moves** — see the decision log.
- **Nothing here is thrown away.** The stack decision + foundation + register are the playbook for the
  *native* build; the current call is only about *sequencing*.

## The thesis (one line)

Both keepers log → the day composes its **sigil** → the completion **ceremony** fires → a **spell** is
cast → a **plank** sets into the **boat** that carries you toward the couple's **Dream** (far shore, e.g. Kauai).
Retention = the spell you can only cast together + the accumulating shared book. (`THE-SIGIL-TURN.md`)

## The decision (made 2026-07-21)

**Continue on the current free Next.js / Neon / Vercel PWA. The native Expo/Convex/Rive rewrite
(`LAUNCH-PATH.md`) is PARKED — reconsidered only once multiple users are willing to pay.** $0 until
users. This resolves the validate-first-vs-build-native fork: a 4-lens contingency round showed the
native rewrite reaches parity with a *working* app while adding zero retention evidence and colliding
with the STR launch + the Asia move + debt — so we build and validate on what already runs, for free.

## Next up — development on the current PWA

Three threads (all on the free stack, SVG/CSS — not Rive yet):
1. **The core sigil system** — enhance the SVG `SigilGlyph`: the composed seal, chord-runes, the
   emblem-ladder tiers (open→common→fine→resonant→legendary), and the completion ceremony in SVG/CSS.
2. **The logging overhaul** — faster time-to-first-value (log-first, lore-later) + the macro/calorie
   estimation fixes (`NEXT-SESSION.md` §2).
3. **Compendium organization** — the four-books IA; the Compendium (beings + pantry/museum + artifacts)
   as one navigable book in `/book`.

Fold in the cheap `RISK-REGISTER.md` fixes as we touch these: the **colorblind seal** (shape/texture
per keeper + Okabe–Ito palette), the **canonical-couple-day** rule, and the bigger design change —
**standalone value for one keeper's half + an async ~36–48h close window** (so one partner is never
stranded). Then the **boat-to-Kauai Phase 0** + a 30-day both-of-you retention test.

## The document map (read order)

| Doc | What it is |
|---|---|
| **PROJECT-BRAIN.md** (this) | Orientation, state, decision log, doc map. Read first. |
| **BRAND-BIBLE.md** | **The founding brand bedrock (2026-07-22).** Essence, color, type, material, lighting, motif, voice, motion, application, do-not. The absolute place; `ART-BIBLE` (art) and the world docs inherit from it. |
| **THE-LIGHTHOUSE.md** | **The world canon (2026-07-22).** The app is a lighthouse on an island — spatial architecture (garden/hearth/docks + tower), the cast cinematics, the archipelago, the three discipline lines. Read for the world/experience. |
| **ROADMAP.md** | The phased build plan (Foundation → Art/UI → Coffers → Multi-user v1) — "what we're building, in what order." |
| **SIGIL-HANDOFF.md** | The developed seal: its grammar, the swappable parts registry (`components/sigil/glyphs.ts`), and what's next. **Read to continue the sigil/art work.** |
| **THE-SIGIL-TURN.md** | The current thesis: sigil-as-spell, the emblem ladder, the four books, creatures demoted to a summoned bonus. |
| **RISK-REGISTER.md** | The 4-agent contingency findings, deduped + ranked by severity + phase. The "what to watch." |
| **ACT-TWO-THE-FAR-SHORE.md** | The far shore / boat / Dream + **§Phase 0, the lean validate-first plan** (re-promoted). |
| **COFFERS.md** | The real-money trip-fund research + funding decision (witness-not-holder; manual tracker → couple-owned rail; **never Stripe Connect**). Verified deep-research, 2026-07-21. |
| **DIRECTION.md** + **art/ART-BIBLE.md** + **art/tokens.json** | Inklight art direction, palette, emblem-ladder materials, DTCG tokens. |
| **art/RIVE-SEAL-BLUEPRINT.md** | Rive authoring spec — the view model mirrors `SigilSpec` 1:1. |
| **art/asset-sheets.md** + **art/prompts.md** | AI-gen bootstrap boards + the Inklight prompt library (free via Google AI Studio). |
| **LAUNCH-PATH.md** | The **deferred** native build/ship plan (Expo + Convex + Rive, $0-until-users, reader-model billing). The "when we go native" playbook. |
| **convex/schema.ts** | The backend spine — a **design artifact** (needs a real migration pass; RISK-REGISTER Tier 6). |
| **lib/engine/sigil.ts** | The registry-driven sigil engine — adding a chord/legendary is one entry. |
| **NEXT-SESSION.md** | Art tooling = resolved; **macro/calorie estimation logic is still open.** |
| **CLAUDE.md** | Standing briefing + Quick Resume (points here). |

## Decision log — 2026-07-22

1. **Voice logging shipped** — "speak your day" (transcript → `parseDayDictation` → editable review →
   `commitVoiceDay`) + an ephemeral partner-playable voice note (`voice_notes`, encrypted, couple-day
   expiry). Deployed to prod on `main`; the B2–B4 cutover was already live, DB clean/empty awaiting
   first signup. (Memory: `voice-logging-shipped`.)
2. **The Lighthouse world canon** (`THE-LIGHTHOUSE.md`) — the app becomes one inhabited place: a
   lighthouse on an island. Horizontal (swipe): Garden ← Hearth Hall → Docks + far shore. Vertical
   (rise): Hearth → Library/Compendium → Lamp; the cast rises to the lamp and the beam reaches the
   shore. Archipelago = private islands, shared heavens. The "museum" retires → the **Apothecary**,
   one shelf of **five** books. Three discipline lines: game-*feel* not game-*scope*; the current web
   stack, **NOT** the parked native rewrite; the spectacle stays *earned*.
3. **Next** — a Fable-subagent implementation plan for the world's graphics (sigil-level, then polish),
   architecting the Library/Compendium + Glade/Garden + Docks/ship (coffers-linked) alongside.

## Decision log — this session (2026-07-20 → 21)

1. **The Sigil Turn** — the app re-centered on the sigil (not creature-raising); creatures → a summoned
   bonus; IA → a shelf of four books; the emblem ladder (material escalates with tier).
2. **Native stack decided, then deferred** — Expo + Convex + Rive + Clerk + reader-model billing, via a
   4-agent adversarial round; $0-until-users. **Deferred** by the contingency round (#4).
3. **Sigil engine → registry** (`lib/engine/sigil.ts`), 50/50 tests still green. Convex `seals` store
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
