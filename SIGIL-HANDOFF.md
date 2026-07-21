# Sigil Hand-off — the developed seal, wired

*Read this cold and you can keep iterating the seal without re-deriving anything. Written 2026-07-21,
end of the Phase-1 opening session. Pairs with `ROADMAP.md` (the phase plan) and the design references
in `art/reference/`.*

---

## Where we are (one breath)

The **art direction is locked to Inklight** (warm earth grimoire; pixel retired). The **hero of the
app — the sigil — is designed and wired into the live `SigilGlyph`.** It now draws the developed seal
from real `SigilSpec` data, built as a **swappable parts registry** so we can keep upgrading it. Fonts
are swapped to **Fraunces + Hanken Grotesk**. All committed + pushed on `sigil-turn-foundation`
(`d95aa69`), 50/50 tests, clean typecheck. **Not yet visually verified in the running app** (see
"First thing next session").

The design was iterated as a self-contained artifact over four passes (v1→v4). Matthew's reactions
drove every turn; v4 is the version that's wired. The living preview:
`…/scratchpad/sigil-preview.html` → published artifact
`https://claude.ai/code/artifact/ba15a250-b507-4367-96e2-9b43cec9a3bb`.

---

## The seal, intimately — what every mark means

The seal is a **Witch-Hat-Atelier-style spell-glyph**: a ring that only casts when it closes, with a
readable interior spell. Anatomy, outer → inner:

- **The ornate gold frame** — static grimoire plate (double ring + cabochon nodes at the diagonals +
  filigree clasps top/bottom). Fades to 0.5 opacity when the ring is open.
- **The two braided halves** — **moss = Matthew (left), ember = Kennedy (right)**. Filled gouache
  bands; **band width = calorie weight** (`open`/`lean`/`even`/`feast`). An un-logged half is a faint
  dashed ghost. This is the thesis made physical: *one ring that can't exist in a single color.*
- **The crown** — the drop of ink that closes the ring: a **violet union gem** (resonant/legendary),
  or a **full moon** on the Quiet Moon, or a small seam-clasp on a plain closed day, or nothing when
  the ring is still open.
- **The parchment heart** — the vellum the spell is drawn on. Enlarged to r=70 (fills the ring — the
  earlier "too much negative space" fix). Tints dusk-violet on vigil/moon days.
- **The spell-circle** (the heart of it):
  - **Signs = the food halls** (`radicals`), one carved rune each, on a ring at r=42. **Never
    inflated by chords** — that was the crowding bug; halls are the signs, chords are the weave.
  - **The weave = the chords** — skip-connections whose density grows with `chords.length`, lacing
    the signs into an interlaced star.
  - **Lift ornaments** (`ornaments`, rest excluded) — carved marks seated between the runes and the
    ring.
  - **The nature-core** — the day's character: `effort` / `nourish` / `vigil` / `rest` / `star`.
  - **Carved-in-stone** — every rune + ornament is engraved: a dark cut + a lit lower lip (`carved()`).
- **The material ladder** rides the tier: `open` (waiting, gap in the ink) → `common` (ink on
  parchment) → `fine` (first gold) → `resonant` (gilt, violet union) → `legendary` (lit stained
  glass, luminous glow).

### The grammar it speaks (already computed by the engine)
- **8 halls** → 8 runes (`HALL_GLYPHS`). **7 lift families** → ornaments (`LIFT_GLYPHS`).
- **12 chords** = the alignments between the two of you (the weave). **10 legendaries** = named
  conjunctions ("when the stars align") — e.g. **Quiet Moon** (both low + a real full moon),
  **Green Cathedral** (both produce + both watered + both trained). Full catalogue in `lib/engine/sigil.ts`.

---

## The architecture (Iron-Man swappable parts)

**`components/sigil/glyphs.ts`** is the whole parts registry. Every visual element is an independent,
swappable module — change one entry to upgrade a design, and nothing else moves:

- `HALL_GLYPHS: Record<Hall, (x,y,s)=>string>` — the 8 food runes.
- `LIFT_GLYPHS: Record<SplitFamily, …>` — the 7 lift ornaments.
- `NATURE_CORES: Record<Nature, …>` — the 5 cores.
- Part builders: `ornateFrame`, `braidedRing`, `parchmentHeart`, `spellCircle`, `crown`, `goldFleck`.
- Helpers: `carved`, `starPath`, `halfBand`, `polar`, `rng`, `natureFor`.
- **`composeSeal(spec, {bloom})`** assembles the parts into SVG markup (a 240×240 canvas).

**`components/sigil/sigil-glyph.tsx`** is a thin renderer: `<svg viewBox="0 0 240 240"
dangerouslySetInnerHTML={{__html: composeSeal(spec,{bloom})}} />`. Interface unchanged
(`{spec, size, bloom}`), so all four call sites (home `DaySeal`, book calendar, seal-ceremony,
legendary-ceremony) work untouched. Deterministic + pure → SSR-safe.

**To swap art** (when Matthew hands over Recraft/hand-drawn SVG parts per `art/asset-sheets.md`):
replace the string a glyph returns in the registry. That's it. To restyle a whole layer, replace one
part builder.

