# Inklight — Art Prompt Library

*For Matthew's master-generation sessions (ChatGPT + human art direction). Every asset obeys the style constants; per-asset prompts below are starting points to iterate from. Engine runs on placeholder geometry until masters drop in — no asset blocks code.*

## Style constants (paste into every prompt)

> Style: "Inklight" — crisp hand-inked line art over flat matte gouache washes, like a Renaissance-engraving-influenced children's storybook. Two layers only: clean single-weight ink linework on top, soft opaque poster-paint fills beneath. Coarse cross-hatching allowed sparingly for shadow, never dense stipple. No gradients, no gloss, no airbrush. Palette locked to: cream #fbf6ea, paper #f5eddc, cocoa ink #4a3b2a, moss #7c8a4d, deep pine #5b6b3c, terracotta #c4704b, muted gold #d9a441, violet #8d7aa8 (only for spirit/arcane accents). No pure white, no pure black, no gray. Warm, nostalgic, slightly eerie — cozy-spooky twilight storybook, not cute-pastel.

**Output rules:** transparent background · flat colors, hard edges · silhouette must read at 64px · one light source, soft.

## Formats the engine needs

| Asset | Format | Why |
|---|---|---|
| Sigil parts | **clean SVG** (single-weight strokes, no fills needed) | composed procedurally by `SigilGlyph` |
| Beings | transparent PNG sprite sheet, 2–4 idle frames + 1 arrival pose, at 2x/3x | replaces string-map sprites, keeps `steps()` snap |
| Small folk | transparent PNG, 2 frames each | ambient population |
| Glade plates | layered PNGs (wash ground / silhouette band / detail sprites separately) | Oga large-to-small z-layers, per light state |

## The Fox (5 stages — replaces current pixel sprites)

> A small arctic fox spirit, front-facing, sitting. Stage {1 kit / 2 yearling / 3 young / 4 adult / 5 elder}. From stage 2 it grows antlers: tiny gold-tipped nubs → branching tines → tree-like antlers with moss and small buds → elder: full bare-branch antlers with moss, tiny blooms, and a faint violet glow between the tines. Cream body, warm shadow snout, terracotta inner ears and blush. Calm, knowing, slightly otherworldly — a young forest god revealing itself, never cutesy. It should feel like it knows you.

## The Stag (first wave · called by iron)

> A stag spirit at the tree line, side profile, standing still. Lean and strong, deep pine and cocoa coat, antlers like young oak branches with gold leaf-buds. Trust stages: (1) distant and half-shadowed, (2) closer with moss on the antlers, (3) antlers leafed out, one violet bloom. Dignified, watchful, a little stern — the spirit of discipline kept.

## The Heron (first wave · called by water)

> A heron spirit, one-legged in a small dark pool, night-capable. Cream and ink feathers, gold eye, long ink legs. Trust stages: (1) newly arrived, wings tucked, (2) reflection visible in the pool, (3) faint violet ripples around its leg. Patient, still, precise — the pool exists because it came.

## The small folk (2 frames each)

> Tiny spirit, silhouette-first, one flat color plus ink outline, one signature motion between two frames:
> - **Wick**: candle-flame wisp, glow #f7e3ae, flicker-tilt. Night.
> - **Mossling**: pebble-sized sprite with a moss cap, slow head-tilt. Day.
> - **Inkling**: ink-drop body, paper wings, page-hop. Near the book.
> - **Dewdrop**: bead of water with a sleepy eye, ripple-blink. Dawn/dusk pool.
> - **Emberling**: hearth spark with stubby arms, pop-drift. Feast days.

## Glade plates (per light state: day / dusk / night)

> A forest clearing background in three separable layers: (1) WASH — one dominant soft-edged gouache ground tone {day: paper #f5eddc→gold, dusk: amber #ead8b4→terracotta with violet #6f5a78 sky-top, night: umber #2f2820→violet-deep #453a54 sky}; (2) SILHOUETTE — big simple tree shapes, moss bank, distant pines, no detail; (3) DETAIL — lantern on a crook'd post, small firepit, book-stand, sparse grass tufts. Detail is sparse and foregrounded — the Oga rule: large to small, restraint everywhere.

## Sigil parts (SVG, later — placeholder geometry works)

Ring halves ×3 weights · 7 radicals (anchor bar, leaf curl, sheaf ticks, crescent, spark, wave, knot) · 6 cardinal ornaments (pillars, hooks, roots, square, spiral, horizon) · tier cores (dot, diamond, cross-ring, illuminated double ring) · New Mark star · 10 legendary frames. Match the current `SigilGlyph` shapes one-for-one so the swap is invisible to code.

## IP guardrails

Nods in spirit, never in form: the Mossling is not a kodama, the Pale Elk is not the Shishigami, the fox is ours. If a generation drifts toward a recognizable Ghibli/WHA design, regenerate.
