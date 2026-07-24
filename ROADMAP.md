# Signed × Sealed — Roadmap & Open Decisions

*The central register: the phase/backlog tracker the other docs point to by name, and the home for
**Matthew's open calls**. Created 2026-07-24 to resolve the dangling `ROADMAP.md` / **Track A**
pointers in `SIGIL-HANDOFF.md` and `RISK-REGISTER.md`. Everything here is **migrated from existing
docs** — nothing invented; each item cites its source. Skim the three groups: **Open decisions →
Build backlog → Deferred (with reason).***

---

## Open decisions (Matthew's calls)

*Gathered from every doc's "still open" / "my call" list. Decide here, then push the call back into
the owning doc.*

### Naming
- **Glade vs. Vale — RESOLVED / moot.** Long an open naming call (`DIRECTION.md` Decisions #8,
  `THE-SIGIL-TURN.md`). Superseded: the Glade was renamed **the Garden** in `THE-LIGHTHOUSE.md` (the
  west wing of the lighthouse). No further call needed.
- **The world's proper names** — the structure ("the Lighthouse" / "the Keep" for the couple's shared
  holding), the island, and the light itself. (`THE-LIGHTHOUSE.md` Still open)
- **Book titles** — the five books are proposals; land your own (Book of Days / Legendarium / Bestiary
  / Apothecary / Almanac). (`THE-LIGHTHOUSE.md`, echoed in `THE-SIGIL-TURN.md`)
- **The Beacon's name** — `THE-BEACON` (working) / "the Answering Light" / "the Signal Fires" / "the
  Watch." (`THE-BEACON.md` Still open)

