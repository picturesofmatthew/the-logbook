# Signed × Sealed — Project Brain

*The orientation index + current state + decision log. Read this FIRST on any cold start, then follow
the doc map. Last updated 2026-07-24.*

## Status snapshot

- **⚡ Update 2026-07-23 — the Lighthouse world IS the app (shipped + live).** `/` now renders the world:
  opening the site crosses a mandatory **cold-open gate** (the whole world → *begin* → a fluid push-in to
  the hearth); all five rooms (hearth · garden · docks · library · lantern) are real and swipe/rise-navigable;
  the day is logged at the hearth; the old glade home retired (glade → Garden room, seal → hearth mantle,
  horizon → Docks). Shipped as **World Engine 1–9/n** on `main`. A **review + simplify pass**
  (`REVIEW-PLAN.md`) is underway — the core loop is verified moved byte-identical; a11y/interaction fixes +
  an in-world invite are landing. See the 2026-07-23 decision log.
- **⚡ Update 2026-07-22 — voice shipped + a new world canon.** "Speak your day" voice logging is live
  in prod; the B2–B4 cutover is deployed (DB clean-wiped, awaiting first signup). And the world has
  been re-centered: **`THE-LIGHTHOUSE.md`** is the new canon — the app is a **lighthouse on an island**
  (garden west, library up the stair, docks + far shore east; the cast rises to the lamp). See the doc
  map + the 2026-07-22 decision log.
- **LIVE on `main`** — Next.js 16 + Neon PWA at signedxsealed.com (Vercel). The core loop runs on real
  phones: the two-keeper seal from both users' data, the full sigil engine (chords/tiers/legendaries),
  the glade + beings, the spellbook, fast food/workout logging + **voice "speak your day" logging**,
  ceremonies, sound. **75/75** engine tests. **B2 accounts + pairing + at-rest encryption are live**
  (the B1 passcode is retired); the DB was clean-wiped, awaiting the first real signup.
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

## Next up — wire the world's verbs (+ the cohesive visual audit)

The world is **built and live** as one inhabited place — a lighthouse on an island (`THE-LIGHTHOUSE.md`),
built via **`WORLD-ENGINE.md`** ("engine once, rooms forever"; DOM/SVG-first). All four island rooms since
shipped their **ornate hero art** (Fable proto → hand port, World Engine 12–14). The structure and the
ornate art are done; the work now is **verbs, not wiring** — the rooms are already data-bound. Two parallel
tracks, both indexed in **`ROADMAP.md`**:

1. **BUILD — give the world verbs (`WIRE-THE-WORLD-HANDOFF.md`).** Onboarding-as-cold-open + the beautiful
   **Letter** (land *before* first signup so Matthew + Kennedy carry `character` + `vow`); the
   **Apothecary's Counsel** (deterministic same-hall food alternatives, engine-first); **Beacon guardrails**
   (`THE-BEACON.md` — keep the beam aimable, the coffer the pledge rail; the social feature itself is future).
2. **POLISH — the cohesive visual audit (`WORLD-AUDIT-HANDOFF.md`).** Judge the four rooms **together as one
   world of logic** — perspective, cross-room consistency (shared sky, travelling light, far shore, the
   gold/silver grammar, relational violet, the one key), the emotional value of details per screen; iterate
   live (cheap — DOM/SVG hot-reload). Queued alongside: **deepen the interiors** (the Book of Days → a true
   rereadable day-by-day spread, both logs facing; the shore interior) and the **cast cinematic** (rise to
   the lamp → beam sweeps the shore).

In parallel: Matthew + Kennedy dogfood the world + voice logging; notes feed classifier tuning + polish.
Still-open logging friction to fold in when touched: water/mood/weight aren't in the fast capture path yet;
meal could default by time of day; servings could remember last-used per food. Loop-reliability items
(canonical couple-day = **Track A**; the async ~36–48h close window + love-tap/web-push remain) live in
`RISK-REGISTER.md` + `ROADMAP.md`.

## The document map (read order)

