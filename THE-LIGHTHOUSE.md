# The Lighthouse — the world canon

*Canon, decided 2026-07-22 (Matthew). The app is no longer a set of screens reached through a
ribbon — it is **one place you inhabit**: a lighthouse on an island. This doc is the world bible;
everything spatial, cinematic, and navigational answers to it. It **evolves** `THE-SIGIL-TURN.md`
(the sigil is still the spell — it now has a home and a sky) and **supersedes** the "Glade-as-home"
and "four-books-shelf-as-home" framings in `DIRECTION.md` / `art/ART-BIBLE.md`. Living — iterate as
we see it in-app.*

---

## What's built vs. canon-only (2026-07-23)

This doc is the *whole* vision; the world shipped as **World Engine 1–9/n** is its skeleton. What's real
in-app today:

- **Built:** `/` renders the world; the mandatory **cold-open gate** (whole world → *begin* → push-in to the
  hearth); all five rooms (hearth · garden · docks · library · lantern) real and **swipe/rise**-navigable; the
  day **logged at the hearth**; the **lamp lit by the live spell**; the four completion ceremonies; the
  library's five books + reached-shores mantel; the docks vessel + far shore; the Garden's living glade
  (the old home's glade, relocated).
- **Canon-only / still-pending (updated 2026-07-24):** the **painterly hero masters** — the four island
  rooms (Library · Lantern · Docks · Garden) since shipped **ornate procedural-SVG hero art** (Fable proto
  → hand port, World Engine 12–14), so the *ornate* bar is met; what's still canon-only is the
  hand-painted/raster master pass **beyond** procedural SVG (the hearth is still v1 against
  `hearth-hall.html`). The **in-world book/vessel interiors** are **cut back to the real pages**
  (2026-07-24, the atoms audit): the v1 title-page overlay was a stub nobody read that added a tap on
  the way to the actual book, so a room hotspot now opens `/book`, `/library#…`, `/trends`, `/shore`
  directly. The "interior opens in place" pattern returns when a **deep, rereadable** spread exists to
  put in it (frozen until a paying couple says the world is why they stay). Also pending: the full
  **cast cinematic** (the two keepers rising to the lamp, beam sweeping the shore); the **archipelago**
  (private islands, shared heavens); a world-wide **day/night cycle** (only the Garden rides the
  light-script now).

Everything below is the target; iterate the built world toward it.

## The world in one breath

**You and your keeper live in a lighthouse on an island, under a shared sky. You keep the light.**
Each day you both log, the day's **sigil** composes on the mantle; when it completes, the light
rises up the tower and the **lamp** throws its beam across dark water toward the **far shore** — the
Dream you are sailing toward, plank by plank. The garden grows to one side; the docks and the vessel
wait on the other. One place, three faces, one light only two people can keep.

## Why a lighthouse (the machine, not the costume)

You are **Keepers** — and a lighthouse keeper's entire purpose is to *keep a light that guides a
vessel across dark water to a far shore.* That is this app stated in one object. The metaphor stops
being decoration and becomes the mechanism:

- **It is the two-player rule made physical.** The lamp is lit by the completed seal; the seal cannot
  complete alone. Keepers keep the light *together* or the night stays dark — never a scold, just a
  quiet night (design law: the world states the score wordlessly).
- **It reconciles both axes.** A lighthouse is the one structure that is honestly *both* a tower you
  climb **and** an island you cross.
- **It models the maker's own life** — a vessel built plank by plank toward a shore you can barely
  see (Foy's Lake → debt cleared → Japan + art). We can build it honest because we live it. The
  magic must always sit on **true things** — a real body, a real day, an honest number under the
  gilt. Poetic, never precious. The moment the ornament floats free of the data, it's a costume.

## The architecture — two axes, one place

**Horizontal (the island) — swipe.** The everyday. Turn your head across your world.

```
     GARDEN  ←——  HEARTH HALL  ——→  DOCKS · the SEA · the far SHORE (on the horizon)
     (the Glade)   (home / cast)      (the vessel, the Dream drawing nearer)
```

**Vertical (the tower) — rise.** A climb through meaning; also the path the cast takes.

```
        THE LAMP  (the light / the beam — the cast sigil made manifest)
            ↑
        THE LIBRARY  (the Compendium — your kept self, the five books)
            ↑
        THE HEARTH HALL  (where you land — the mantle, the act)
```

Two clean gestures: **swipe** to cross the island, **rise** to climb the tower. Both physical, both
predictable. The primary daily loop needs *zero navigation* — you land at the hearth and the day is
already there, waiting.

## The rooms

**The Hearth Hall — home, and where the spell is cast.** You land here. At its center, a **mantle**
with the **Spellbook splayed open**; the two keepers stand as **chosen sprites** flanking it (each
user elects their own); and the day's **sigil emanates from the open book** — turning slowly,
pulsating, *unfinished* — awaiting both of you. It is an altar to the possible. Home is the hearth
because *today* is what needs you.

**The Library — up the spiral stair — the Compendium.** Your kept self. Everything you've inscribed,
witnessed, illuminated. You *climb* to your history; it is a sanctum, not a lobby. It holds the five
books (below). The old **"museum" framing is retired** — a static cabinet of specimens made *food*
the star; the Library's heart is the **record of the practice**: history witnessed, growth
inspired.

**The Lamp — the top — the light.** When the seal completes, the light rises here and the beam
sweeps out over the water toward the far shore. Keepers keep it lit.

**The Garden — west — the Glade.** The living present: the familiar roams, beings visit, the season
and the moon turn, vitality blooms or hushes. (This is the existing Glade, kept whole, now a wing
rather than the whole house — it loses nothing.)

**The Docks — east — the sea and the Dream.** The vessel builds plank by plank; the **far shore
sits small and gold on the horizon**, drawn a little closer with every both-logged day. Depth
matters here — the shore is *far*, and nearing it is progress you can see across distance. *This
room will link to real money in the future* (`COFFERS.md` — the couple-owned trip fund), so it is
built to hold that weight honestly.

## Each room is its own world — dwellable interiors + the thread between them

*Canon direction, 2026-07-23 (Matthew): "I want these rooms and pages to feel like their own
individual worlds, all interconnected." This is the build principle for the next arc.*

**A room is a place you dwell in, not a tableau you pass.** Today most rooms are a single
establishing view with one hotspot that **routes OUT** to a legacy page (`/book`, `/shore`, …) —
which breaks the spell and drops you back at the hearth on close. The build turns each room into its
own small world you can **enter and stay in**:

- **Two depths per room — establishing ↔ interior.** The **establishing view** is the room as you
  arrive (the shelves, the sea, the glade). Tapping a hotspot opens an **interior spread IN the
  world** — an overlay that belongs to that room, not a route change — and closing it returns you to
  *that room*, where you were standing. The Book of Days opens as a real turnable spread on the
  lectern; the vessel opens the shore you're sailing to; a being opens its lore. No page reload, no
  re-climb. (The legacy `/book`, `/trends`, `/shore`, `/library` pages become these interiors, or
  retire.)
- **Each world keeps its own time & air.** The Garden rides the *real* clock (morning/dusk/night);
  the interiors keep a timeless candlelit night; the Docks is always a starlit sea; the Lantern is
  the one that flares. Distinct atmospheres are what make five rooms feel like five *places*.

**What keeps them ONE world (the connective tissue) — the thread is the light and the data:**

1. **One shared sky.** The same night and stars arc over the whole island; the overview shows them
   all at once. Private islands, shared heavens (the archipelago).
2. **The travelling light.** The seal you compose at the **hearth** is the *single flame*: it rises
   the tower to light the **lantern**, whose **beam** reaches the **docks'** far shore. One act,
   seen from every room.
3. **The rippling day.** Every both-logged day is the **same fact wearing five faces** — it inks a
   page in the **library**, grows the **garden**, lays a plank at the **docks**, may summon a
   **being**, and lights the **lamp**. No room is an island of its own data; each is a different
   *view* of the couple's lived days. That causal web is why crossing rooms feels like moving through
   one life, not flipping tabs.

**Build order (each room raised to "its own world," hero-art via Fable, ported by hand):**
1. **Library / Compendium** — the flagship interior: the five books, and the **Book of Days opening
   as an in-world spread** (this establishes the reusable spread/interior pattern the other books
   reuse). *(Fable proto in flight, 2026-07-23 → `art/proto/library-compendium.html`.)*
2. **Docks** — the vessel opens the **shore interior** (look out across the depth, the Dream drawn
   near; coffers-linked later).
3. **Garden** — deepen the living glade as a dwellable present (beings' lore, the familiar).
4. **Hearth & Lantern** — the cast cinematic (the two keepers rise to the lamp; the beam sweeps the
   shore) ties the thread together.

Discipline unchanged: game-*feel* not scope; the current web stack; the spectacle stays *earned*;
every ornament sits on a **true** number.

## The five books (the Compendium, up the stairs)

Each a bound volume you pull down and open. **The inspiration engine:** every book shows the *whole*
of what's possible, but unlived pages sit in **silver ghost-outline**, waiting — your consistency is
what inks them to gold. You aren't nagged toward growth; you're *lured* by a beautiful half-empty
book.

| Book | Holds | The feeling |
|---|---|---|
| **The Book of Days** *(the Spellbook)* | every sealed day as a spread — its sigil, both logs facing; **voice notes pressed into the margins** as a wax seal you tap to hear | the beating heart — the rereadable shared memory |
| **The Legendarium** | legendary sigils — struck ones illuminated, the rest silver, waiting | aspiration you can *see* |
| **The Bestiary** | the beings + the familiar — who came, when, their lore | the living company of the Glade |
| **The Apothecary** *(was the museum)* | provisions catalogued — the fuel of the work (still the shared food-DB underneath) | materia, not specimens |
| **The Almanac** | the long arc — seasons, moons, the trend of two people showing up | where growth over time is witnessed |

## The cinematics — the camera *is* the feeling

**The cold open (onboarding).** Start pulled all the way **out**: the island small in a wide sea,
the lighthouse on it, the far shore a speck of gold on the horizon, all under a sky of stars. Held a
beat — *here is your world.* On "begin," the camera pushes **in and down** — toward the tower,
through a warm-lit window, settling at the hearth. The world becomes home in one unbroken move. (Keep
this wide as a gesture: **pinch out any time** to pull back and see how far the shore still is.)

**The daily cast.** Both keepers have logged; the sigil on the mantle closes. It releases *up* — the
camera **shoots up the tower**, fast and accelerating, blur-passing the Library level (your whole
history rushing beneath the rising spell), the light building — and breaks into the **lamp room**,
where it ignites and the beam sweeps out over the water. One held heartbeat: **the far shore, lit by
your light.** Then the camera **descends, ceremoniously** — slow, settling, warm — back to the
hearth; the Spellbook turns its page, the day is bound, the room glows a shade deeper.

The whole feeling is the **pacing contrast**: fast up (the release), slow down (the ceremony). Up
like a firework, down like a held breath. This is the evolution of the completion ceremony in
`THE-SIGIL-TURN.md` — same ink-drawing/gold-igniting/violet-at-union vocabulary, now given a vertical
camera and a beam.

## The archipelago — private islands, shared heavens

The resolution to "a library anyone can tap into": every bond is **their own lighthouse on their own
island** — private, intimate, two-player, the way it must be. But all keepers stand under the **same
sky** — the same constellations of legendaries not yet struck, the same sea, the same far stars to
steer by. The **shared canon** (all possible foods, beings, legendaries) is the heavens; your lived
pages are your island's own illumination. Everyone taps into one world; no one reads your diary.

**The lamp makes this archipelago *inhabited* → `THE-BEACON.md` (canon, 2026-07-24).** From the lamp
you can aim your beam across the water to a neighbor bond's island and send them light (encouragement
now — a being to their glade, only on days you kept your own; a money pledge toward their Dream,
later). You send warmth, never entry: still private islands, shared heavens. This is the Lantern's
future verb and the social organ of the app — catalogued now, built later.

## Nothing is thrown away — how it maps to what exists

- **The sigil** (`lib/engine/sigil.ts`, `components/sigil/*`) — unchanged as the engine; it now
  *lives* on the mantle and *becomes* the beam.
- **The boat / planks / Dream** (`lib/engine/boat.ts`, `components/shore/*`, `components/glade/vessel.tsx`)
  — this is the Docks room, nearly as-is; the far shore gains its horizon depth.
- **The Glade** (`components/glade/*`, vitality engine) — this is the Garden, kept whole.
- **The collections** (`/book`, `/library`, `/trends`, beings, pantry) — these become the five books
  in the Library room.
- **Voice notes** (shipped 2026-07-22) — pressed into the margins of the Book of Days.

This build is far more **re-composition than from-scratch** — existing rooms hung on a new spatial
spine, with the atmosphere unified.

## The three discipline lines (so "a real game" doesn't sink us)

Game-**feel** is the moat: the instant this becomes *a place you keep*, an incumbent can't retrofit
it. But three lines are non-negotiable — Matthew is solo, on a $0-until-users budget, live now:

1. **Game-*feel*, not game-*scope*.** The cinematics wrap the *payoff*, never the *input*. You log
   first — voice, ten seconds — and *then* the world rewards you. The camera is never a toll paid
   before logging.
2. **Ships on the current web stack.** The lighthouse, the parallax island, the up-and-down cast —
   all achievable with layered 2D depth (SVG/canvas), tasteful transforms, and the view-transitions
   already in the app. This does **NOT** un-park the native Expo/Convex/Rive rewrite (`LAUNCH-PATH.md`),
   which stays parked until couples pay. If we start reaching for the native rewrite to pull this
   off, stop and flag it.
3. **The spectacle stays earned.** The camera rises to the lamp *because two real people logged two
   real days.* Fireworks on anything less than honest input is a slot machine, not alchemy.

## Art & build approach

Graphics are authored the way the sigils were — **procedural, ornate SVG/canvas composers** (see
`components/sigil/glyphs.ts`, `components/familiar/familiar-glyph.tsx`), swappable for hand-drawn
masters. Development runs through **Fable-model subagents** for the ornate scene/asset work at
sigil-level quality, followed by **polish passes**. Everything obeys `art/ART-BIBLE.md` — Inklight:
crisp ink line over matte gouache, warm earth only, violet at the union, the world wordless. The
lighthouse, the island, and the sea are new subjects for that same brush.

## Still open (Matthew's calls)

- **Names** — the structure ("the Lighthouse" / "the Keep" for the couple's shared holding), the
  island, the light itself. (Keepers keep the Light.)
- **Landing** — decided: land *inside* the hearth; the island reveals as you swipe.
- **The beam** — decided: fires automatically on the completed seal (witnessed from below), with the
  option to climb to the lamp for the full ritual.
- **Book titles** — five above are proposals; land your own.
- **Seal location** — decided: the mantle in the hearth (the cast rises to the lamp).
