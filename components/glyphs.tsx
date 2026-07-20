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

// A stroke-glyph wrapper — the shared ink register for the marks below.
function Ink({
  className,
  size = 24,
  sw = 1.7,
  fill = "none",
  children,
}: GlyphProps & { sw?: number; fill?: string; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// A four-point sparkle — the app's star, replacing ✦.
export function StarMark({ className, size = 24 }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.2 L13.6 9.4 Q13.8 10.2 14.6 10.4 L21.8 12 L14.6 13.6 Q13.8 13.8 13.6 14.6 L12 21.8 L10.4 14.6 Q10.2 13.8 9.4 13.6 L2.2 12 L9.4 10.4 Q10.2 10.2 10.4 9.4 Z" />
    </svg>
  );
}

// A small filled heart — replacing ♥.
export function HeartMark({ className, size = 24 }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20.4 C12 20.4 3.6 14.8 3.6 8.8 C3.6 6.2 5.7 4.4 8 4.4 C9.9 4.4 11.4 5.6 12 7 C12.6 5.6 14.1 4.4 16 4.4 C18.3 4.4 20.4 6.2 20.4 8.8 C20.4 14.8 12 20.4 12 20.4 Z" />
    </svg>
  );
}

// The meals, as marks of the day's turn: a rising sun, a high sun, a moon,
// a scatter of bites. (The stored meal id stays; only the mark is drawn.)
export function MealGlyph({ meal, ...p }: GlyphProps & { meal: string }) {
  switch (meal) {
    case "breakfast":
      return (
        <Ink {...p}>
          <line x1="3" y1="18" x2="21" y2="18" />
          <path d="M7 18 A5 5 0 0 1 17 18" />
          <path d="M12 4.5 V6.5 M5.5 8 L7 9.4 M18.5 8 L17 9.4 M3.5 14 H5.5 M18.5 14 H20.5" />
        </Ink>
      );
    case "lunch":
      return (
        <Ink {...p}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3 V5 M12 19 V21 M3 12 H5 M19 12 H21 M5.6 5.6 L7 7 M17 17 L18.4 18.4 M18.4 5.6 L17 7 M7 17 L5.6 18.4" />
        </Ink>
      );
    case "dinner":
      return (
        <Ink {...p}>
          <path d="M15 4 A8 8 0 1 0 15 20 A6.3 6.3 0 1 1 15 4 Z" />
          <path d="M7 6 L7.6 7.6 L9.2 8.2 L7.6 8.8 L7 10.4 L6.4 8.8 L4.8 8.2 L6.4 7.6 Z" fill="currentColor" stroke="none" />
        </Ink>
      );
    case "snacks":
      return (
        <Ink {...p} fill="currentColor">
          <circle cx="8" cy="13.5" r="2" stroke="none" />
          <circle cx="13.5" cy="9.5" r="1.7" stroke="none" />
          <circle cx="15.5" cy="15" r="2.2" stroke="none" />
        </Ink>
      );
    default:
      return null;
  }
}

// The ways to move: a barbell, a heartbeat, a resting moon.
export function WorkoutGlyph({ kind, ...p }: GlyphProps & { kind: string }) {
  switch (kind) {
    case "lift":
      return (
        <Ink {...p} sw={1.8}>
          <line x1="6" y1="12" x2="18" y2="12" />
          <line x1="6" y1="8.5" x2="6" y2="15.5" strokeWidth="2.5" />
          <line x1="18" y1="8.5" x2="18" y2="15.5" strokeWidth="2.5" />
          <line x1="3.5" y1="10.2" x2="3.5" y2="13.8" />
          <line x1="20.5" y1="10.2" x2="20.5" y2="13.8" />
        </Ink>
      );
    case "cardio":
      return (
        <Ink {...p} sw={1.8}>
          <path d="M3 13 H8 L10 8 L13.5 17 L15.5 13 H21" />
        </Ink>
      );
    case "rest":
      return (
        <Ink {...p}>
          <path d="M20 15 A8.5 8.5 0 1 1 10.5 4.2 A6.6 6.6 0 0 0 20 15 Z" />
          <path d="M15.5 6.5 H18 L15.5 9 H18" strokeWidth="1.2" opacity="0.75" />
        </Ink>
      );
    default:
      return null;
  }
}

// A bowl with steam — the mark for eating / assembling a dish.
export function EatGlyph(p: GlyphProps) {
  return (
    <Ink {...p}>
      <path d="M3.5 12.5 A8.5 8.5 0 0 0 20.5 12.5 Z" />
      <line x1="2.5" y1="12.5" x2="21.5" y2="12.5" />
      <path d="M9 8.5 Q10.2 6.8 9 5 M12 8.5 Q13.2 6.8 12 5 M15 8.5 Q16.2 6.8 15 5" opacity="0.8" />
    </Ink>
  );
}

// The day-stamp marks on the glade, chosen by stamp kind.
export function StampMark({ kind, ...p }: GlyphProps & { kind: string }) {
  switch (kind) {
    case "heart":
      return <HeartMark {...p} />;
    case "lift":
      return <WorkoutGlyph kind="lift" {...p} />;
    case "cardio":
      return <WorkoutGlyph kind="cardio" {...p} />;
    case "water":
      return <WaterDrop filled {...p} />;
    default:
      return <StarMark {...p} />;
  }
}
