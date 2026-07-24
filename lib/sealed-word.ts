// The Sealed Word — one line a keeper presses to the other, kept forever.
//
// The app is named for a correspondence but has only ever recorded macros. This
// is the record you'd never delete: the day's seal composes from both your
// data, and now the day's page carries both your words.
//
// Two rules live here, pure and testable — no db, no crypto, no React:
//   1) the LENGTH law — a word, not an essay (one line, trimmed).
//   2) the REVEAL law — your own word is always yours; your keeper's opens only
//      when the ring closes. Never before: the reveal is earned, together.
//
// Tone law applies. A word still sealed is a thing to look forward to, never a
// scold — the copy that renders it must read as a pull, not a punishment.

export const SEALED_WORD_MAX = 200;

// Normalize what a keeper typed: collapse newlines (it's one line), trim, cap.
// Empty in means null out — pressing nothing clears the word.
export function trimSealedWord(raw: string): string | null {
  const oneLine = raw.replace(/\s+/g, " ").trim();
  return oneLine ? oneLine.slice(0, SEALED_WORD_MAX) : null;
}

// The reveal law. `own` = this word is the viewer's own; `sealed` = the day's
// ring closed (both keepers logged). Returns the word only when it may be read.
export function revealSealedWord(input: {
  word: string | null;
  own: boolean;
  sealed: boolean;
}): string | null {
  if (input.word == null) return null;
  return input.own || input.sealed ? input.word : null;
}

// Is there a word waiting that the viewer may not read yet? (Drives the "a word
// waits" line — it says THAT one exists, never what it says.)
export function wordWaits(input: {
  word: string | null;
  own: boolean;
  sealed: boolean;
}): boolean {
  return input.word != null && !input.own && !input.sealed;
}
