// The engraved rune-glyphs of the shell — single-weight ink strokes on
// `currentColor` so they follow the light-script. Original marks in the
// inked-rune register (technique, never lifted assets). Server-safe.

import type { ReactNode } from "react";

type RuneProps = { className?: string; size?: number };

function Svg({
  className,
  size = 24,
  strokeWidth = 1.9,
  children,
}: RuneProps & { children: ReactNode; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// The world: a horizon, a sun/moon, a sprout rising.
export function GladeRune(props: RuneProps) {
  return (
    <Svg {...props}>
      <path d="M3 16 Q12 9 21 16" />
      <circle cx="12" cy="7.5" r="2.3" />
      <path d="M12 16 v-3.5 M12 13 q3 -.6 3.4 -3.6 M12 13.6 q-2.6 -.4 -3 -3" />
    </Svg>
  );
}

// The day's seal — concentric rings + a cross radical.
export function TodayRune(props: RuneProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9.4" strokeDasharray="3.4 4" />
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3.6 V7 M12 17 V20.4 M3.6 12 H7 M17 12 H20.4" />
    </Svg>
  );
}

// An arched vault with shelves — the museum-pantry.
export function PantryRune(props: RuneProps) {
  return (
    <Svg {...props}>
      <path d="M4 20 V11 A8 8 0 0 1 20 11 V20" />
      <path d="M4 20 H20 M8 20 V13.5 M16 20 V13.5" />
      <circle cx="12" cy="12.5" r="2" />
    </Svg>
  );
}

// An open spellbook with a rune on the page.
export function BookRune(props: RuneProps) {
  return (
    <Svg {...props}>
      <path d="M12 6 C9 4 5 4 3.5 5 V18 C5 17 9 17 12 19 C15 17 19 17 20.5 18 V5 C19 4 15 4 12 6 Z" />
      <path d="M12 6 V19" />
      <circle cx="7.4" cy="10.5" r="1.4" />
    </Svg>
  );
}

// A star-chart — an ascending line pinned by stars.
export function TrendsRune(props: RuneProps) {
  return (
    <Svg {...props}>
      <path d="M4 17 L9 12 L13 14 L20 6" />
      <circle cx="4" cy="17" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="13" cy="14" r="1.5" />
      <circle cx="20" cy="6" r="1.5" />
      <path d="M18.4 6 L20 4.6 L21.4 6.2" opacity="0.7" />
    </Svg>
  );
}

// A quill nib — the mark of logging.
export function QuillRune(props: RuneProps) {
  return (
    <Svg {...props} strokeWidth={2}>
      <path d="M6 20 C10 16 14 10 19 5 C19 9 16 15 11 18 Z" />
      <path d="M6 20 L11 15" />
      <circle cx="13.5" cy="11" r="1" />
    </Svg>
  );
}

// A stag's crown — antlers branching over a still head. Marks the bestiary.
export function BestiaryRune(props: RuneProps) {
  return (
    <Svg {...props}>
      <path d="M9.6 20 Q12 21.8 14.4 20 Q15.8 17 12 16 Q8.2 17 9.6 20 Z" />
      <path d="M10 16 Q8.2 12.4 9 8.6 M9 10.4 Q7.2 9.4 5.6 9.8 M9.2 8.8 Q8.4 7.2 6.8 6.8" />
      <path d="M14 16 Q15.8 12.4 15 8.6 M15 10.4 Q16.8 9.4 18.4 9.8 M14.8 8.8 Q15.6 7.2 17.2 6.8" />
    </Svg>
  );
}
