# Inklight — The Art Bible

*The single art-direction source of truth. Every asset (AI-generated, hand-authored, or animated in
Rive) obeys this. Its job is to stop "good-enough" drift — the standard solo failure mode. Consolidates
`DIRECTION.md`, `THE-SIGIL-TURN.md`, and `art/prompts.md`; the machine-readable half lives in
`art/tokens.json`. Read before generating or authoring anything.*

---

## The look in one breath

**Crisp hand-inked single-weight line over flat matte gouache washes** — a Renaissance-engraving-
influenced children's storybook, warm and nostalgic and a little eerie. Cozy-spooky twilight, never
cute-pastel, never punishing. Two layers only: clean cocoa-ink line on top, soft opaque poster-paint
fills beneath. Coarse cross-hatching only sparingly for shadow.

## The six laws (non-negotiable)

1. **Ink line + gouache wash, two layers, always.** No gradients, no gloss, no airbrush, no 3D, no
   photoreal, no cartoon-vector.
2. **One palette, ~20 swatches, three light states.** No pure white, no pure black, no gray, no pink,
   no magenta, no cool blues *in the art*.
3. **Violet is relational.** Moss/green = one keeper, ember/terracotta = the other; **violet appears
   only where they meet** (the union bloom, resonant/legendary illumination, the night sky). Never
   structural, never in day chrome.
4. **Frames are diegetic** — windows, archways, the runic ring, the book's ornate borders, the shelf
   of four books.
5. **The world states the score wordlessly.** Growth blooms; lapses hush, never rot. No red numbers,
   ever. A hushed Glade is winter, not death. Over-target draws the *thickest* ring, celebrated.
6. **Rituals are inscribed** — drawn, not tallied; child-simple gestures.

## The palette (see `tokens.json` for the machine copy)

| Role | Token | Hex |
|---|---|---|
| Base / cream | `color.base.cream` | `#fbf6ea` |
| Base / paper | `color.base.paper` | `#f5eddc` |
| Ink / cocoa | `color.ink.cocoa` | `#4a3b2a` |
| Flora / moss *(keeper A — Matthew)* | `color.flora.moss` | `#7c8a4d` |
| Flora / deep pine | `color.flora.pine` | `#5b6b3c` |
| Ember / terracotta *(keeper B — Kennedy)* | `color.ember.terracotta` | `#c4704b` |
| Ember / muted gold | `color.ember.gold` | `#d9a441` |
| Arcane / violet *(union only)* | `color.arcane.violet` | `#8d7aa8` |
| Arcane / sigil illumination | `color.arcane.illumination` | `#c9b3e3` |
| Glow / wick | `color.glow.wick` | `#f7e3ae` |

**Light states** (from the tz cookie — day/dusk/night): day ground `#f5eddc→gold`; dusk ground
`#ead8b4→terracotta`, sky-top violet `#6f5a78`; night ground umber `#2f2820`, sky violet-deep `#453a54`.

## The emblem ladder — material escalates with the tier

The seal's tier (computed in `lib/engine/sigil.ts`) changes what the seal is *made of* — rarity felt
as a change of state, not a label (law 5). This is the ELO-emblem ladder. **Five real tiers:**

| Tier | Meaning | Material | Signature |
|---|---|---|---|
| `open` | not yet both-logged | unlit parchment | two halves apart, waiting |
| `common` | both logged, 0 chords | matte parchment | the plain closed ring — still handsome |
| `fine` | 1 chord | parchment + a first spark | one chord-rune lit, a hint of gold |
| `resonant` | 2+ chords | **gilt** — gold leaf illumination | violet linework enters, several runes lit |
| `legendary` | a named legendary | **stained glass**, glowing from within | full illumination + the legendary's ornate frame |

Render **matte-first**; reserve the glass-glow and any near-photoreal richness for `legendary`, never
the default.

## Motion

Stillness is the resting state. **The completion ceremony is the one permitted break** — the app's
magic peak. Its vocabulary (timings in `tokens.json`): ink **draws itself** on → **gold leaf ignites**
along the strokes → **chord-runes light** in sequence → **violet blooms** at the union → the ring
**rotates like an orrery** → **ink-dot motes spark off** and drift → the **plank materializes** on the
bridge, drawn in the same ink. Magical, unmistakably our book.

## The seal's grammar (matches the engine exactly)

- **Two halves** — `moss` (keeper A) + `ember` (keeper B); each `inked` or not, weight `lean / even /
  feast / open`.
- **7 radicals** (food halls): protein = anchor bar · produce = leaf curl · grains = sheaf ticks ·
  dairy = crescent · sweets = spark · drinks = wave · dishes = knot.
- **5 cardinal ornaments** (training split; rest carries none): push = twin pillars · pull = hooks ·
  legs = roots · full = the square · cardio = wind spirals.
- **12 chord-runes** (cohesion made legible): lean, iron, anvil, twin-split, long-road, spring, green,
  hearth, mirror, scribe, new-mark, twin-peaks — each a small self-contained mark that ignites when
  both logs align.
- **New Mark star** — a PR's apex mark.
- **10 legendary frames** — first-page, quiet-moon, twin-foxes, twin-peaks, green-cathedral,
  long-road-home, mirror-at-dusk, still-water, ember-vigil, feast-seal (secret until first earned).

## Do / Don't

**Do:** silhouette-first (read at 64px); one soft light source; warm earth only; violet at the union;
gold as igniting leaf; matte parchment as the default material.
**Don't:** pure white/black/gray; gloss/3D/photoreal/lens-flare; violet as decoration; a "sad"/red
lapse state; anything that reads as a recognizable Studio Ghibli or Witch-Hat-Atelier design.

## IP guardrail

**Nods in spirit, never in form.** The moss-capped sprite is not a kodama; the Pale Elk is not the
Shishigami; the fox is ours. If a generation drifts recognizable, regenerate.

## Asset provenance (reproducibility)

For every AI-generated master, log a sidecar JSON: prompt, model + version, negative prompt, sampler/
steps/guidance, resolution, seed. A seed alone won't reproduce output — the sidecar is the asset's
"source." Store masters in `art/boards/`, cut assets alongside.
