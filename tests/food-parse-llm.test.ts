import assert from "node:assert/strict";
import { test } from "node:test";
import { parseFoodLine } from "../lib/engine/food-parse";
import {
  foodParseLLMEnabled,
  parseFoodItems,
  parseFoodLineLLM,
  toParsedItems,
  type LlmClient,
} from "../lib/engine/food-parse-llm";

// ── A mock SDK client. NEVER hits the network — it returns a canned Message
// whose single text block is the structured-output JSON we want to test against
// (or throws, to exercise the fallback). ──

function mockClient(payload: unknown): LlmClient {
  return {
    messages: {
      create: async () =>
        ({ content: [{ type: "text", text: JSON.stringify(payload) }] }) as never,
    },
  };
}

function throwingClient(): LlmClient {
  return {
    messages: {
      create: async () => {
        throw new Error("network down");
      },
    },
  };
}

function withEnv(
  vars: Record<string, string | undefined>,
  fn: () => void | Promise<void>,
): void | Promise<void> {
  const saved: Record<string, string | undefined> = {};
  for (const k of Object.keys(vars)) {
    saved[k] = process.env[k];
    if (vars[k] === undefined) delete process.env[k];
    else process.env[k] = vars[k];
  }
  const restore = () => {
    for (const k of Object.keys(saved)) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  };
  try {
    const r = fn();
    if (r instanceof Promise) return r.finally(restore);
    restore();
  } catch (e) {
    restore();
    throw e;
  }
}

test("food-parse-llm: gate needs BOTH the flag and a key", () => {
  withEnv({ FOOD_PARSE_LLM: undefined, ANTHROPIC_API_KEY: undefined }, () => {
    assert.equal(foodParseLLMEnabled(), false);
  });
  withEnv({ FOOD_PARSE_LLM: "1", ANTHROPIC_API_KEY: undefined }, () => {
    assert.equal(foodParseLLMEnabled(), false); // flag on, no key
  });
  withEnv({ FOOD_PARSE_LLM: undefined, ANTHROPIC_API_KEY: "sk-test" }, () => {
    assert.equal(foodParseLLMEnabled(), false); // key, no flag
  });
  withEnv({ FOOD_PARSE_LLM: "true", ANTHROPIC_API_KEY: "sk-test" }, () => {
    assert.equal(foodParseLLMEnabled(), true);
  });
  withEnv({ FOOD_PARSE_LLM: "0", ANTHROPIC_API_KEY: "sk-test" }, () => {
    assert.equal(foodParseLLMEnabled(), false); // "0" is not truthy
  });
});

test("food-parse-llm: maps model payload to the deterministic ParsedItem shape", () => {
  const items = toParsedItems({
    items: [
      { food: "eggs", quantity: 2, unit: "" },
      { food: "chicken breast", quantity: 200, unit: "g" },
      { food: "banana", quantity: 1, unit: "count" },
    ],
  });
  assert.deepEqual(
    items.map((i) => [i.qty, i.unit, i.name, i.raw]),
    [
      [2, null, "eggs", "2 eggs"],
      [200, "g", "chicken breast", "200 g chicken breast"],
      [1, null, "banana", "1 banana"],
    ],
  );
});

test("food-parse-llm: mapping is defensive (bad qty, empty name, missing fields)", () => {
  const items = toParsedItems({
    items: [
      { food: "  ", quantity: 1, unit: "" }, // dropped: empty name
      { food: "rice", quantity: 0, unit: "cup" }, // qty <= 0 -> 1
      { food: "oats", quantity: NaN as unknown as number, unit: "g" }, // NaN -> 1
      { food: "  Toast ", quantity: 3, unit: " SLICE " }, // trimmed + lowercased
    ],
  });
  assert.deepEqual(
    items.map((i) => [i.qty, i.unit, i.name]),
    [
      [1, "cup", "rice"],
      [1, "g", "oats"],
      [3, "slice", "Toast"],
    ],
  );
});

test("food-parse-llm: parseFoodLineLLM reads structured output via an injected mock", async () => {
  const items = await parseFoodLineLLM(
    "two eggs and 200g chicken",
    mockClient({
      items: [
        { food: "eggs", quantity: 2, unit: "" },
        { food: "chicken", quantity: 200, unit: "g" },
      ],
    }),
  );
  assert.deepEqual(
    items.map((i) => [i.qty, i.unit, i.name]),
    [
      [2, null, "eggs"],
      [200, "g", "chicken"],
    ],
  );
});

test("food-parse-llm: parseFoodItems with the flag OFF is exactly parseFoodLine", () =>
  withEnv({ FOOD_PARSE_LLM: undefined, ANTHROPIC_API_KEY: "sk-test" }, async () => {
    const line = "2 eggs and a banana";
    // A throwing client would blow up if the LLM path were taken — proving the
    // deterministic branch is used when the flag is off.
    const got = await parseFoodItems(line, throwingClient());
    assert.deepEqual(got, parseFoodLine(line));
  }));

test("food-parse-llm: parseFoodItems falls back to deterministic on an LLM error", () =>
  withEnv({ FOOD_PARSE_LLM: "1", ANTHROPIC_API_KEY: "sk-test" }, async () => {
    const line = "2 eggs and a banana";
    const got = await parseFoodItems(line, throwingClient());
    assert.deepEqual(got, parseFoodLine(line));
  }));

test("food-parse-llm: parseFoodItems uses the LLM parse when enabled + it returns items", () =>
  withEnv({ FOOD_PARSE_LLM: "on", ANTHROPIC_API_KEY: "sk-test" }, async () => {
    const got = await parseFoodItems(
      "a bowl of oatmeal",
      mockClient({ items: [{ food: "oatmeal", quantity: 1, unit: "bowl" }] }),
    );
    assert.deepEqual(
      got.map((i) => [i.qty, i.unit, i.name]),
      [[1, "bowl", "oatmeal"]],
    );
  }));
