// Turn spoken number words into digits, in place, so the rest of the dictation
// pipeline (and the food/workout parsers it delegates to) sees "172" not
// "one seventy two". Pure + unit-tested.
//
// Handles three shapes people actually say:
//   - additive:      "thirty five"            -> 35
//   - scale words:   "a hundred and seventy two" -> 172,  "two hundred twenty" -> 220
//   - concatenation: "one seventy-two"        -> 172,  "two twenty" -> 220
//     (the colloquial form for weights/prices — "one-seventy-two" means 172,
//      not 1+70+2). Only fires on a leading single digit before a tens/teens.

const ONES: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9,
};
const TEENS: Record<string, number> = {
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
};
const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};
const SCALES: Record<string, number> = { hundred: 100, thousand: 1000 };

const ALL_WORDS = [
  ...Object.keys(ONES), ...Object.keys(TEENS),
  ...Object.keys(TENS), ...Object.keys(SCALES),
];

function valueOf(word: string): number {
  return ONES[word] ?? TEENS[word] ?? TENS[word] ?? 0;
}

// Sum a scale-less run: "seventy two" -> 72, "thirty five" -> 35.
function additive(words: string[]): number {
  return words.reduce((sum, w) => sum + valueOf(w), 0);
}

function evalWords(match: string): number {
  const words = match
    .toLowerCase()
    .split(/[\s-]+/)
    .filter((w) => w && w !== "and");
  if (words.length === 0) return 0;

  const hasScale = words.some((w) => w in SCALES);
  if (!hasScale) {
    // Concatenation: "one seventy-two" -> 172, "two twenty" -> 220.
    const [first, second] = words;
    if (
      words.length >= 2 &&
      first in ONES && ONES[first] >= 1 &&
      (second in TENS || second in TEENS)
    ) {
      return ONES[first] * 100 + additive(words.slice(1));
    }
    return additive(words);
  }

  // Standard scale accumulation: "two hundred twenty" -> 220.
  let total = 0;
  let current = 0;
  for (const w of words) {
    if (w === "hundred") current = (current || 1) * 100;
    else if (w === "thousand") {
      total += (current || 1) * 1000;
      current = 0;
    } else current += valueOf(w);
  }
  return total + current;
}

const NUM_WORD = ALL_WORDS.join("|");
// A run: a number word, then any number of (optional "and") number words,
// joined by spaces or hyphens ("thirty-five", "one seventy two").
const RUN_RE = new RegExp(
  `\\b(?:${NUM_WORD})(?:[\\s-]+(?:and[\\s-]+)?(?:${NUM_WORD}))*\\b`,
  "gi",
);

export function wordsToNumber(text: string): string {
  // "a hundred" / "an thousand" read as one times the scale.
  const primed = text.replace(/\b(?:a|an)\s+(hundred|thousand)\b/gi, "one $1");
  return primed.replace(RUN_RE, (m) => String(evalWords(m)));
}
