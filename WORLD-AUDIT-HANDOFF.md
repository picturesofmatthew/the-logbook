# World Visual Audit — handoff for the next context

*Pickup doc for a **detailed visual + code audit** of the four ported Lighthouse rooms, taken in
**together as one cohesive world of logic** (Matthew, 2026-07-23). This context built + deployed all
four rooms as their own worlds; the next context assesses them side by side — perspective, cross-room
coherence, and the **emotional value of specific details** on each screen — with the art and the code
audited **in unison**.*

---

## 0. How this audit runs

- **Matthew provides screenshots** of the rooms (the deployed app and/or the protos). Claude audits
  **both the imagery and the codebase in unison** — for each finding, name the pixel *and* the code
  that draws it, so a fix is one edit away.
- Judge them **as a set**, not one at a time. The whole point is that five rooms read as **one place**.
- Output: a per-room + cross-room findings list (perspective, scale, light, emotional beats, data-truth),
  ranked, each with the file/line to change. Then iterate live (iteration is cheap — DOM/SVG, hot-reload).

## 1. The audit surface — the rooms and their files

Each room is a **flat SVG fragment** the shell draws into one shared `<svg viewBox="0 0 1000 1500">`.
The **proto** is the feeling-target (populated, standalone); the **room** is the live, data-bound port.

| Room | Live component | Proto (reference) | Data in |
|---|---|---|---|
| Hearth | `components/world/rooms/hearth-scene.tsx` (+ `hearth-svg.ts`, `hearth-atmosphere.ts`) | `art/proto/hearth-hall.html` | the sigil `spec` (the seal) |
| **Library** | `components/world/rooms/library-room.tsx` | `art/proto/library-compendium.html` | `LibrarySnapshot` (days, legendaries, beasts, provisions, shores) |
| **Lantern** | `components/world/rooms/lantern-room.tsx` | `art/proto/lantern-lamp.html` | `spec` → lit / kindled / dark |
| **Docks** | `components/world/rooms/docks-room.tsx` | `art/proto/docks-shore.html` | `DocksSnapshot` (dream, planksLaid/goal, complete) |
| **Garden** | `components/world/rooms/garden-room.tsx` | `art/proto/garden-west.html` | `GardenSnapshot` + the real embedded `GladeScene` |

## 2. The shared "world engine" (the systems that make it one place)

- `components/world/world-shell.tsx` — the camera + swipe/rise nav + the cold-open gate + slot layout
  + which overlay is open. Reads: `use-cold-open.ts`, `use-world-camera.ts`.
- ~~`components/world/world-spread.tsx`~~ — **cut 2026-07-24** (the atoms audit). Room hotspots now
  route straight to the real pages; the "interior opens in place" overlay comes back when there is a
  deep, rereadable spread to put in it. (In git history if the pattern is wanted again.)
- `components/world/rooms/world-air.ts` — the one `roomAir` atmosphere factory + each room's air config.
- `components/world/atmosphere.tsx` / `atmosphere-config.ts` — the shell-level particle/glow canvas.
- `components/world/rooms/hotspot.tsx` — the shared tappable `<Hotspot>` (a11y-wired).
- `app/globals.css` — all room motion lives here, prefixed per room: `.lib-*`, `.ln-*`, `.dk-*`,
  `.gd-*`, plus `.world-*` (shell/gate/log/invite). Each has a
  `prefers-reduced-motion` off-switch.
- Canon: `THE-LIGHTHOUSE.md` (world + the "each room is its own world" section), `BRAND-BIBLE.md`
  (the absolute color/type/material/light source), `WORLD-ENGINE.md` (build architecture),
  `art/ART-BIBLE.md` + `art/tokens.json`.

## 3. The connective-tissue checklist (does it read as ONE world?)

Audit each room against these — the threads that make five places one:

1. **One shared sky** — the same night, stars, and the **× asterism** arc over every room; the overview
   shows them at once. (Do the star fields feel continuous? Same palette?)
2. **The travelling light** — the seal composed at the **hearth** rises the tower to the **lantern**,
   whose **beam** reaches the **docks'** far shore. (Is the beam/shore the *same* object across rooms?)
3. **The far shore** — the **three-gold-rects** thumbnail must be recognizably the same shore in the
   hearth's east window, the lantern's horizon, and the docks. (Consistent?)
4. **Gold-lived / silver-waiting** — the one visual language everywhere: books' meniscus, the vessel's
   gold planks vs silver ghost-strakes, the docks' gold beam-road vs silver moon-road, the garden's
   union rose. (Consistent grammar? Same golds/silvers?)
5. **Violet is relational** — appears ONLY in union/legendary moments (completed seals) and the
   dusk/night sky; never in day chrome. (Audit every violet: earned or decorative?)
