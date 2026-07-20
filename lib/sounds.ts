// Tiny synthesized chimes — no audio files, just WebAudio.
// Client-only; every function no-ops on the server or when muted.

const MUTE_KEY = "logbook_muted";
const muteListeners = new Set<() => void>();

export function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(MUTE_KEY) === "1";
}

export function setMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  for (const cb of muteListeners) cb();
}

// For useSyncExternalStore subscribers (the settings toggle).
export function subscribeMuted(cb: () => void): () => void {
  muteListeners.add(cb);
  return () => muteListeners.delete(cb);
}

let ctx: AudioContext | null = null;

function audioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  ac: AudioContext,
  freq: number,
  startOffset: number,
  duration: number,
  peak = 0.06,
) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  const t0 = ac.currentTime + startOffset;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

// A soft two-note pop for an ordinary log.
export function logChime(): void {
  if (isMuted()) return;
  const ac = audioCtx();
  if (!ac) return;
  tone(ac, 659.25, 0, 0.12);
  tone(ac, 880, 0.09, 0.16);
}

// A little museum fanfare for a new specimen.
export function ceremonyChime(): void {
  if (isMuted()) return;
  const ac = audioCtx();
  if (!ac) return;
  tone(ac, 523.25, 0, 0.14);
  tone(ac, 659.25, 0.1, 0.14);
  tone(ac, 783.99, 0.2, 0.14);
  tone(ac, 1046.5, 0.3, 0.32, 0.07);
}

// A tiny droplet blip for rituals.
export function ritualChime(): void {
  if (isMuted()) return;
  const ac = audioCtx();
  if (!ac) return;
  tone(ac, 987.77, 0, 0.09, 0.04);
}

// Slow-attack sine for the ceremonial sounds — warmth, not sparkle.
function swell(
  ac: AudioContext,
  freq: number,
  startOffset: number,
  duration: number,
  peak = 0.045,
) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  const t0 = ac.currentTime + startOffset;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.18);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

// The one low warm tone reserved for legendary reveals: a slow G-major hum
// from the bottom of the register, with one faint high shimmer at the end —
// violet arriving.
export function legendaryTone(): void {
  if (isMuted()) return;
  const ac = audioCtx();
  if (!ac) return;
  swell(ac, 98, 0, 2.2, 0.05); // G2
  swell(ac, 196, 0.12, 2.0, 0.045); // G3
  swell(ac, 293.66, 0.28, 1.8, 0.035); // D4
  swell(ac, 392, 0.44, 1.6, 0.028); // G4
  tone(ac, 1567.98, 1.1, 0.5, 0.02); // the shimmer
}

// Two halves meeting: moss, then ember, resolving into one held note.
// Played once when the day's ring first closes. Quieter than arrival.
export function sealTone(): void {
  if (isMuted()) return;
  const ac = audioCtx();
  if (!ac) return;
  swell(ac, 220, 0, 0.9, 0.032); // A3 — one half
  swell(ac, 329.63, 0.18, 0.9, 0.03); // E4 — the other
  swell(ac, 440, 0.5, 1.1, 0.026); // A4 — the union
}

// A gentle rising presence for a being's arrival — quieter than legend.
export function arrivalTone(): void {
  if (isMuted()) return;
  const ac = audioCtx();
  if (!ac) return;
  swell(ac, 261.63, 0, 1.2, 0.04); // C4
  swell(ac, 392, 0.25, 1.2, 0.035); // G4
}

// A bright little rising spark for a New Mark — bigger than a pen-tap,
// far smaller than a legend. Iron, honored.
export function newMarkTone(): void {
  if (isMuted()) return;
  const ac = audioCtx();
  if (!ac) return;
  tone(ac, 659.25, 0, 0.12); // E5
  tone(ac, 880, 0.1, 0.12); // A5
  tone(ac, 1318.51, 0.22, 0.3, 0.035); // E6 — the star
}

// A dry pen-tap for inscribing a workout.
export function inscribeTick(): void {
  if (isMuted()) return;
  const ac = audioCtx();
  if (!ac) return;
  tone(ac, 220, 0, 0.05, 0.05);
  tone(ac, 330, 0.05, 0.06, 0.035);
}