### How the spec maps (and what's derived vs. latent)
`composeSeal` reads real `SigilSpec`: `moss/ember.weight`, `radicals`, `ornaments`, `chords.length`,
`tier`, `legendary`, `seed`, `completed`. Because the engine doesn't yet expose mood/moon/water on the
spec, `natureFor()` **derives** them: nature from legendary→ornaments→produce; `moon` from the
Quiet-Moon legendary; `water` from the Spring chord; `lowMood` from the vigil legendaries. When we wire
the latent signals (below), replace those derivations with real fields.

---

## First thing next session (do this before anything else)

**See it render in the real app.** We could not launch a browser this session (project rule). Run
`npm run dev` (or deploy) and open the home, the spellbook calendar, and force a completed/legendary
day. Confirm:
1. `dangerouslySetInnerHTML` on `<svg>` renders the SVG correctly under Next 16 SSR + hydration (it
   should — deterministic, standard pattern — but verify; if any issue, wrap in a `<g>` or switch to a
   `renderToString`-free JSX build).
2. The **38px book-calendar thumbnail** still reads (it's dense — may need a simplified "thumbnail"
   variant of `composeSeal` that drops the fine weave at small sizes).
3. The **carve depth** and **glyph positions when fully populated** (5–6 halls + lifts) look right at
   real size — Matthew's open tuning notes.

---

## What's next (Phase 1 continued)

**The seal itself:**
- **"Alive when logging"** — the big one, and Matthew's explicit want: the **completion ceremony that
  draws the seal on** as the day closes — ink flows, gold ignites, the runes carve themselves in, the
  union blooms, a plank sets into the boat. Spec already exists (`art/tokens.json` motion + `THE-SIGIL-TURN.md`).
  This is where it stops being a picture and becomes the thing you open daily. (SVG stroke-dash draw-on
  + CSS/JS; respect reduced-motion.)
- **Per-chord specific connections** — the last real-wiring step: bind each chord to the *specific*
  signs it aligned (Same-Table links the shared food; the Mirror draws a true reflection), instead of
  the density-by-count weave. Needs the engine to pass which halls/signs each chord relates to.
- **Bespoke legendary cores/frames** — each of the 10 legendaries gets its *own* face (right now they
  share the 5 nature-cores). One module per legendary in the registry.
- **Wire the latent signals into `SigilSpec`** so they can leave marks: **absolute time-of-day**
  (`lib/light.ts lightStateForHour` exists — a dawn/dusk/night orientation), **day-of-week** (unused),
  **long-distance** (different timezones — dead-on for the beachhead; tz plumbing exists, no chord),
  and expose **mood/moon/water** directly rather than deriving them.

**Around the seal (the rest of the art/UI pass):**
- **Home reskin** around the new hero (sigil hero + quest glimpse + demoted glade strip).
- **De-pixel the fox** → an Inklight SVG familiar (5 stages), then delete the pixel layer
  (`components/sprites.ts`, `components/pixel-sprite.tsx`, and dead `components/glade/glade-header.tsx`).
- **Type tuning** — the tiny uppercase labels are now serif (Fraunces); decide small-caps vs. moving
  micro-labels to Hanken Grotesk. Then rename the `font-pixel` utility → `font-display` (it's a
  misnomer now; ~125 spots, mechanical).
- **Library build-out** + **logging rework** (log-first, lower friction) — the daily-use polish.
- **README rewrite** (still pre-grimoire "The Logbook 🦊" — deferred creative pass).

**Later phases:** Coffers (Phase 2, `COFFERS.md` — reconcile with the three-springs in `ACT-TWO §4`);
Multi-user v1 (Phase 3, onboarding/accounts/pairing).

---

## Known tuning notes (from Matthew + my own eye)
- A few **glyph positions crowd when the seal is fully populated** — improved by decoupling signs from
  chords, but verify at size; may want angular spacing rules for 6 halls + 4 lifts.
- **Carve depth** (the `carved()` offset 0.5,1.2 + opacity 0.55) — dial to taste once seen at size.
- **Legendary glow** de-muddied (single violet halo + tight gold rim) but re-check at real size.
- The **moon crescent** on the crown is a rough path — refine.
- The `.breathe` pulse from the preview was **dropped** in the app port (no global keyframe) — it
  belongs to the "alive" animation phase, not static render.

## Key files
| File | What |
|---|---|
| `components/sigil/glyphs.ts` | **the swappable parts registry + `composeSeal`** — where all seal art lives |
| `components/sigil/sigil-glyph.tsx` | the thin renderer (interface: `{spec, size, bloom}`) |
| `lib/engine/sigil.ts` | the engine grammar — 8 halls, 7 lifts, 12 chords, 10 legendaries, tiers |
| `art/reference/hero-sigil.png` · `sigil-material-ladder.png` | Matthew's north-star references |
| `art/ART-BIBLE.md` · `art/asset-sheets.md` | Inklight canon + the asset pipeline for real art |
| scratchpad `sigil-preview.html` → artifact | the v4 living design proposal (the full grammar + key) |
