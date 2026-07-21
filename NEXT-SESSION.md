# Next Session — Prep Brief

*Two investigations, queued after the v1 polish batch shipped (2026-07-20). Read this cold and you're oriented. Neither is decided — these are scoped questions with current-state pointers, not plans.*

---

## 1 · Art-generation tooling — ✅ RESOLVED 2026-07-20

**Pipeline of record → `art/asset-sheets.md`.** Research finding: **ChatGPT is the wrong spine** (no
style-lock, weak character continuity, GPT Image 2 can't do transparent alpha). The pipeline is
**Bootstrap → Lock → Produce**: generate cohesive Inklight *boards* in **Nano Banana Pro** to
manufacture 12–15 masters → train a **Scenario** style model (+ character models, multi-LoRA merge)
to mass-produce on-style/on-alpha frames → **Recraft** (V3 for the set) for native-SVG sigils, with
`autotrace -centerline` fallback → wire **fal.ai + Recraft MCP** for in-loop gen. ~$60–80/mo full
(lean start ~$20–25). The 6 boards + prompts + workflow are all in `art/asset-sheets.md`. **Pending
Matthew's spine-commit on spend before Phase 2.** Original scoping notes preserved below.

**Goal:** find a pipeline that produces higher-quality Inklight assets than the hand-authored SVG we ship today — *if* one exists that stays palette-locked and style-consistent. Matthew's call: Inklight is a prototype language; if something brilliant shows up, we move to it.

**Current state**
- Beings + small folk: hand-authored SVG in the Inklight idiom (`components/glade/glade-scene.tsx`), framed for portraits via hardcoded viewBoxes (`components/glade/being-portrait.tsx` — note the ⚠ coupling comment).
- Fox: pixel string-maps (`components/sprites.ts`), previewable to PNG (`scripts/preview-sprite.mjs`).
- Sigil parts: placeholder geometry composed in `components/sigil/sigil-glyph.tsx`.
- Official pipeline of record: **Matthew via ChatGPT + human art direction** (`DIRECTION.md` §Art production). Prompt library lives at `art/prompts.md`.
- What the engine actually needs (from `DIRECTION.md`): sigil parts **must be SVG** (procedurally composed — 2 ring halves × 3 weights, 7 radicals, 6 ornaments, 4 tier cores, New Mark star, 10 legendary frames); beings as **PNG sprite sheets** (transparent, 2x/3x, per trust stage: idle loop 2–4 frames + arrival pose); small folk 1 frame + 1 motion frame; Glade plates as **layered washes** per light-state × vitality tier (layerable, not baked).

**Questions to answer**
- What tooling can hit the two-layer look (crisp ink line + matte gouache wash, ~20-swatch palette, silhouette-first) *consistently across a set*? Character-lock / style-lock is the hard part, not one-off quality.
- Raster (PNG sprite sheets) vs vector: for sigil parts we need clean single-weight SVG strokes — is raster→SVG vectorization viable, or is procedural/hand SVG still the right call there?
- Integration cost: the code already anticipates one-for-one layer swaps (SVG beings → PNG sprite sheets; placeholder sigil parts → real SVG). Confirm the drop-in seams and what a sprite-sheet loader would look like.
- Palette enforcement + IP safety: DIRECTION §IP safety is firm — *techniques and principles, never assets*; Mossling ≠ kodama, Pale Elk ≠ Shishigami. Any tool has to respect that.

**Leads to probe:** image-gen models for the gouache/ink register; sprite-sheet + trust-stage generation; background-removal / transparency; raster-to-SVG for sigil parts; reference-image / character-consistency techniques; whether the `art/prompts.md` prompts port to a non-ChatGPT tool. No image-gen plugin exists in this environment, so evaluate options *for Matthew to run*, then wire the outputs.

---

## 2 · Macro / calorie estimation logic — ✅ concrete gaps fixed in Phase 4

**Goal:** make macro/calorie numbers more trustworthy and easier to get right — without ever breaking the never-punishing tone (no red numbers, uncertainty shown gently).

**Current state** (only touched when donating a NEW specimen — daily logging reads the pantry)
- `lib/usda.ts` `searchFoods`: FDC nutrients are per-100g; scales to the food's serving **only when `servingSizeUnit` starts with "g"**, else `factor = 1` and label defaults to `"100 g"`.
- `app/api/food-search/route.ts`: the one real HTTP route; proxies USDA (still `DEMO_KEY` — tight rate limits).
- `components/journal/donate-flow.tsx`: pick a USDA result → prefill a specimen card, OR "write it in by hand" (kcal/P/C/F typed raw, zero assist). Recipes sum ingredient macros (`createRecipe` in `app/log/actions.ts`).
- `lib/engine/totals.ts` (add/scale/sum) and `lib/engine/tdee.ts` (Mifflin-St Jeor + activity multipliers + calorie floor) are pure + tested.

**Concrete gaps found (2026-07-20) — ✅ all resolved in Phase 4** (`scaleToServing` handles g/ml/oz/household portions, `atwaterCheck` cross-check added, natural-language food-parse shipped, real FDC key wired; see `PHASE-4-HANDOFF.md`). Kept below as the record. The still-open part is the forward-looking LLM-estimator question in "Questions to answer."
- **Non-gram servings are wrong.** `lib/usda.ts:69-76` — ml, oz, or "1 cup" foods skip scaling, keep raw per-100g numbers, and mislabel them `"100 g"`. The card silently misstates the portion. First thing to fix.
- **No Atwater cross-check.** Nothing validates that kcal ≈ P·4 + C·4 + F·9. A cheap sanity/confidence signal (and a gentle "these don't quite add up" nudge) is missing.
- **Manual entry has no help** — the "write it in by hand" path is a blank 4-field form.
- **No natural-language / portion estimation** — can't say "a bowl of pho" and get a starting estimate.

**Questions to answer**
- Fix the serving-scaling: handle ml/oz/household-text portions, and stop mislabeling. How far can we push with FDC data alone (`householdServingFullText`, `servingSize`+unit)?
- Is an LLM-assisted estimator worth it (describe a meal → macro estimate with a confidence band), and where does it live — the API route? A new engine? How does it degrade offline / on rate-limit?
- How do we *show uncertainty* in the Inklight voice — an estimate is a guess, and the design law says the world states the score wordlessly and never scolds. An "estimated" specimen might carry a soft mark, not a warning.
- Atwater as a validator vs. an auto-filler (compute the 4th value from the other three + kcal?).

**Constraints:** keep engine logic pure + tested (`lib/engine/*`); Windows env (never curl — Node/`Invoke-RestMethod`); watch curly-quote corruption; the donate flow is the only USDA touchpoint, so estimation improvements concentrate there + a possible new pure engine.