| Doc | What it is |
|---|---|
| **PROJECT-BRAIN.md** (this) | Orientation, state, decision log, doc map. Read first. |
| **ROADMAP.md** | **The central register (2026-07-24).** Open decisions (Matthew's calls), the build backlog (incl. **Track A** + the seal-tech backlog), and deferred-with-reason. The phase/backlog index the other docs point to. |
| **BRAND-BIBLE.md** | **The founding brand bedrock (2026-07-22).** Essence, color, type, material, lighting, motif, voice, motion, application, do-not. The absolute place; `ART-BIBLE` (art) and the world docs inherit from it. |
| **THE-LIGHTHOUSE.md** | **The world canon (2026-07-22).** The app is a lighthouse on an island — spatial architecture (garden/hearth/docks + tower), the cast cinematics, the archipelago, the three discipline lines. Read for the world/experience. |
| **WORLD-ENGINE.md** | **The build architecture (2026-07-22).** "Engine once, rooms forever" — the shared world engine + how rooms plug in; DOM/SVG-first (Pixi reserved). Read before building rooms. |
| **THE-BEACON.md** | **The social canon (2026-07-24).** The lamp as the app's social organ — aim your beam at another bond's island to encourage them (a being, free, only on days you kept your own light) or pledge money (future). Catalogued now, built later; evolves the archipelago. |
| **WIRE-THE-WORLD-HANDOFF.md** | **The interactivity handoff (2026-07-24).** Give the live world *verbs*: the Apothecary's Counsel (deterministic food alternatives), Beacon guardrails, onboarding-as-cold-open + the beautiful Letter. Speced to real code seams. |
| **WORLD-AUDIT-HANDOFF.md** | **The visual-audit handoff (2026-07-23).** Assess the four ported rooms **together as one world** — perspective, cross-room coherence, the emotional value of details; imagery + code in unison. |
| **REVIEW-PLAN.md** | The review + simplify pass over the World build (canon → review → simplify → punch list). Its §6 deferred items feed `ROADMAP.md`. |
| **SIGIL-HANDOFF.md** | The developed seal: its grammar, the swappable parts registry (`components/sigil/glyphs.ts`), and what's next. **Read to continue the sigil/art work.** |
| **THE-SIGIL-TURN.md** | The sigil-as-spell thesis, the emblem ladder, creatures-as-bonus. (The "four books" are now five, up the Lighthouse tower.) |
| **RISK-REGISTER.md** | The 4-agent contingency findings, deduped + ranked by severity + phase. The "what to watch." |
| **ACT-TWO-THE-FAR-SHORE.md** | The far shore / boat / Dream + **§Phase 0, the lean validate-first plan** (re-promoted). |
| **COFFERS.md** | The real-money trip-fund research + funding decision (witness-not-holder; manual tracker → couple-owned rail; **never Stripe Connect**). Verified deep-research, 2026-07-21. |
| **DIRECTION.md** + **art/ART-BIBLE.md** + **art/tokens.json** | Inklight art direction, palette, emblem-ladder materials, DTCG tokens. |
| **art/RIVE-SEAL-BLUEPRINT.md** | Rive authoring spec — the view model mirrors `SigilSpec` 1:1. |
| **art/asset-sheets.md** + **art/prompts.md** | AI-gen bootstrap boards + the Inklight prompt library (free via Google AI Studio). |
| **LAUNCH-PATH.md** | The **deferred** native build/ship plan (Expo + Convex + Rive, $0-until-users, reader-model billing). The "when we go native" playbook. |
| **convex/schema.ts** | The backend spine — a **design artifact** (needs a real migration pass; RISK-REGISTER Tier 6). |
| **lib/engine/sigil.ts** | The registry-driven sigil engine — adding a chord/legendary is one entry. |
| **CLAUDE.md** | Standing briefing + Quick Resume (points here); imports `AGENTS.md`. |
| **AGENTS.md** | The Next.js-version guardrail (imported by `CLAUDE.md`): this Next.js has breaking changes — read `node_modules/next/dist/docs/` before writing code. |
| **README.md** | The public repo readme — what the app is, the stack, the commands, contributor orientation. |

## Decision log — 2026-07-24

1. **New social canon + interactivity handoff.** `THE-BEACON.md` (the lamp as the app's social organ —
   aim your beam at a neighbor bond's island: a being to their glade, free, only on days you kept your own
   light; a money pledge later) and `WIRE-THE-WORLD-HANDOFF.md` (give the live, data-bound rooms *verbs*)
   were written. Reframe: **the rooms are live tableaux missing interactions — the work is verbs, not
   wiring.**
2. **Three calls locked.** (a) **Food alternatives = pure deterministic** — same hall, better macros
   (protein density), **no curated seed, no LLM** in v1. (b) **Character = 6–8 Inklight keeper archetypes** —
   a procedural-SVG composer (`keeper-glyph.tsx`) in the sigil/familiar lineage, fulfilling the canon "each
   keeper elects their own sprite at the mantle." (c) **Partner invite = a $0 share-link Letter** — the
   craft is in how the letter *unfurls when opened*, not the transport (no email in v1).
3. **Interactivity build kicked off** (current web stack, `$0 until users`): onboarding-as-cold-open + the
   **Letter** (land before first signup), the **character system**, and the **Apothecary's Counsel**. Any
   LLM-assisted logging stays **behind a flag on the current stack** — the deterministic path is v1; the LLM
   ideation layer is the catalogued-deferred long-tail (`WIRE-THE-WORLD-HANDOFF.md`). This does **not**
   un-park the native rewrite; Beacon work is guardrails-only for now.
4. **New central register.** Added `ROADMAP.md` — the open-decisions (Matthew's calls) + build-backlog +
   deferred index the other docs point to (resolves the dangling `ROADMAP.md` / **Track A** pointers).

## Decision log — 2026-07-23

1. **The world became home (World Engine 1–9/n, live on `main`).** The Lighthouse canon shipped as the app:
   `/` renders `WorldShell` (camera + swipe/rise + the cold-open gate + in-world logging); the old glade
   home was retired and its pieces relocated (glade → Garden room, seal → hearth mantle, horizon → Docks).
   The five rooms — hearth · garden · docks · library · lantern — are all real. The **core-loop pipeline**
   (recording legendaries/arrivals/reached-shores + firing the four completion ceremonies) was **relocated
   from the old home into the new `/` byte-for-byte** (verified in the review; only `stamps` intentionally
   dropped). `hearth/page.tsx` → redirect to `/`; the "museum" → **the Apothecary**; Relics retired.
2. **Review + simplify pass** (`REVIEW-PLAN.md`). Findings: the loop moved intact and the gate does not
   replay after logging (`openCapture` is an in-place overlay; `router.refresh()` is soft, so `WorldShell`
   stays mounted). Fixes landed: cold-open gate made keyboard-operable; the global arrow-key handler guarded
   (phase/dialog/edge); off-screen room hotspots taken out of the tab order; the capture scrim raised above
   the world (dim + tap-to-close restored); a **second-keeper invite** surfaced in-world. Then a `/simplify`
   pass on the world components (tests green).
3. **Still canon-only (next):** the ornate hero graphics (Fable), in-world book/vessel interiors, the cast
   cinematics. Art today is v1 CSS/SVG; the structure is the thing that's done.

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
