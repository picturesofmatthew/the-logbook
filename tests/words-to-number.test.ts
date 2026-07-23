import assert from "node:assert/strict";
import { test } from "node:test";
import { wordsToNumber } from "../lib/engine/words-to-number";

test("words-to-number: additive tens and ones", () => {
  assert.equal(wordsToNumber("thirty five"), "35");
  assert.equal(wordsToNumber("seventy two"), "72");
});

test("words-to-number: colloquial concatenation for weights", () => {
  assert.equal(wordsToNumber("one seventy-two"), "172");
  assert.equal(wordsToNumber("two twenty"), "220");
});

test("words-to-number: scale words, with and without 'and'", () => {
  assert.equal(wordsToNumber("a hundred and seventy two"), "172");
  assert.equal(wordsToNumber("two hundred twenty"), "220");
  assert.equal(wordsToNumber("one hundred"), "100");
});

test("words-to-number: single counts and surrounding text survive", () => {
  assert.equal(wordsToNumber("drank three waters"), "drank 3 waters");
  assert.equal(wordsToNumber("two eggs and toast"), "2 eggs and toast");
});

test("words-to-number: leaves non-number words alone", () => {
  assert.equal(wordsToNumber("feeling a little tired"), "feeling a little tired");
});
