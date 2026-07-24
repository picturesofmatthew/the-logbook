> **Superseded in emphasis (2026-07-21).** This doc's **pet-raising** focus is superseded by
> `THE-SIGIL-TURN.md` — the **sigil is the hero**; the creatures (the familiar included) are demoted
> to a quiet bonus. For art direction, **`art/ART-BIBLE.md` is now the single source of truth**. Kept
> here for its research foundation, palette, and roster detail — but read those two first.
> The **world/spatial** frame is now **`THE-LIGHTHOUSE.md`** (2026-07-22): the app is a lighthouse on
> an island — the Glade becomes the **west garden**, a wing, not the home.

# Inklight — Art Direction & Overhaul Plan (v3)

*Signed × Sealed — the art direction: crisp ink over lantern-lit gouache, bound in an arcane book, opening onto the Glade.*
*v1 2026-07-19 (research-backed direction) · v2 same day (sigil engine, spellbook, violet, bestiary) · v3 same day: rosters filled per Matthew ("fill and iterate"), structured workout logging added, Glade vitality system, small-folk variety, art production = Matthew via ChatGPT + human direction.*

---

## The thesis

You aren't raising a pet — you're earning the trust of spirits, and **writing a grimoire together while you do it**. Every day becomes a page: what you ate, how you moved, how you felt — inscribed, sealed, composed into a sigil only that day could produce. The effort behind those pages manifests as a place: **the Glade** (alt name: the Vale — Matthew's call), which grows richer, greener, and more populated the more consistently you both show up. The Glade keeps the spirits; the book keeps the memory.

**Inklight**: hand-inked line over matte gouache washes, day → dusk → lantern-night cycle, arcane ornate book. Warm-dark, never pastel, never punishing.

## Verified research foundation

*(unchanged — 16/16 claims survived adversarial review; citations in the artifact brief)*: Shirahama's engraving + children's-book + Nouveau recipe; sigils designed child-simple, drawing = magic; two-layer ink/gradation production; diegetic frames; Oga's ~2-dozen-color gouache discipline; wet-on-wet large-to-small method; kodama density as health barometer; bloom-and-wither footsteps. Gaps: Spirited Away claims unverified (night logic is our derivation); all hexes are proposals.

## The six design laws

1. **Ink line + gouache wash, two layers always.**
2. **One master palette, ~20 swatches, three light states.** No pure white/black/gray.
3. **Purple is relational.** Matthew = moss, Kennedy = ember; violet appears only in union (seal blooms, resonant/legendary illumination, secret chrome, the night sky).
4. **Frames are diegetic** — windows, archways, runic circles, the book's ornate borders.
5. **The world states the score wordlessly.** Growth blooms; lapses hush, never rot. No red numbers, ever. A hushed Glade is still beautiful — winter, not death.
6. **Rituals are inscribed.** Drawn, not tallied; child-simple gestures.

## The light script

*(unchanged from v2 — full token table in the artifact brief)* Day/dusk/night from the tz cookie. Violet family: `#6f5a78` dusk sky-top · `#453a54` night-sky wash · `#8d7aa8` arcane accent · `#c9b3e3` sigil illumination. Violet never in day-mode chrome — union moments only.

## The Training Log — structured workouts *(new in v3)*

Real workout logging, not a toggle. Example day: **"Chest & Triceps"** — Bench Press 3×8 @ 185 lb, Incline DB Press 3×10 @ 60, Pushdowns 4×12 @ 47.5.

**UX:**
- Split title via preset chips (Chest & Tris, Back & Bis, Legs, Shoulders, Push, Pull, Full Body, Cardio, Mobility, Rest) or free text.
- Exercises with autocomplete from your own history (the exercise library grows like the pantry — no seed data needed).
- Per exercise: sets as weight × reps rows; "repeat last set" one-tap; bodyweight allowed (weight nullable). Cardio entries: kind + minutes + optional distance.
- Optional note. The old `training: lift|cardio` day-toggle stays as a quick-mark and auto-sets when a workout is logged.

**Schema (additive):**
- `workouts` — id, profile, day, title, note, createdAt
- `workout_sets` — id, workoutId, kind (`lift`|`cardio`), exercise, setIndex, weightLb?, reps?, minutes?, distanceMi?

**Engine (`lib/engine/training.ts`, pure + tested):**
- Day summary: split family (push / pull / legs / full / cardio / rest), total volume (Σ weight×reps), cardio minutes, PR flags (per-exercise best by est. 1RM — Epley — computed from own history).
- Feeds the sigil (ornaments, chords below), the Glade (vitality), and the beings (Stag, Hare trust).
- A PR is **"a New Mark"** — small ceremony, star at the sigil's apex.

## The Sigil Engine — the heart

Deterministic and pure: both keepers' day-data → one SigilSpec. Same day, same sigil. `lib/engine/sigil.ts` + `components/sigil/SigilGlyph.tsx` (SVG composer over the parts library) + `sigil_discoveries` table.

**Grammar:** two-half base ring (moss/ember) closing when both log → **radicals** from food halls (8, per `lib/halls.ts`: protein = anchor bar · produce = leaf curl · grains = sheaf ticks · dairy = crescent · snacks = twist · sweets = spark · drinks = wave · dishes = knot) → **cardinal ornaments** from the split family (7 lift families, per `lib/engine/training.ts`: push = twin pillars · pull = hooks · legs = roots · full = the square · cardio = wind spirals · mobility = a bow curve · rest = still horizon / carries none), weighted by training volume → **ink temperature** from moods → **ring weight** from calories vs. target (deficit / maintenance / feast — all three legitimate, none renders ugly) → **New Mark star** on PR days → date-seeded micro-variation.

### The chords (v3 full draft — iterate as we see them)

Struck when the halves align:

1. **The Lean Chord** — both in deficit
2. **The Iron Chord** — both hit protein target
3. **The Anvil** — both logged a lift workout
4. **The Twin Split** — same split family, same day (subsumes the Anvil when struck)
5. **The Long Road** — both did cardio
6. **The Spring** — both 8+ cups of water
7. **The Green Chord** — both logged produce
8. **The Hearth Chord** — both logged a dish (home cooking honored)
9. **The Mirror** — matching moods
10. **The Scribe's Chord** — both wrote a note on the day
11. **The New Mark** — either keeper PR'd (one person can gift the day a chord)
12. **The Twin Peaks** — both PR'd the same day (rare)

Tiers: **Common** (both logged) → **Fine** (1 chord) → **Resonant** (2–3) → **Legendary** (named combos below). Resonant+ gains violet linework; legendary renders fully illuminated.

### The legendaries (v3 full draft — secret, silhouetted until first earned)

Spanning archetypes so no single virtue gets a monopoly — this is load-bearing for tone:

1. **The Twin Foxes** — Lean + Twin Split + Iron. *The grind, honored.*
2. **The Still Water** — both rest day + the Spring. *Recovery is a discipline.*
3. **The Ember Vigil** — both logged, both moods low. *Showing up on a hard day is its own magic.*
4. **The Feast Seal** — shared over-target day, both logged. *A feast together is celebrated, never punished.*
5. **The Twin Peaks** — both PR the same day. *Iron mythology.*
6. **The Green Cathedral** — Green Chord + the Spring + both trained. *The clean day.*
7. **The Long Road Home** — Long Road + the Spring + Lean. *Endurance.*
8. **The Mirror at Dusk** — the Mirror + both logged within an hour of each other. *Timing as tenderness.* (createdAt timestamps already exist)
9. **The Quiet Moon** — Ember Vigil struck on a full-moon night. *Seasonal-spooky; moon phase is deterministically computable.*
10. **The First Page** — awarded retroactively to your first-ever both-logged day when the Spellbook ships. *The founding memory.*

## Glade vitality *(new in v3)*

"The quality of the Glade that manifests due to our efforts" — a pure engine (`lib/engine/glade.ts`): rolling ~14-day window of both keepers' activity (both-logged days, chords struck, workouts, water, legendaries) → vitality tier:

**Hushed → Waking → Green → Flourishing → Radiant**

Renders as: undergrowth and bloom layers, stream/pool fullness, firefly density, small-folk *variety* (below), being liveliness (sleepy ↔ active idles). Rules: rises fast, falls slow (hysteresis); **Hushed is misty-serene, never dead** — winter, not ruin; beings never leave, they doze.

## The small folk *(v3 — wicks become a varied population, kodama-style)*

Variety unlocks with vitality; count tracks overall consistency. Each family: silhouette-first, one color, one signature motion.

- **Wicks** — flame-wisps at the lantern, night. Motion: flicker-tilt. *(the originals)*
- **Mosslings** — pebble-sized moss-capped sprites, day. Motion: slow head-tilt (our kodama-nod, ours in design).
- **Inklings** — tiny ink-drop spirits with paper wings; flutter near the book when the day's page has entries. Motion: page-hop.
- **Dewdrops** — pool spirits, dawn/dusk, only after the Heron arrives. Motion: ripple-blink.
- **Emberlings** — hearth sparks on Feast/Hearth days. Motion: pop-drift.

## The Bestiary *(v3 full roster — iterate as we see them)*

Consistency calls creatures; the *kind* of consistency decides who. Each being: one chord family, one Glade zone, trust stages (evolving art), one signature idle. Nothing ever leaves.

**Founding**
1. **The Fox — the familiar** — day 0. Five-stage antler-revelation arc (engine live, thresholds unchanged). Anchors the lantern. *(Demoted to a quiet bonus — the sigil is the hero now; see `THE-SIGIL-TURN.md`.)*

**First wave** *(ship with Phase 3 — proposed: Stag + Heron)*
2. **The Stag** — called by Iron Chord / Anvil family. Anchors the tree line. Trust arc: yearling → crowned elder; antlers leaf out at Radiant vitality.
3. **The Heron** — called by the Spring. **Its arrival creates the pool** — the scene visibly grows. Idle: one-legged stillness; a single strike at dusk.

**Second wave**
4. **The Tortoise** — called by the Green Chord. Carries a shell-garden that grows with trust; seasonal blooms.
5. **The Moth** — called by Still Water patterns (rest + recovery). Night-only, lantern-drawn; wing-dust glints violet on resonant days. The first spooky-soft being.
6. **The Crow** — called by the Ember Vigil. Lantern-eyed watcher at the dark edge. October's native.

**Deep wood** *(rare)*
7. **The Hare** — called by the Long Road. Meadow zone; dawn zoomies idle.
8. **The Salamander** — called by Feast Seal / Hearth Chord family. Lives in the firepit; the anti-guilt being — abundance honored.
9. **The Owl** — called by the Scribe's Chord. Perches at the book-stand; night reader; turns its head to watch inscription.
10. **The Koi** — pool-dweller; arrives only after the Heron + sustained Spring. Violet-flecked; luck omen.

**Mythic** *(secret — not listed in the compendium until first glimpsed)*
11. **The Pale Elk** — glimpsed only at Radiant vitality within days of a legendary sigil. Moon-pale, moss-hung antlers, footsteps that bloom and fade. Never stays. Our Shishigami-adjacent presence — reverent nod, entirely our own design.

## The Spellbook

*(unchanged from v2)* Day pages (sigil at head, both keepers' inscriptions beneath — now including the workout log), the Compendium (month as a page of seals; secrets silhouetted), the Pantry appendix (food library data model untouched), trends as an in-book chart plate. Arcane and ornate: engraved borders, hatched chrome, gilt-and-violet detailing.

## Art production *(v3 — decided)*

**Matthew produces masters via ChatGPT + human art direction.** What the engine needs from that pipeline:

- **Sigil parts library — must be SVG** (procedurally composed): 2 ring halves × 3 weights, 8 radicals, 6 cardinal ornaments (from 7 lift families — rest carries none), 4 tier cores, New Mark star, legendary frames (10). Clean single-weight strokes, no fills dependency.
- **Beings — PNG sprite sheets ok** (transparent, 2x/3x): per being, per trust stage: 1 idle loop (2–4 frames, the snappy `steps()` cadence) + 1 arrival pose. First wave: Fox (5 stages, replacing string-map sprites) + Stag + Heron.
- **Small folk**: 1 frame + 1 motion frame each family.
- **Glade plates**: layered washes + silhouette bands per light state × vitality tier (layerable, not baked into one image), per the Oga large-to-small structure.
- **Style constants for every prompt**: two-layer (crisp ink line + matte gouache wash), coarse hatching only in chrome, silhouette-first, palette locked to the token table, no pure white/black/gray.
- A prompt library file will live at `art/prompts.md` (brand-book pattern) once Phase 1 starts.

## Build plan (engine-first)

**Phase 0 — The base coat.** Three-state tokens incl. violet; light-state from tz cookie; grain/hatching/lantern-pool utilities; frame primitives. *(globals.css · tz-sync.tsx · lib/light.ts)*

**Phase 1 — The engines.** `lib/engine/sigil.ts` · `training.ts` · `beings.ts` · `glade.ts`, pure + tested; workout schema (`workouts`, `workout_sets`) + `sigil_discoveries`; Training Log UI (drawer flow); sigil composer on placeholder geometry; day-seal + today's sigil on home; ceremonies (completion, New Mark, first discovery). Partner-usable polish: real passcodes, real FDC key, logging-speed pass. *(the big phase now — it's the product)*

**Phase 2 — The Spellbook.** `/book`: day pages (with workouts), compendium + silhouetted secrets, pantry, trends plate. Ornate chrome showcase.

**Phase 3 — The Glade & first-wave beings.** Layered zoned scene; Fox art (5 stages) + Stag + Heron + small-folk variety; vitality rendering; bloom/wither grammar. Matthew's masters drop in here.

**Phase 4 — The rest of the house.** Settings, enter, sound pass (paper/ink/chime; one low warm tone for legendaries).

**Phase 5 — The launch track** *(separate decision, from Chiang Mai)*: Expo port, pairing, push/widgets, 10-couple beta.

## IP safety

Techniques and principles, never assets. The sigil grammar, the small folk, the beings, the Pale Elk — all ours in design. Mossling ≠ kodama, Pale Elk ≠ Shishigami: nods in spirit, distinct in form.

## Decisions

- ~~1 · Direction~~ — **approved** (prototype). ~~4 · Sigil depth~~ — **superseded** (full grammar is the core).
- ~~3 · Small folk~~ — **decided**: varied kodama-style population (wicks + mosslings + inklings + dewdrops + emberlings).
- ~~5 · The hands~~ — **decided**: Matthew via ChatGPT + human direction; engine starts on placeholder geometry.
- ~~6 · Chords & legendaries~~ / ~~7 · Bestiary~~ — **drafted in full above (mine); iterate as we see them in-app.**
- **2 · The fox (the familiar)** — no longer the protagonist: **demoted** to a quiet familiar/bonus (the sigil is the hero, per `THE-SIGIL-TURN.md`).
- **8 · Glade vs. Vale** — Matthew's naming call (spec currently says Glade).
- **9 · First wave** — proposed Stag + Heron alongside the Fox; confirm or swap (Moth if you want the spooky-soft tone in wave one).
