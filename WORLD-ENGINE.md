# The World Engine — how we build the Lighthouse

*Canon, decided 2026-07-22 (Matthew). The build architecture for the Lighthouse world
(`THE-LIGHTHOUSE.md`) — how all the rooms become ONE unified, alive world without rebuilding from
scratch each time. **DOM/SVG-first.** Living — iterate as we build.*

---

## The principle: engine once, rooms forever

Not "build the assets separately then populate" (they drift, they duplicate — five pretty rooms that
don't feel like one place). Not a monolith (unbuildable). The game-engine answer:

**One World Engine, built once. Rooms are content that plugs into it.** Room #1 births the engine (the
costly one); rooms #2–N inherit it and are a fraction of the cost.

## The north star: the feeling, captured

The flagship proof — **`art/proto/hearth-hall.html`** (Fable, 2026-07-22) — is the **feeling target.**
Its exact renderings will change (it has parse/structural errors to fix on the port; the two keepers
are mirrored twins needing bespoke poses; the fonts are stubbed system serifs). But **the *feeling* of
that room is the bar for every build:** warm candlelit hush, the sigil as the one living thing, lore in
every corner, quality that holds the `BRAND-BIBLE.md`.

## The engine (built once, mostly cheap code)

- **Tokens** — color / type / light (`art/tokens.json`). One source; the whole world reads it.
- **Drawing language** — the ink-line + gouache SVG primitives (stroke, wobble, deckle edge, brass
  rim, wax) as shared helpers. New art is *assembled* from these, not redrawn. (Pattern already in the
  repo: `composeSeal`, `foxSvg`.)
- **Atmosphere engine** — one Canvas particle/glow system (embers, motes, dust, flicker),
  parameterized per room. **Lifted from the hearth proto** — the proof becomes the foundation, not
  trash.
- **Lighting** — the one warm-source rule as shared glow/shadow utilities.
- **Camera + nav shell** — swipe (island) + rise (tower), view-transition-driven, hosting rooms as
  layers.
- **Room contract** — a room = { parallax layers, atmosphere config, hotspots, its own bespoke art }.
  Every room conforms.
- **Game bindings** — real data drives it: the sigil takes the real `SigilSpec`, the glade takes
  vitality, the docks take boat progress. The world reads `lib/engine/*`.

## The content pipeline (per `ART-BIBLE.md`)

- **Crisp / interactive** (the sigil, the familiar, hotspots, UI) → **SVG composers.**
- **Painterly backdrops / textures** (walls, sea, grain) → **AI-generated raster masters** (free via
  Google AI Studio / Nano Banana), embedded + composited.
- **Fable is surgical** — the bespoke hero art of a room, never the plumbing. Backdrops come from
  image-gen; the plumbing is written once.

## The camera decision (DECIDED)

**DOM/SVG-first (Path A).** A hand-rolled camera over layered DOM/SVG + Canvas, view-transition-driven
— reuses the live app + the proto, no new dependency, ships incrementally. **PixiJS/WebGL (Path B) is
held in reserve:** if the one hard move — the cast rushing up the tower to the lamp — can't hold 60fps
in DOM, we promote *just the world layer* to Pixi (free/MIT). Let the hardest moment decide the tool;
don't pre-pay complexity.

## Phone-app trajectory

The destination is a **phone app.** For now the flagship lives on the live site (the PWA) as-is. Build
**touch-first, responsive, `dvh`-safe, and reduced-motion-honest** from the start, so the world ports
cleanly. The native rewrite (`LAUNCH-PATH.md`) stays parked ($0 until couples pay); the engine is
built to be portable to it later.

## The build sequence

1. **Promote the hearth proto into the app** — extract the shared engine (atmosphere, primitives,
   camera) + land the hearth as the first *real* room, wired to real state (fixing the proto's
   parse/structural errors on the way).
2. **Lock the Room contract.**
3. **Glade, Docks, Library conform** — each authored against the engine (SVG hero art + raster
   backdrops), each cheaper than the last.
4. **The nav shell** stitches them (swipe / rise).
5. **The cast cinematic** last — the moment that may trigger the Path-B question.

## Why this fixes the cost

Room #1 was costly because it birthed the visual language + the atmosphere engine from zero in a
sandbox — a **one-time** cost, now becoming reusable foundation. Rooms #2–N inherit tokens,
atmosphere, camera, lighting, and the drawing language, and add only their own art. Fable for bespoke
art; raster masters for backdrops; polish happens on real components (cheap edits), never by
re-generating whole scenes.

## Reference

`art/proto/hearth-hall.html` (the feeling target) · `BRAND-BIBLE.md` (bedrock) · `THE-LIGHTHOUSE.md`
(the world) · `art/ART-BIBLE.md` (how it's drawn) · `art/tokens.json` (the machine palette).
