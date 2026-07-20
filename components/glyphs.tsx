// Inked mood-faces and ritual glyphs — single-weight strokes on currentColor,
// in the same rune register as the shell (technique, never lifted assets).
// Server-safe. These retire the system emoji from the daily rituals so the
// grimoire stays hand-drawn end to end. The stored mood is still the emoji
// (the sigil engine keys off it); only the rendering is inked here.

import type { ReactNode } from "react";

type GlyphProps = { className?: string; size?: number };

// A face token: a soft ring, then features a touch heavier over it.
function Face({
  className,
  size = 24,
  children,
}: GlyphProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" strokeWidth="1.5" opacity="0.8" />
      {children}
    </svg>
  );
}

// bright — round eyes, a wide smile (was 😊)
export function FaceBright(p: GlyphProps) {
  return (
    <Face {...p}>
      <circle cx="8.7" cy="10.6" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15.3" cy="10.6" r="1.15" fill="currentColor" stroke="none" />
      <path d="M8 13.8 Q12 17.6 16 13.8" />
    </Face>
  );
}

// calm — relaxed closed eyes, a soft small smile (was 😌)
export function FaceCalm(p: GlyphProps) {
  return (
    <Face {...p}>
      <path d="M7.4 11.4 Q8.9 12.6 10.4 11.4" />
      <path d="M13.6 11.4 Q15.1 12.6 16.6 11.4" />
      <path d="M9.7 14.7 Q12 15.9 14.3 14.7" />
    </Face>
  );
}

// fired-up — furrowed brows, a pressed mouth, two huffs (was 😤)
export function FaceFired(p: GlyphProps) {
  return (
    <Face {...p}>
      <path d="M7.6 9.6 L10.2 10.8" />
      <path d="M16.4 9.6 L13.8 10.8" />
      <circle cx="9" cy="12.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12.2" r="0.9" fill="currentColor" stroke="none" />
      <path d="M9.6 15.4 L14.4 15.4" />
      <path d="M10.3 17.6 Q9.7 18.7 10.5 19.4" opacity="0.7" />
      <path d="M13.7 17.6 Q14.3 18.7 13.5 19.4" opacity="0.7" />
    </Face>
  );
}

// weary — half-lidded eyes, a small yawn, a drifting z (was 🥱)
export function FaceWeary(p: GlyphProps) {
  return (
    <Face {...p}>
      <path d="M7.8 11 L10.2 11" />
      <path d="M13.8 11 L16.2 11" />
      <ellipse cx="12" cy="15.2" rx="1.7" ry="2.1" />
      <path d="M16.4 5.4 H18.6 L16.4 7.8 H18.6" strokeWidth="1.2" opacity="0.75" />
    </Face>
  );
}

// bittersweet — a gentle smile carried with a single tear (was 🥲)
export function FaceBittersweet(p: GlyphProps) {
  return (
    <Face {...p}>
      <path d="M7.4 10.1 Q8.9 9.3 10.4 10.1" />
      <path d="M13.6 10.1 Q15.1 9.3 16.6 10.1" />
      <circle cx="8.9" cy="11.5" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="15.1" cy="11.5" r="0.95" fill="currentColor" stroke="none" />
      <path d="M9.7 14.7 Q12 16.1 14.3 14.7" />
      <path d="M8.9 13.2 Q7.9 14.8 8.9 15.6 Q9.9 14.8 8.9 13.2 Z" fill="currentColor" stroke="none" />
    </Face>
  );
}

// The stored mood is the emoji; this maps it to its inked face.
const FACES: Record<string, (p: GlyphProps) => ReactNode> = {
  "😊": FaceBright,
  "😌": FaceCalm,
  "😤": FaceFired,
  "🥱": FaceWeary,
  "🥲": FaceBittersweet,
};

export function MoodFace({ mood, ...p }: GlyphProps & { mood: string }) {
  const F = FACES[mood];
  return F ? <F {...p} /> : null;
}

// A water drop — hollow when the cup's unkept, inked solid when filled.
export function WaterDrop({
  filled,
  className,
  size = 24,
}: GlyphProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3.5 C12 3.5 5.5 11.5 5.5 15.5 A6.5 6.5 0 0 0 18.5 15.5 C18.5 11.5 12 3.5 12 3.5 Z" />
    </svg>
  );
}
