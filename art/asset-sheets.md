# Signed × Sealed — Inklight Asset Generation (the pipeline + the boards)

*Generation package + tooling pipeline. Supersedes the "Matthew via ChatGPT" assumption in
`DIRECTION.md §Art production` — research 2026-07-20 found ChatGPT is the wrong spine for
consistent asset sheets. Style constants live in `art/prompts.md`; this file is the board layout +
the production pipeline. **Recommended, research-backed; pending Matthew's spine-commit on spend.***

## ⭐ Asset priority — revised for The Sigil Turn (2026-07-20)

Sigils are now the focal point of the app (see `THE-SIGIL-TURN.md`). Generate in this order:

1. **Board 5 — Sigil / Rune master** *(now #1)* — the parts library + composed seals + **chord-runes**.
2. **Board 7 — The Completion Ceremony** *(new)* — the magic moment; the app's most important animation.
3. **Board 8 — The Four Books** *(new)* — the shelf + spines + covers (diegetic navigation).
4. **Board 6 — The Glade** — where summoned beings and collected details live.
5. **Board 1 — The Fox** and **Boards 2–4 — Bestiary + Folk** *(now bonus priority)* — creatures are
   summoned by spells, not raised; still wanted, no longer the lead.

---

## Why not ChatGPT (the honest finding)

GPT Image 2 is a superb *text* renderer and a fine *drafter*, but for our job — the same being across
frames and 5 maturity stages, in a locked bespoke style that must never drift into Studio-Ghibli
forms — it has **no style-lock, no custom-style training, weak character continuity, and its flagship
can't output transparent backgrounds at all** (you'd fall back to the older `gpt-image-1.5`). Wrong
primary. The answer is a small combined pipeline, not one tool.

## The pipeline (recommended)