6. **The one key** — the lantern-room key hangs home in the lantern; its empty hook waits in the hearth
   and library protos. One key, one spine. (Present + consistent?)
7. **Perspective + scale** — all rooms are the 1000×1500 portrait frame. Do they share a horizon logic,
   a light direction, a sense of being floors/wings of one structure? Or do any read as a different game?

## 4. Open aesthetic questions to resolve in the audit

Surfaced during the build; each needs Matthew's eye + a code tweak:

- **Violet strength & consistency** — Lantern's lit-core violet (~40% radial — subliminal enough?), the
  Library stairwell's violet breath, the Garden's violet union-rose. Are they the *same* violet, at
  consistent intensity, always earned?
- **The Docks "two roads"** (gold beam-road + silver moon-road on the sea) — a new invention. Keep? Tune?
- **The Garden union-rose ×** (moss + ember roses crossing, the single violet rose "which cannot bloom on
  one stem") — prominence/placement.
- **Data-truth on the Almanac** — its gold currently tracks a multi-year arc (`days/1461`), so 214 days
  still reads near-silver. Confirm that's the intended honesty, or rebalance.
- **Lantern conventions** — the section-cut dome + finial (doll-house convention), and lamp-only lighting
  (no candles) — do they read in situ?
- **In-world interiors depth** — the book spreads are evocative **title pages** (v1). The **Book of Days**
  is the flagship to deepen into the true rereadable day-by-day spread (real sigils, both logs facing).
  The vessel opens a **shore interior** (wired this context) — assess its content depth too.
- **Emotional value per detail** — Matthew's explicit ask: for each screen, which details *earn* their
  place emotionally, which are noise, which are missing. (e.g., the unmanned vessel, the garden's crossed
  gloves, the keeper's log, the "it tells only now" sundial.)

## 5. Constraints to remember

- **Can't browse the live rooms without a bond** — the DB is clean-wiped for Matthew + Kennedy's first
  signup, and `foods` is a shared global, so DO NOT seed test data in prod. Screenshots come from
  Matthew's own session or the protos; a scratch DB is needed for automated Playwright. (See memory
  `browser-test-needs-scratch-db`.)
- **Iteration is cheap** — a ported room is inline SVG + CSS; small detail changes are one-value edits
  that hot-reload. No rebuilds. Only a wholesale re-conception of a room needs a new Fable proto.
- **Discipline** — game-*feel* not scope; current web stack; the spectacle stays *earned*; every ornament
  sits on a **true** number.

## 6. Status — SHIPPED (2026-07-23)

All four rooms built as their own worlds + deployed to signedxsealed.com. Commits on `main`:

- `9ce571f` — **World Engine (12/n)**: the Library becomes its own world (+ the in-world book spread).
- `988aec8` — the Lantern proto (feeling target).
- `6de08d0` — **World Engine (13/n)**: the Lantern becomes its own world (three live watches).
- `4ebe770` — **World Engine (14/n)**: the Docks + Garden + the shore interior — the four stand.

Pipeline used: **Fable renders a proto → a port subagent translates it to a data-bound React room
(self-verifying `tsc`/build) → I own the shared architecture (the interior overlay) + review + commit.**
Every room landed `tsc`-clean, `npm test` 75/75, build green (20 routes). Each was reviewed for the
conventions a build can't catch: flat SVG fragment (except the Garden, a live-component `<div>` layer),
per-room id-prefixing (`lib_`/`ln_`/`dk_`/`gd_`) against the shared svg, unchanged public interface,
and correct data-binding.

**Port caveats / deferred (audit fodder):**
- ~~**In-world interiors are v1 title-pages**~~ — **cut 2026-07-24**: the title-page overlay was
  removed and hotspots now open the real pages. When the **Book of Days** becomes a true rereadable
  day-by-day spread (real sigils, both logs facing) and the shore interior likewise, the in-place
  pattern comes back with something worth opening. Frozen until then.
- **Almanac data-truth**: gold tracks `days/1461` (a ~4-year arc), so it reads near-silver early — confirm
  or rebalance.
- **The two roads** (Docks) and the **union rose-×** (Garden) are new inventions — keep/tune per Matthew.
- **Violet audit**: lantern lit-core (~40% radial), library stairwell breath, docks (union only), garden
  union-rose, hearth — confirm consistent intensity + always earned.
- **Garden furniture** (crossed gloves, trug, espalier, birdbath wick-spirit) present but marked
  nice-to-have — audit which details earn their emotional place.
- **Can't view live without a bond** (clean DB) — screenshots from Matthew's session or the protos; a
  scratch DB is needed for automated Playwright (memory `browser-test-needs-scratch-db`).
