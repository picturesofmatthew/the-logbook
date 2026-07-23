// A tappable object inside a room's SVG scene — a book on the shelf, the vessel
// at the dock. One place for the shared affordance wiring (the `.world-hotspot`
// class + `data-hotspot` the shell's swipe-guard looks for, plus button
// semantics and Enter/Space activation), so every room's hotspots behave alike.

import type { ReactNode } from "react";

export function Hotspot({
  label,
  onActivate,
  transform,
  children,
}: {
  /** the accessible name, e.g. "Open the shore — toward Kauai". */
  label: string;
  onActivate: () => void;
  transform?: string;
  children: ReactNode;
}) {
  return (
    <g
      className="world-hotspot"
      data-hotspot="true"
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      transform={transform}
    >
      {children}
    </g>
  );
}