**Bootstrap → Lock → Produce.** The bootstrap phase is where the "cohesive board" method (proven on
Milana's India retreat) earns its keep: it's how we *manufacture the training set* the lock phase
needs — we don't have a corpus of finished Inklight art yet, so we generate one.

| Phase | Tool | What it does |
|---|---|---|
| **1 · Bootstrap** the canon set | **Google Nano Banana Pro** (Gemini 3 Pro Image) — best turnkey consistency + symbol rendering, no training. *(ChatGPT ok as a fast drafter to start.)* | Run the boards below → cut + refine → land **12–15 locked Inklight masters** that define the look. |
| **2 · Lock** the style | **Scenario** ($45/mo Pro) — train a **style model** on those 12–15 masters; optionally a **character model** per being; **merge** (multi-LoRA). | A trained style = mass-production on-style AND the strongest guard against Ghibli drift (it encodes *our* language, not a reference). Lean-start alt: Leonardo Apprentice ~$10–12. |
| **3 · Produce** everything | **Scenario** (style+char merge, native background removal, sprite-sheet assembly) + **Nano Banana Pro** for hero renders / glade plates / day-dusk-night relights that hold composition. | Beings' idle frames + arrival poses on real alpha; the 5 stages rendered identically; folk; glade scenes. |
| **Sigils (parallel)** | **Recraft** — the only true vector-native generator. **V3** for the consistent *set* (custom style + icon-set); **V4.1 Vector** for hero pieces. Clean paths with **SVGO**. | Native single-weight-stroke SVG for `SigilGlyph`. Fallback for any hand-drawn sigil: **`autotrace -centerline`** (NOT potrace/vectorizer.ai — those outline-trace into filled shapes, not strokes). |
| **In-loop** in Claude Code | Remote MCP servers (no GPU, no local plumbing — right for this Windows box). | Iterate assets from this terminal instead of hand-copying prompts. Commands at the bottom. |

**The genuinely hard part — the 5 maturity stages.** No 2026 tool one-click age-progresses a *custom*
design. Matthew art-directs the 5 stage designs so "same being, aging" reads right; the style model
then renders all five identically. Plan on design continuity being a human call; the tools enforce
*style* consistency across it. Worth a 10-min live test before paying: does Scenario's merge hold a
being's face across the 5 age designs.

---

## The board method (bootstrap phase)

**One board = one cohesive look** — same brush, palette, light across every element, guaranteed. Paint
on a flat keyable ground (not "transparent" — alpha is unreliable), then cut. **Two grounds, on
purpose:**

- **RASTER boards (beings, folk, glade props)** → flat **cool slate-teal `#26302f`**, edge to edge.
  Outside the warm palette, so even cream and violet key out clean. Alpha in Inkscape.
- **VECTOR master (sigils / runes)** → **cocoa-ink `#4a3b2a` line only, no fills, on flat cream
  `#fbf6ea`**. High-contrast ink-on-pale is what centerline-trace / Recraft want. The opposite ground,
  and that's correct.

**Every board: NO text, labels, numbers, captions, frames, cards, or drop-shadows.**

### STYLE BLOCK — paste at the top of every board

> Style: **"Inklight"** — crisp hand-inked single-weight line art over flat matte gouache washes,
> like a Renaissance-engraving-influenced children's storybook. Two layers only: clean even-weight
> cocoa-ink linework on top, soft opaque poster-paint fills beneath. Coarse cross-hatching only
> sparingly for shadow — never dense stipple. No gradients, no gloss, no airbrush, no 3D, no
> photoreal, no cartoon-vector. Warm, nostalgic, slightly eerie — cozy-spooky twilight storybook,
> never cute-pastel. Every element silhouette-first (must read at 64px), one soft light source.
>
> Palette (strict, warm earth): cream `#fbf6ea`, paper `#f5eddc`, cocoa ink `#4a3b2a`,
> moss `#7c8a4d`, deep pine `#5b6b3c`, terracotta `#c4704b`, muted gold `#d9a441`,
> arcane violet `#8d7aa8` — violet is for **spirit / union accents ONLY**, never structural.
> No pure white, no pure black, no gray, no pink, no magenta, no cool blues in the art itself.
>
> Relational color law: green/moss reads as one keeper, ember/terracotta as the other, violet only
> where they meet.

**IP guardrail (paste too):** *Nods in spirit, never in form. A moss-capped sprite is not a kodama;
the pale elk is not the Shishigami; the fox is ours. If a render drifts toward a recognizable
Ghibli / Witch-Hat-Atelier design, regenerate.*

---

## BOARD 1 — The Fox (founding spirit, 5-stage antler arc) · slate ground

The hero. Five stages left→right, **the same fox identity throughout** — small arctic fox spirit,
front-facing, sitting; cream body, warm shadow snout, terracotta inner ears and blush; calm, knowing,
slightly otherworldly, a young forest god revealing itself, never cutesy — it should feel like it
knows you.

1. **Kit** — no antlers. Smallest, softest, big dark eyes.
2. **Yearling** — tiny gold-tipped antler nubs.
3. **Young** — branching tines beginning.
4. **Adult** — tree-like antlers with moss and small buds.
5. **Elder** — full bare-branch antlers with moss, tiny blooms, faint violet glow between the tines.

Second row for the sprite sheet: the **Adult** in **3 idle frames** (ear-flick, slow blink,
tail-settle) + **1 arrival pose** (looking up, just-noticed-you). Same character, same scale.

## BOARD 2 — Bestiary I (first + second wave) · slate ground

Naturalist's specimen plate, each isolated, one signature idle each. Doubles as compendium art.
1. **Stag** — side profile, tree line. Lean, deep pine + cocoa coat, oak-branch antlers with gold
   leaf-buds, one violet bloom. Dignified, watchful, a little stern.
2. **Heron** — one-legged in a dark pool, cream + ink feathers, gold eye, long ink legs, faint violet
   ripple. Patient, precise.
3. **Tortoise** — low, ancient, a small **shell-garden** (moss + blooms) on its back. Benevolent.
4. **Moth** — wings spread, night-moth, soft ink patterning, **wing-dust glints violet**. The first
   spooky-soft being.
5. **Crow** — lantern-eyed watcher, perched, half-shadowed. Cocoa (not pure-black) plumage, one gold
   catchlight eye. October's native.

## BOARD 3 — Bestiary II (deep wood + mythic) · slate ground

1. **Hare** — meadow, mid-motion (dawn zoomies), long ink ears, warm cream coat.
2. **Salamander** — curled in an implied firepit, terracotta-and-gold with ember speckles. The
   anti-guilt being — abundance honored.
3. **Owl** — perched at a book-stand, head turned to watch, big round gold eyes, barred cocoa/cream.
   The night reader.
4. **Koi** — from above in dark water, cream-and-terracotta, **violet-flecked**; a luck omen.
5. **Pale Elk** (mythic, secret) — moon-pale coat, tall moss-hung antlers, half-turned as if leaving;
   faint violet aura, footprints that bloom and fade. Reverent, fleeting, our own — never Shishigami.

*(If Boards 2–3 come back mushy, split each 3 + 2, same header. Beings reward 2–3 per board.)*

## BOARD 4 — The Small Folk · slate ground

Silhouette-first, one flat color + ink outline each, **2 frames each** (rest + signature motion).
1–2. **Wick** — candle-flame wisp, glow `#f7e3ae`. upright → flicker-tilt. (night)
3–4. **Mossling** — moss-capped pebble sprite. level → slow head-tilt. (day)
5–6. **Inkling** — ink-drop body, paper wings. settled → page-hop. (by the book)
7–8. **Dewdrop** — water bead, sleepy eye. still → ripple-blink. (dawn/dusk pool)
9–10. **Emberling** — hearth spark, stubby arms. crouched → pop-drift. (feast days)

## BOARD 5 — Sigil / Rune specimen master · CREAM ground, INK LINE ONLY (vector)

Cocoa-ink `#4a3b2a` single-weight strokes on flat cream `#fbf6ea`. **No fills, no color, no shading.**
Each mark isolated for tracing. This is the `SigilGlyph` parts library.
- **Ring halves** — left + right half of a circular seal, each at **thin (deficit) · medium
  (maintenance) · bold (feast)** weight. All three handsome; none looks broken.
- **7 radicals** — anchor bar (protein) · leaf curl (produce) · sheaf ticks (grains) · crescent
  (dairy) · spark (sweets) · wave (drinks) · knot (dishes).
- **6 cardinal ornaments** — twin pillars (push) · hooks (pull) · roots (legs) · square (full) · wind
  spirals (cardio) · still horizon (rest).
- **4 tier cores** — dot (common) · diamond (fine) · cross-ring (resonant) · illuminated double ring
  (legendary). Plus the **New Mark star**.
- **Chord-runes** *(new — the cohesion marks)* — one distinct rune per chord that seats inside the
  seal when both logs align: **Lean** (a paired downward chevron) · **Iron** (an anvil/bar glyph) ·
  **Anvil/Twin Split** (crossed tools) · **Long Road** (a running double-line) · **Spring** (a
  water-drop trine) · **Green** (a twin-leaf) · **Hearth** (a hearth-arch) · **Mirror** (a mirrored
  pair) · **Scribe's** (a quill tick) · **New Mark** (the star). Each is a small, self-contained,
  single-weight mark. More chords struck → more runes ignite in the seal.
- **3–4 example composed seals** — common → fine → resonant → one legendary frame, **with chord-runes
  seated in** — to prove the grammar assembles and reads as "a portrait of the day the two of you
  made." *(All 10 legendary frames get their own ink-line board later.)*

If generating in **Recraft**: prompt each part as "single continuous line, uniform 2px stroke, one
color, transparent background," V3 for the set. Else trace the ink master with `autotrace -centerline`.

## BOARD 6 — The Glade (lighting + world detail)

**6a — Three light states** (three full-scene renders, **identical composition** so they swap): a
clearing with a crook'd lantern post, small firepit, book-stand on a moss bank, big simple tree
shapes, distant pines, sparse grass. Oga rule — large to small, restraint everywhere.
- **Day** — paper ground warming to gold, open and calm.
- **Dusk** — amber → terracotta, violet at the sky-top `#6f5a78`, lantern just catching.
- **Night** — umber → violet-deep sky `#453a54`, the lantern pool the main light, wicks lit.

Generate day first, then **relight to dusk/night with Nano Banana Pro / Kontext** to hold composition.
Layer separation (wash / silhouette / detail for parallax) isn't reliable from a text prompt —
decompose after with **Qwen-Image-Layered** (RGBA layers, on fal.ai) or hand-split in Photoshop.

**6b — Glade props board** (slate ground, isolated): crook'd lantern post · firepit with low flame ·
the book-stand (open arcane book on a carved crook) · warm-capped mushroom cluster · mossy standing
stone · fallen log · grass tufts · a small pool with a lily pad (appears once the Heron arrives).

## BOARD 7 — The Completion Ceremony (the magic moment) · slate ground

*The app's most important animation — an illuminated manuscript coming alive, the sling-ring feeling
in our idiom. Never literal Marvel VFX.* Generate as a **frame sequence** (a filmstrip on the board,
left→right) of a single seal casting, so we can time it in code:

1. **Two halves apart** — moss half and ember half, unlit, waiting.
2. **The draw** — ink lines drawing themselves onto the ring, mid-stroke.
3. **Ignition** — gold leaf catching along the completed strokes; chord-runes lighting one by one.
4. **The union** — violet blooming at the point where the two halves meet; the ring at full
   illumination, rotating (show a slight rotation vs. frame 3).
5. **The spark-off** — ink-dot motes flying outward and drifting (our particles — sparks, not flare).
6. **The plank** — a single bridge plank materializing, drawn in the same ink, the seal's light
   settling onto it.

Also paint, isolated: a small library of **spark/mote shapes** (ink-dot bursts, gold flecks, a violet
bloom) and **2–3 rotation frames of the full ring** for the orrery spin. Warm, reverent, alive.

## BOARD 8 — The Four Books (diegetic navigation) · slate ground

The shelf and its books — tap a spine to open. Paint, isolated and spaced:
1. **The shelf** — a warm carved wooden shelf holding four books, closed, spines out.
2–5. Each book **closed (spine + cover)** and **open (first spread)**, in its own character:
   - **The Scrapbook** — worn cloth cover, a pressed leaf, a ribbon marker; homely, human.
   - **The Spellbook** — dark arcane grimoire, gilt-and-violet sigil embossed on the cover; the heart.
   - **The Compendium** — a naturalist's field book, brass corners, a specimen pinned to the cover.
   - **The Almanac** — a plain ledger, an engraved rule and a small sun/moon dial on the cover.
6. A **page-flip pose** (a book mid-turn, one page lifting) for the quick open animation.

Each book distinct at a glance by silhouette, cover color, and ornament — but one family, one hand.

---

## After generation

1. Save boards to `art/boards/`.
2. **Raster:** Inkscape → key/trace out slate `#26302f` to alpha, feather soft edges (~1 min/asset),
   export each element to transparent PNG. Assemble being idle frames into 2x/3x sprite sheets on the
   `steps()` cadence; swap the hand-authored SVG in `components/glade/` one-for-one.
3. **Sigils:** Recraft SVG (or `autotrace -centerline` the ink master) → SVGO → match existing
   `SigilGlyph` part shapes one-for-one so the code swap is invisible.
4. **Glade:** drop in per light-state; props keyed to alpha for optional parallax.

## In-loop MCP (remote, no GPU — wire when we commit)

```
# generate/iterate any model (FLUX, Recraft, Nano Banana, SD3…) from this terminal
claude mcp add --transport http fal-ai https://mcp.fal.ai/mcp --header "Authorization: Bearer YOUR_FAL_KEY"
# vector/SVG gen + vectorize + background removal (the sigil server)
claude mcp add --transport http recraft https://mcp.recraft.ai/mcp
# Google Nano Banana in-loop (community, maintained) — free Gemini key from AI Studio; forward-slash paths
claude mcp add mcp-image --env GEMINI_API_KEY=YOUR_KEY --env IMAGE_OUTPUT_DIR=C:/Users/Matthew/All\ Projects/the-logbook/art/boards -- npx -y mcp-image
```

## Rough cost

Full stack ≈ **$60–80/mo** (Scenario Pro $45 + Recraft $10–27 + a few $ of fal/Gemini API).
Lean start ≈ **$20–25/mo** (Leonardo Apprentice $10–12 + Recraft $10 + pay-as-you-go Nano Banana)
until the app ships and earns.

*Verify before paying: (1) Scenario merge holding a being's face across the 5 age designs; (2) whether
current Recraft V4.x re-added style/set features (V4 base didn't — V3 is the safe path for the set).*