### Art / brand
- **First-wave beings** — proposed Stag + Heron alongside the Fox; confirm or swap in the Moth for the
  spooky-soft tone. (`DIRECTION.md` Decisions #9)
- **Ceremony intensity** — how far the "sling-ring" spectacle goes before magical tips into *much*.
  Tune live. (`THE-SIGIL-TURN.md` Still open)
- **Wax color ownership** — call: sealing-wax garnet `#93372b` belongs to the **union**, distinct from
  keeper B's terracotta. (`BRAND-BIBLE.md` Open decisions #1)
- **App icon** — call: the **wax seal**, not the lighthouse (brand root + small-size legibility).
  (`BRAND-BIBLE.md` Open decisions #3)
- **Dark mode** — call: the **night light-state** (warm lantern, time-driven), not a cold toggle.
  (`BRAND-BIBLE.md` Open decisions #4)
- **Violet's range** — call: violet stays **union-only** (its scarcity is what makes union sacred).
  (`BRAND-BIBLE.md` Open decisions #5)

### The Beacon (social) — shape, before any build
- **The free gift's exact form** — a being to their glade, a mote to their sky, or both.
  (`THE-BEACON.md` Still open)
- **The archipelago's v1 shape** — a full spatial pull-out view, or a simpler "neighbors" panel to
  start. (`THE-BEACON.md` Still open)

### Flagged for Matthew (raised in the 2026-07-24 doc-integrity pass — canon unchanged pending his call)
- **⚑ Font stack vs. what's live.** `BRAND-BIBLE.md` bans neutral sans and adopts **Fraunces / EB
  Garamond / Courier Prime** as canonical (Open decisions #2); `SIGIL-HANDOFF.md` records the app
  swapped to **Fraunces + Hanken Grotesk** — Hanken is a neutral grotesk the brand rule excludes.
  Reconcile the canonical trio against what's actually shipping. **Matthew's call — no font canon was
  changed in the audit.**
- **⚑ Publish the private tenancy design?** `~/.claude/plans/distributed-seeking-snail.md` (the full
  `bond`/`Slot` multi-tenant design) is referenced from `AGENTS.md` but lives **outside this PUBLIC
  repo**. Decide whether to bring it in (and scrub it) or keep it private. **Matthew's call — not
  copied in during the audit.**

### The five questions that would most sharpen v2 (from `BRAND-BIBLE.md`)
1. Should the **sealing wax** read redder/brighter, or stay in its burnt-earth family — and does its
   color shift at the *moment* of sealing (cool garnet → lit ember)?
2. How **literal** is the correspondence metaphor in the UI — actual envelopes/letters/postmarks, or
   kept abstracted into the seal + book language?
3. What is the **× in the wordmark** — always a *crossing/press* (two into one), or can it also read
   as "times / and"?
4. Is there a **secondary human record** beyond food/workouts (letters between keepers, photos,
   anniversaries) the "correspondence" language should be designed for now?
5. What's the **one object** a user should feel they own after a year — the book, the seal collection,
   the island, the light? (Whichever wins becomes the brand's center of gravity.)

---

## Build backlog

### ⭐ Current arc — wire the world's verbs (`WIRE-THE-WORLD-HANDOFF.md`)
The rooms are live and data-bound; the work is **adding verbs**, not wiring. Three initiatives,
build order suggested there:
1. **Onboarding as cold-open + the Letter** — land *before* first signup so Matthew + Kennedy carry
   `character` + `vow` from day one; the invite is the growth engine.
2. **The Apothecary's Counsel** — deterministic same-hall food alternatives (engine-first, pure +
   tested), then Library + log-time surfaces.
3. **Beacon guardrails** — only *don't-foreclose* work (keep the beam aimable, the coffer the pledge
   rail); the social feature itself is future (`THE-BEACON.md`).

### Track A — canonical couple-day (loop reliability, applies to the CURRENT engine)
*Elevated here from `RISK-REGISTER.md` Tier 6 / Audit refresh — the one Tier-6 item that bites the
live app, not just the parked native build.*
- **Canonical couple-day invariant.** The couple timezone (`COUPLE_TZ` → `coupleTz()`) must be the
  ONLY thing that buckets `day`; `users.tz` / `loggedTz` stay descriptive (they feed the future
  Long-Distance / Dawn chords). Write it as an engine invariant so two devices in two zones can't
  split the seal. *(Auto-activates on the Oct-2026 Chiang Mai move — fix before long-distance
  dogfooding. `RISK-REGISTER.md` lists it "still live"; `CLAUDE.md` / `PROJECT-BRAIN.md` say
  `COUPLE_TZ` now buckets the day — confirm which, on the live engine.)*
- **The patient day — DONE 2026-07-24.** The couple-day turns at a grace hour after midnight
  (default 4am couple-time, `COUPLE_DAY_ROLLOVER`), so the small hours still keep the day they grew
  out of and the ring gets those hours to close. One chokepoint (`coupleDayOf`/`coupleDayFor`),
  unit-tested, invariant unchanged. The hearth line names the grace out loud past midnight.
- **Remaining loop-reliability** — the deeper async **~36–48h close window** (a seal that can close
  across day keys — a real engine change, not a grace hour) and **love-tap / web-push**
  (per `PROJECT-BRAIN.md` Next-up; the native-side plumbing is Tier 6, below).

### Seal-tech backlog (`SIGIL-HANDOFF.md` §What's next)
- **"Alive when logging"** — the completion **ceremony that draws the seal on** as the day closes (ink
  flows, gold ignites, runes carve in, the union blooms, a plank sets into the boat). This is where the
  seal stops being a picture and becomes the thing you open daily. *(Evolved in `THE-LIGHTHOUSE.md` into
  the vertical cast cinematic — rise to the lamp, beam sweeps the shore.)*
- **Per-chord specific connections** — bind each chord to the *specific* signs it aligned (Same-Table
  links the shared food; the Mirror draws a true reflection), replacing the density-by-count weave.
  Needs the engine to pass which halls each chord relates to.
- ~~**Bespoke legendary cores/frames**~~ — **DONE** (verified 2026-07-24): `LEGENDARY_FACES` in
  `components/sigil/glyphs.ts` gives all 10 legendaries their own emblem + color cast; the 5
  nature-cores now only serve non-legendary days.
- **Wire the latent signals into `SigilSpec`** — absolute **time-of-day** (`lib/light.ts` exists),
  **day-of-week** (unused), a **long-distance / tz chord** (dead-on for the beachhead; tz plumbing
  exists, no chord yet), and expose **mood / moon / water** directly instead of deriving them.

### Deepen the interiors — **FROZEN 2026-07-24** (`THE-ATOMS-HANDOFF.md`)
- Both exploration lenses said stop growing the world; the v1 title-page overlay
  (`world-spread.tsx`) was **cut** and room hotspots now open the real pages. When this thaws (a
  paying couple says the world is why they stay), the work is the **Book of Days** as a true
  rereadable day-by-day spread (real sigils, both logs facing) and the shore interior likewise — and
  the in-place pattern returns with them.

### The atoms (`THE-ATOMS-HANDOFF.md`) — the current arc
- **Done 2026-07-24:** the **Carry** chord (asymmetric support) · the **Sealed Word** v1 (a line to
  your keeper, opened when the ring closes, kept in the book) · the two free cuts (`world-spread`
  stub, bestiary render-time writes → derived `arrivedOn`).
- **Next:** the **Letter** (the invite made worthy — the growth engine) · the **patient day** + the
  waiting light (the async close window; touches the ONE bucketing invariant — highest care).

---

## Deferred (with reason)

### Review/simplify refactors (`REVIEW-PLAN.md` §6)
- **`getWorldSnapshot` in `lib/`** — the pure-assembly-only version is a lateral move; the version that
  genuinely de-risks the world reads must co-locate the read→write→ceremony-gate ordering. **Do it when
  the async-close work next touches `app/page.tsx`.**
- **Extract `useColdOpen` / `useCamera` from `world-shell.tsx`** — the phase/camera/gesture/key state is
  tightly interwoven and was just modified for the a11y fixes; a clean cut is interaction-shaped
  regression risk. **Warrants its own focused pass with browser verification.**
- **Real-browser verification** of the §2b/§2e interaction fixes — recommended at the start of
  dogfooding (standing "don't auto-launch the browser" rule).

### Native-rewrite technical debt — BANK for the native build, not now (`RISK-REGISTER.md` Tier 6)
- Neon→Convex migration must preserve earned history (immutable `discoveries`, snapshot historical
  targets, pin `firstPage`); durable **outbox** for offline gym logs; decouple the love-tap from
  best-effort push; ≥128-bit single-use invite tokens + rate limiting; multiplayer test surface. All
  parked with the native rewrite (`LAUNCH-PATH.md`) until couples pay.

### Deferred product/design debt (carried in `AGENTS.md`)
- Re-pair into a book with a former keeper (needs `bond_members`) · solo-state UI polish · E2E for
  private notes (at-rest done) · per-bond `tz` wiring (column exists, still env-based) · the design-debt
  list (CVD-safe seal, plate rollout to `/today`, type-floor sweep, glade-scroll trim, keeper-color
  unification) · billing / coffers.

---

*Owning docs stay the source of truth for detail; this register is the index of what's undecided,
queued, and parked. When a call lands, record it in the owning doc and strike it here.*
