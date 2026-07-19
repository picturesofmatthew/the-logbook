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
