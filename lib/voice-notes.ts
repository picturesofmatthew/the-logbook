// Shared rules for the ephemeral voice note — pure, so both the server action
// and its tests use the same source of truth.
//
// A note recorded on `day` lives through today + all of tomorrow, then it is
// erased into the night. Expiry is expressed as a couple-DAY cutoff (not a
// wall-clock timestamp) so it rides the app's canonical clock with no
// timezone-offset math: the note simply fades when the couple-day turns over.

import { addDays } from "./dates-client";

// Client caps a recording at 30s; the server keeps a little slack as a backstop.
export const VOICE_MAX_DURATION_S = 35;
// ~187 KB of audio bytes as base64 — a short spoken note, never a blob store.
export const VOICE_MAX_AUDIO_B64 = 250_000;
export const VOICE_ALLOWED_MIME = [
  "audio/webm",
  "audio/mp4",
  "audio/ogg",
  "audio/mpeg",
] as const;

// A note is live iff note.day >= liveCutoff(today) — i.e. today or yesterday.
export function voiceNoteLiveCutoff(today: string): string {
  return addDays(today, -1);
}

export function voiceNoteIsLive(noteDay: string, today: string): boolean {
  return noteDay >= voiceNoteLiveCutoff(today);
}

export function isAllowedVoiceMime(mime: string): boolean {
  return (VOICE_ALLOWED_MIME as readonly string[]).includes(mime);
}
