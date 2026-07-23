import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isAllowedVoiceMime,
  voiceNoteIsLive,
  voiceNoteLiveCutoff,
} from "../lib/voice-notes";

test("voice-note expiry: live today and tomorrow, gone the day after", () => {
  const recorded = "2026-07-22";
  assert.equal(voiceNoteIsLive(recorded, "2026-07-22"), true); // recorded today
  assert.equal(voiceNoteIsLive(recorded, "2026-07-23"), true); // tomorrow — still here
  assert.equal(voiceNoteIsLive(recorded, "2026-07-24"), false); // into the night
});

test("voice-note expiry: the cutoff is yesterday", () => {
  assert.equal(voiceNoteLiveCutoff("2026-07-22"), "2026-07-21");
  assert.equal(voiceNoteLiveCutoff("2026-01-01"), "2025-12-31");
});

test("voice-note: only allow-listed audio mimes are accepted", () => {
  assert.equal(isAllowedVoiceMime("audio/webm"), true);
  assert.equal(isAllowedVoiceMime("audio/mp4"), true);
  assert.equal(isAllowedVoiceMime("video/mp4"), false);
  assert.equal(isAllowedVoiceMime("text/html"), false);
});
