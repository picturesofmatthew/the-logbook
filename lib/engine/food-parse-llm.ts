// LLM-assisted food-text PARSE — the messy-language step ONLY. It turns a
// free-text meal line into the exact structured items the deterministic
// `parseFoodLine` produces ({ qty, unit, name, raw }). Everything downstream is
// unchanged: the food-estimate route still grounds every item through the
// USDA/foods lookup for the real macros. The model NEVER invents calories or
// nutrition numbers — "a true number under the gilt" is brand law; the model's
// only job is to read the language.
//
// ADDITIVE and OFF BY DEFAULT. Callers take this branch only when
// FOOD_PARSE_LLM is truthy AND ANTHROPIC_API_KEY is present. With the flag
// unset, `parseFoodItems` returns exactly `parseFoodLine(text)` — the live
// behaviour is byte-identical. Any LLM error (or an empty parse) also degrades
// silently to the deterministic parser, so turning the flag on can never make
// logging fail — only, at worst, parse the same as before.

import type Anthropic from "@anthropic-ai/sdk";
import { parseFoodLine, type ParsedItem } from "./food-parse";

// Haiku 4.5 — cheapest tier, and it supports structured outputs. Do NOT pass
// thinking / effort params here: they error on Haiku.
const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 512;
// Match the USDA lookup's 8s budget so a slow model can't hang the log UI.
const TIMEOUT_MS = 8000;

// What the model returns per food. `unit` is a plain string ("" for a bare
// count like "2 eggs" / "a banana") rather than nullable, so the JSON schema
// stays inside the structured-outputs supported set.
type LlmFoodItem = { food: string; quantity: number; unit: string };
type LlmFoodPayload = { items: LlmFoodItem[] };

// Structured-outputs JSON schema. Every object needs `required` +
// `additionalProperties: false`.
const FOOD_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      description: "One entry per distinct food or drink mentioned.",
      items: {
        type: "object",
        properties: {
          food: {
            type: "string",
            description: "the food or drink name only — no quantity, no unit",
          },
          quantity: {
            type: "number",
            description: "the count or amount; 1 when unspecified",
          },
          unit: {
            type: "string",
            description:
              "measurement unit (g, kg, mg, oz, lb, ml, l, cup, tbsp, tsp, slice, piece, egg, handful, bowl, plate, scoop, clove, can, glass, strip, serving) or an empty string for a plain count",
          },
        },
        required: ["food", "quantity", "unit"],
        additionalProperties: false,
      },
    },
  },
  required: ["items"],
  additionalProperties: false,
};

const SYSTEM_PROMPT =
  "You read a person's description of what they ate or drank and extract each " +
  "distinct food or drink as a structured item: its name, a numeric quantity " +
  "(default 1 when unstated), and a measurement unit — or an empty string for a " +
  "plain count. Split combined phrases (e.g. \"eggs and toast\") into separate " +
  "items. Do NOT output calories, macros, or any nutrition numbers. Do NOT add " +
  "foods that were not mentioned. Return only the items.";

// The minimal slice of the SDK client this module uses. Keeping it narrow lets
// a test inject a mock without building a full client, while the request `body`
// is still checked against the real SDK param type.
export type LlmClient = {
  messages: {
    create(
      body: Anthropic.MessageCreateParamsNonStreaming,
      options?: { timeout?: number },
    ): Promise<Anthropic.Message>;
  };
};

// Truthy flag AND a key present — both are required to take the LLM branch.
export function foodParseLLMEnabled(): boolean {
  const flag = (process.env.FOOD_PARSE_LLM ?? "").trim().toLowerCase();
  const on = flag === "1" || flag === "true" || flag === "yes" || flag === "on";
  return on && !!process.env.ANTHROPIC_API_KEY;
}

// "" / "none" / "count" → null (a bare count), otherwise the trimmed, lowercased
// unit. Downstream `gramsFor` / `portionConfidence` already handle any unit not
// in their tables (falling back to the food's USDA serving weight), so an odd
// unit is safe.
function normalizeUnit(unit: string): string | null {
  const u = unit.trim().toLowerCase();
  return u === "" || u === "none" || u === "count" ? null : u;
}

// Pure map from the model payload to the deterministic parser's output shape.
// Exported for unit tests (no network, no SDK).
export function toParsedItems(payload: LlmFoodPayload): ParsedItem[] {
  const items = Array.isArray(payload?.items) ? payload.items : [];
  const out: ParsedItem[] = [];
  for (const it of items) {
    const name = String(it?.food ?? "").trim();
    if (!name) continue;
    const q = Number(it?.quantity);
    const qty = Number.isFinite(q) && q > 0 ? q : 1;
    const unit = normalizeUnit(String(it?.unit ?? ""));
    const raw = `${qty}${unit ? ` ${unit}` : ""} ${name}`.trim();
    out.push({ qty, unit, name, raw });
  }
  return out;
}

function extractPayload(msg: Anthropic.Message): LlmFoodPayload {
  const text = msg.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text",
  )?.text;
  if (!text) throw new Error("food-parse-llm: no text block in response");
  return JSON.parse(text) as LlmFoodPayload;
}

// Constructed lazily and only on the LLM branch, so the SDK is never pulled into
// the module graph when the flag is off.
async function defaultClient(): Promise<LlmClient> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 1 });
}

// The raw LLM parse. Throws on any failure so callers can fall back. Pass
// `client` to inject a mock in tests — production omits it.
export async function parseFoodLineLLM(
  text: string,
  client?: LlmClient,
): Promise<ParsedItem[]> {
  const c = client ?? (await defaultClient());
  const body: Anthropic.MessageCreateParamsNonStreaming = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: text }],
    output_config: { format: { type: "json_schema", schema: FOOD_SCHEMA } },
  };
  const msg = await c.messages.create(body, { timeout: TIMEOUT_MS });
  return toParsedItems(extractPayload(msg));
}

// The drop-in for `parseFoodLine` at the parse step. When the flag is off, this
// IS `parseFoodLine` (byte-identical). When on, it tries the LLM and silently
// degrades to the deterministic parser on any error or empty result. Either
// way the downstream USDA grounding is unchanged.
export async function parseFoodItems(
  text: string,
  client?: LlmClient,
): Promise<ParsedItem[]> {
  if (foodParseLLMEnabled()) {
    try {
      const items = await parseFoodLineLLM(text, client);
      if (items.length > 0) return items;
    } catch {
      // fall through to the deterministic parser
    }
  }
  return parseFoodLine(text);
}
