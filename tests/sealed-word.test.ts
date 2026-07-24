import assert from "node:assert/strict";
import { test } from "node:test";
import {
  SEALED_WORD_MAX,
  revealSealedWord,
  trimSealedWord,
  wordWaits,
} from "../lib/sealed-word";

test("sealed word: one line, trimmed, capped", () => {
  assert.equal(trimSealedWord("  proud of you today  "), "proud of you today");
  // it's a line, not a paragraph
  assert.equal(trimSealedWord("proud of you\ntoday"), "proud of you today");
  // nothing pressed clears the word
  assert.equal(trimSealedWord("   "), null);
  assert.equal(trimSealedWord(""), null);
  const long = "a".repeat(SEALED_WORD_MAX + 50);
  assert.equal(trimSealedWord(long)?.length, SEALED_WORD_MAX);
});

test("sealed word: your own is always yours; theirs is earned", () => {
  const word = "I'd carry you anywhere";
  // your own word, before the ring closes — you can always reread what you sent
  assert.equal(
    revealSealedWord({ word, own: true, sealed: false }),
    word,
  );
  // their word, ring still open — withheld, and nothing of it leaks
  assert.equal(revealSealedWord({ word, own: false, sealed: false }), null);
  // the ring closes: it opens
  assert.equal(revealSealedWord({ word, own: false, sealed: true }), word);
  // no word at all stays nothing, sealed or not
  assert.equal(revealSealedWord({ word: null, own: false, sealed: true }), null);
});

test("sealed word: a waiting word announces itself, never its contents", () => {
  const word = "I'd carry you anywhere";
  assert.equal(wordWaits({ word, own: false, sealed: false }), true);
  // once the ring closes it isn't waiting — it's read
  assert.equal(wordWaits({ word, own: false, sealed: true }), false);
  // your own word never "waits" on you
  assert.equal(wordWaits({ word, own: true, sealed: false }), false);
  assert.equal(wordWaits({ word: null, own: false, sealed: false }), false);
});
