# The Seal — Rive Authoring Blueprint

*Build the seal + completion ceremony in the Rive editor to this spec, so the seal composes
procedurally, the ceremony is state-driven, and the Expo/RN app drives it all through data binding
with zero glue. The data contract mirrors `SigilSpec` in `lib/engine/sigil.ts` exactly — the pure
engine computes the spec, the Rive view model renders it. Governing look: `ART-BIBLE.md`. Tokens:
`tokens.json`.*

---

## The architecture in one line

`lib/engine/sigil.ts` → `composeSigil()` → **`SigilSpec`** → bound to the Rive **view model** →
Rive renders the seal + plays the ceremony → fires events back to the app (plank, haptics, sound).

The engine is pure TS and ports into the Expo/Convex codebase ~1:1. The Rive file is the *only* new
authored artifact. Keep every name below **verbatim** — it's the API between art and code.

## The data contract — view model = `SigilSpec`

Author one **view model** (`SealVM`) whose properties mirror the engine type. Data binding drives them.

| VM property | Type (Rive) | From `SigilSpec` | Drives |
|---|---|---|---|
| `completed` | boolean | `completed` | open vs. sealed |
| `tier` | enum `open,common,fine,resonant,legendary` | `tier` | **master driver** of material + core |
| `mossInked` | boolean | `moss.inked` | left half visible |
| `mossWeight` | enum `open,lean,even,feast` | `moss.weight` | left ring stroke weight |
| `emberInked` | boolean | `ember.inked` | right half visible |
| `emberWeight` | enum `open,lean,even,feast` | `ember.weight` | right ring stroke weight |
| `radical_{hall}` ×7 | boolean | `radicals[]` includes hall | each radical's visibility |
| `ornament_{family}` ×5 | boolean | `ornaments[]` includes family | each cardinal ornament |
| `chord_{id}` ×12 | boolean | `chords[]` includes id | each chord-rune's visibility + glow |
| `newMark` | boolean | `newMark` | the New Mark star |
| `legendary` | enum `none` + 10 ids | `legendary` | which legendary frame |
| `seed` | number | `seed` | micro-variation (slight rotation/jitter of ornaments) |
| `keeperAColor` | color | *(binding)* | left half tint — default `#7c8a4d`, never hardcode |
| `keeperBColor` | color | *(binding)* | right half tint — default `#c4704b` |

Enum values and ids are the **engine's literal strings** — don't rename:
- tiers: `open, common, fine, resonant, legendary`
- weights: `open, lean, even, feast`
- halls (radicals): `protein, produce, grains, dairy, sweets, drinks, dishes` *(confirm exact ids in `lib/halls.ts` when wiring)*
- split families (ornaments): `push, pull, legs, full, cardio` *(rest carries no ornament)*
- chords: `lean, iron, anvil, twin-split, long-road, spring, green, hearth, mirror, scribe, new-mark, twin-peaks`
- legendaries: `first-page, quiet-moon, twin-foxes, twin-peaks, green-cathedral, long-road-home, mirror-at-dusk, still-water, ember-vigil, feast-seal`

## Artboards & layers (semantic names — retain on export)

Enable "retain IDs/names on export" so the runtime targets these directly.

- **`Seal`** — the main artboard.
  - `ring/half-moss`, `ring/half-ember` — each with the 4 weight states (`open/lean/even/feast`) as nested states or a blend input.
  - `radical/{protein,produce,grains,dairy,sweets,drinks,dishes}` — 7, seated around the ring.
  - `ornament/{push,pull,legs,full,cardio}` — 5, at the compass points.
  - `chord/{...12 ids...}` — 12 chord-runes, each a small self-contained mark with an unlit + lit state.
  - `mark/new-mark-star` — the PR apex mark.
  - `core/{open,common,fine,resonant,legendary}` — the center mark per tier.
  - `legendary/{...10 ids...}` — ornate frame per legendary; hidden unless `legendary != none`.
  - `material/{parchment,gilt,glass}` — overlays driven by `tier` (parchment ≤fine, gilt = resonant, glass = legendary).
  - `union-bloom` — the violet light where the halves meet; visible only when `completed`.
  - `fx/spark-emitter` — the Luau particle source (below).

## State machine — `SealMachine`

- **Inputs:** `cast` (trigger), `tier` (enum, above), plus the VM bindings.
- **States:**
  - `Idle` — renders the current `tier` statically (for the Spellbook/Compendium, no motion).
  - `Cast` — one-shot ceremony, entered on `cast`. Timeline (durations from `tokens.json`):
    1. `draw-on` (1200ms) — ink draws the halves + ring onto the parchment.
    2. `ignite` (600ms) — gold leaf catches along the strokes.
    3. `runes-cascade` (900ms) — visible chord-runes light one by one.
    4. `union-bloom` (800ms) — violet blooms at the union *(only if `completed`)*.
    5. `orrery` (4000ms, overlapping) — the ring rotates slowly.
    6. `spark` (1000ms) — the emitter fires ink-dot motes outward.
    7. `plank` (700ms) — fire the `onPlank` event; the app animates the bridge plank.
  - Material escalates by swapping `material/*` overlay + `core/*` by `tier` at settle.
- **Events out (for the app to catch):** `onCeremonyEnd`, `onPlank`. The app wires these to the
  bridge-plank animation, haptics, and the low warm legendary tone.

## Particles & the legendary glass (the two research-flagged spots)

- **Particles** — a **Luau script** on `fx/spark-emitter`: spawn N ink-dot motes on `cast`, drift +
  fade, recycle. Very AI-assistable. **Cap density** and prove it on hardware (below).
- **Legendary stained glass** — the `material/glass` overlay. If Rive **GPU Canvas** proves stable
  when you reach it, use a real glass shader; otherwise approximate with additive feathered gradients
  + the illumination color. Only `legendary` gets it.

## De-risk FIRST — the perf prototype (before authoring the full library)

The one unproven technical risk in the whole stack is Rive-renderer FPS on a cheap phone. So build a
**minimal** seal first — two halves, ring, gold ignite, `open→legendary`, ~30-particle spark burst —
wire it into a bare **Expo dev build**, and run it on a **~$200 Android** watching the frame rate.
Holds → author the full part library with confidence. Stutters → cap particles / reserve the dense
spray for `legendary` only. Do not build the 30+ parts until this passes.

## Export contract

Ship one `.riv` (Rive Cadet plan — subscribe the export month, cancel between). The Expo app loads it
via `@rive-app/react-native`, binds `SealVM` to a computed `SigilSpec`, fires `cast` on ring-close,
and listens for `onPlank`/`onCeremonyEnd`. Because every name here matches the engine's literals, the
binding is mechanical — no translation layer.
